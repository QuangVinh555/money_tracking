using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.CurrentUser;
using Application.Features.DTOs.Groups;
using Core.Common;
using Infrastructure.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Groups.Commands
{
    public class CreateGroupCommand : IRequest<ApiResponse<GroupResponse>>
    {
        public string GroupName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class CreateGroupCommandHandler : IRequestHandler<CreateGroupCommand, ApiResponse<GroupResponse>>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public CreateGroupCommandHandler(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<ApiResponse<GroupResponse>> Handle(CreateGroupCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = _currentUserService.UserId;

                // Tạo nhóm mới
                var group = new Group
                {
                    GroupName = request.GroupName,
                    Description = request.Description,
                    CreatedByUserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    Actived = true
                };

                _context.Groups.Add(group);
                await _context.SaveChangesAsync(cancellationToken);

                // Tự động thêm người tạo làm admin
                var groupMember = new GroupMember
                {
                    GroupId = group.GroupId,
                    UserId = userId,
                    Role = "admin",
                    JoinedAt = DateTime.UtcNow,
                    Actived = true
                };

                _context.GroupMembers.Add(groupMember);
                await _context.SaveChangesAsync(cancellationToken);

                // Lấy thông tin user để trả về
                var user = await _context.Users.FindAsync(userId);

                var response = new GroupResponse
                {
                    GroupId = group.GroupId,
                    GroupName = group.GroupName,
                    Description = group.Description,
                    CreatedByUserId = userId,
                    CreatedByUserName = user?.Fullname ?? "",
                    MemberCount = 1,
                    CreatedAt = group.CreatedAt
                };

                return ApiResponse<GroupResponse>.SuccessResponse(response, "Tạo nhóm thành công.");
            }
            catch (Exception ex)
            {
                return ApiResponse<GroupResponse>.FailResponse("Tạo nhóm thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
