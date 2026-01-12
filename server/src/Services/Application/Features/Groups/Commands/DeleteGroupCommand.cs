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
    public class DeleteGroupCommand : IRequest<ApiResponse<bool>>
    {
        public int GroupId { get; set; }
    }

    public class DeleteGroupCommandHandler : IRequestHandler<DeleteGroupCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public DeleteGroupCommandHandler(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<bool>> Handle(DeleteGroupCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = _currentUserService.UserId;

                // Tìm nhóm
                var group = await _context.Groups
                    .FirstOrDefaultAsync(g => g.GroupId == request.GroupId && g.Actived == true, cancellationToken);

                if (group == null)
                {
                    return ApiResponse<bool>.FailResponse("Nhóm không tồn tại.", new List<string>());
                }

                // Chỉ người tạo nhóm mới được xóa
                if (group.CreatedByUserId != userId)
                {
                    return ApiResponse<bool>.FailResponse("Chỉ người tạo nhóm mới có quyền xóa nhóm.", new List<string>());
                }

                // Soft delete
                group.Actived = false;
                group.DeletedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync(cancellationToken);

                return ApiResponse<bool>.SuccessResponse(true, "Xóa nhóm thành công.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailResponse("Xóa nhóm thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
