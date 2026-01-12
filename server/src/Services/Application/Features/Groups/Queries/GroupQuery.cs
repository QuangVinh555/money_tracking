using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.CurrentUser;
using Application.Features.DTOs.Groups;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Groups.Queries
{
    public interface IGroupQuery
    {
        /// <summary>
        /// Lấy danh sách tất cả nhóm mà user là thành viên
        /// </summary>
        Task<List<GroupResponse>> GetGroupsAsync();

        /// <summary>
        /// Lấy chi tiết nhóm (thông tin + thành viên)
        /// </summary>
        Task<GroupDetailResponse?> GetGroupDetailAsync(int groupId);
    }

    public class GroupQuery : IGroupQuery
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GroupQuery(AppDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<GroupResponse>> GetGroupsAsync()
        {
            var userId = _currentUser.UserId;

            var groups = await _context.GroupMembers
                .Where(gm => gm.UserId == userId && gm.Actived == true)
                .Include(gm => gm.Group)
                    .ThenInclude(g => g.CreatedByUser)
                .Include(gm => gm.Group)
                    .ThenInclude(g => g.GroupMembers)
                .Where(gm => gm.Group.Actived == true)
                .Select(gm => new GroupResponse
                {
                    GroupId = gm.Group.GroupId,
                    GroupName = gm.Group.GroupName,
                    Description = gm.Group.Description,
                    CreatedByUserId = gm.Group.CreatedByUserId,
                    CreatedByUserName = gm.Group.CreatedByUser.Fullname ?? "",
                    MemberCount = gm.Group.GroupMembers.Count(m => m.Actived == true),
                    CreatedAt = gm.Group.CreatedAt
                })
                .OrderByDescending(g => g.CreatedAt)
                .ToListAsync();

            return groups;
        }

        public async Task<GroupDetailResponse?> GetGroupDetailAsync(int groupId)
        {
            var userId = _currentUser.UserId;

            // Kiểm tra user có phải thành viên không
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId && gm.Actived == true);

            if (!isMember)
            {
                return null;
            }

            var group = await _context.Groups
                .Where(g => g.GroupId == groupId && g.Actived == true)
                .Include(g => g.CreatedByUser)
                .Include(g => g.GroupMembers.Where(gm => gm.Actived == true))
                    .ThenInclude(gm => gm.User)
                .Include(g => g.Transactions.Where(t => t.Actived == true))
                .FirstOrDefaultAsync();

            if (group == null)
            {
                return null;
            }

            // Tính tổng số dư (thu - chi)
            var totalIncome = group.Transactions
                .Where(t => t.TransactionType == 1)
                .Sum(t => t.Amount ?? 0);

            var totalExpense = group.Transactions
                .Where(t => t.TransactionType == 2)
                .Sum(t => t.Amount ?? 0);

            var totalBalance = totalIncome - totalExpense;

            // Lấy role của user hiện tại
            var currentUserRole = group.GroupMembers
                .FirstOrDefault(gm => gm.UserId == userId)?.Role ?? "member";

            var response = new GroupDetailResponse
            {
                GroupId = group.GroupId,
                GroupName = group.GroupName,
                Description = group.Description,
                BudgetLimit = group.BudgetLimit ?? 0,
                CreatedByUserId = group.CreatedByUserId,
                CreatedByUserName = group.CreatedByUser.Fullname ?? "",
                TotalBalance = totalBalance,
                CurrentUserRole = currentUserRole,
                Members = group.GroupMembers.Select(gm => new GroupMemberResponse
                {
                    GroupMemberId = gm.GroupMemberId,
                    UserId = gm.UserId,
                    UserName = gm.User.Username ?? "",
                    FullName = gm.User.Fullname ?? "",
                    Role = gm.Role,
                    JoinedAt = gm.JoinedAt
                }).ToList()
            };

            return response;
        }
    }
}
