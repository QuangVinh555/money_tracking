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
    public class UpdateGroupCommand : IRequest<ApiResponse<bool>>
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal? BudgetLimit { get; set; }
    }

    public class UpdateGroupCommandHandler : IRequestHandler<UpdateGroupCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public UpdateGroupCommandHandler(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<bool>> Handle(UpdateGroupCommand request, CancellationToken cancellationToken)
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
                    return ApiResponse<bool>.FailResponse("Chỉ admin mới có quyền cập nhật thông tin nhóm.", new List<string>());
                }

                // Tìm nhóm
                var group = await _context.Groups
                    .FirstOrDefaultAsync(g => g.GroupId == request.GroupId && g.Actived == true, cancellationToken);

                if (group == null)
                {
                    return ApiResponse<bool>.FailResponse("Nhóm không tồn tại.", new List<string>());
                }

                // Cập nhật thông tin
                group.GroupName = request.GroupName;
                group.Description = request.Description;
                if (request.BudgetLimit.HasValue)
                {
                    group.BudgetLimit = request.BudgetLimit.Value;
                }
                group.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                return ApiResponse<bool>.SuccessResponse(true, "Cập nhật nhóm thành công.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailResponse("Cập nhật nhóm thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
