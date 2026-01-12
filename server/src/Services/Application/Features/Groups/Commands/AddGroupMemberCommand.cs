using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.CurrentUser;
using Core.Common;
using Infrastructure.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Groups.Commands
{
    public class AddGroupMemberCommand : IRequest<ApiResponse<bool>>
    {
        public int GroupId { get; set; }
        public int UserIdToAdd { get; set; }
        public string Role { get; set; } = "member"; // "admin" or "member"
    }

    public class AddGroupMemberCommandHandler : IRequestHandler<AddGroupMemberCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public AddGroupMemberCommandHandler(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<bool>> Handle(AddGroupMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = _currentUserService.UserId;

                // Kiểm tra nhóm có tồn tại không
                var group = await _context.Groups
                    .FirstOrDefaultAsync(g => g.GroupId == request.GroupId && g.Actived == true, cancellationToken);

                if (group == null)
                {
                    return ApiResponse<bool>.FailResponse("Nhóm không tồn tại.", new List<string>());
                }

                // Kiểm tra người dùng hiện tại có phải admin không
                var currentUserMember = await _context.GroupMembers
                    .FirstOrDefaultAsync(gm => gm.GroupId == request.GroupId 
                        && gm.UserId == userId 
                        && gm.Actived == true, cancellationToken);

                if (currentUserMember == null || currentUserMember.Role != "admin")
                {
                    return ApiResponse<bool>.FailResponse("Chỉ admin mới có quyền thêm thành viên.", new List<string>());
                }

                // Kiểm tra user cần thêm có tồn tại không
                var userToAdd = await _context.Users.FindAsync(request.UserIdToAdd);
                if (userToAdd == null)
                {
                    return ApiResponse<bool>.FailResponse("Người dùng không tồn tại.", new List<string>());
                }

                // Kiểm tra user đã là thành viên chưa
                var existingMember = await _context.GroupMembers
                    .FirstOrDefaultAsync(gm => gm.GroupId == request.GroupId 
                        && gm.UserId == request.UserIdToAdd, cancellationToken);

                if (existingMember != null)
                {
                    if (existingMember.Actived == true)
                    {
                        return ApiResponse<bool>.FailResponse("Người dùng đã là thành viên của nhóm.", new List<string>());
                    }
                    else
                    {
                        // Kích hoạt lại thành viên
                        existingMember.Actived = true;
                        existingMember.JoinedAt = DateTime.UtcNow;
                        existingMember.Role = request.Role;
                        await _context.SaveChangesAsync(cancellationToken);
                        return ApiResponse<bool>.SuccessResponse(true, "Thêm thành viên thành công.");
                    }
                }

                // Thêm thành viên mới
                var groupMember = new GroupMember
                {
                    GroupId = request.GroupId,
                    UserId = request.UserIdToAdd,
                    Role = request.Role,
                    JoinedAt = DateTime.UtcNow,
                    Actived = true
                };

                _context.GroupMembers.Add(groupMember);
                await _context.SaveChangesAsync(cancellationToken);

                return ApiResponse<bool>.SuccessResponse(true, "Thêm thành viên thành công.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailResponse("Thêm thành viên thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
