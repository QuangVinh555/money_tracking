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
    public class RemoveGroupMemberCommand : IRequest<ApiResponse<bool>>
    {
        public int GroupId { get; set; }
        public int UserIdToRemove { get; set; }
    }

    public class RemoveGroupMemberCommandHandler : IRequestHandler<RemoveGroupMemberCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public RemoveGroupMemberCommandHandler(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<bool>> Handle(RemoveGroupMemberCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = _currentUserService.UserId;

                // Kiểm tra người dùng hiện tại có phải admin không
                var currentUserMember = await _context.GroupMembers
                    .FirstOrDefaultAsync(gm => gm.GroupId == request.GroupId 
                        && gm.UserId == userId 
                        && gm.Actived == true, cancellationToken);

                if (currentUserMember == null || currentUserMember.Role != "admin")
                {
                    return ApiResponse<bool>.FailResponse("Chỉ admin mới có quyền xóa thành viên.", new List<string>());
                }

                // Kiểm tra nhóm có tồn tại không
                var group = await _context.Groups.FindAsync(request.GroupId);
                if (group == null)
                {
                    return ApiResponse<bool>.FailResponse("Nhóm không tồn tại.", new List<string>());
                }

                // Không cho phép xóa người tạo nhóm
                if (request.UserIdToRemove == group.CreatedByUserId)
                {
                    return ApiResponse<bool>.FailResponse("Không thể xóa người tạo nhóm.", new List<string>());
                }

                // Tìm thành viên cần xóa
                var memberToRemove = await _context.GroupMembers
                    .FirstOrDefaultAsync(gm => gm.GroupId == request.GroupId 
                        && gm.UserId == request.UserIdToRemove 
                        && gm.Actived == true, cancellationToken);

                if (memberToRemove == null)
                {
                    return ApiResponse<bool>.FailResponse("Thành viên không tồn tại trong nhóm.", new List<string>());
                }

                // Soft delete
                memberToRemove.Actived = false;
                await _context.SaveChangesAsync(cancellationToken);

                return ApiResponse<bool>.SuccessResponse(true, "Xóa thành viên thành công.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailResponse("Xóa thành viên thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
