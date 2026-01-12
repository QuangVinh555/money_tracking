using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.CurrentUser;
using Application.Features.DTOs.PagedResult;
using Application.Features.DTOs.Transactions;
using Core.Constanst;
using Core.Extensions;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Groups.Queries
{
    public interface IGroupTransactionQuery
    {
        /// <summary>
        /// Lấy dashboard của nhóm (tổng thu, tổng chi, số dư)
        /// </summary>
        Task<TransactionsTotalCardResponse?> GetGroupDashboardAsync(int groupId, DateOnly? optionDate);

        /// <summary>
        /// Lấy danh sách giao dịch của nhóm
        /// </summary>
        Task<PagedResult<TransactionsResponse>?> GetGroupTransactionsAsync(int groupId, DateOnly? optionDate, int pageNumber, int pageSize);

        /// <summary>
        /// Lấy giao dịch nhóm theo ngày
        /// </summary>
        Task<List<TransactionsGroupByDateResponse>?> GetGroupTransactionsGroupByDateAsync(int groupId, DateOnly? optionDate);
    }

    public class GroupTransactionQuery : IGroupTransactionQuery
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public GroupTransactionQuery(AppDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<TransactionsTotalCardResponse?> GetGroupDashboardAsync(int groupId, DateOnly? optionDate)
        {
            var userId = _currentUser.UserId;

            // Kiểm tra user có phải thành viên không
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId && gm.Actived == true);

            if (!isMember)
            {
                return null;
            }

            // Không có value thì lấy ngày tháng hiện tại
            if (!optionDate.HasValue)
            {
                optionDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }

            // Chuyển về kiểu (UTC) và chọn tới cuối ngày
            var fromDate = DateTimeExtensions.ToStartOfMonth(optionDate.Value);
            var toDate = DateTimeExtensions.ToEndOfMonth(optionDate.Value);

            // Tổng thu nhập
            var totalIncome = await _context.Transactions
                .Where(t => t.GroupId == groupId
                    && t.TransactionType == ConstTransactionType.INCOME_NUMBER
                    && t.TransactionDate >= fromDate
                    && t.TransactionDate <= toDate
                    && t.Actived == true
                )
                .SumAsync(t => t.Amount);

            // Tổng chi tiêu
            var totalExpense = await _context.Transactions
                .Where(t => t.GroupId == groupId
                    && t.TransactionType == ConstTransactionType.EXPENSE_NUMBER
                    && t.TransactionDate >= fromDate
                    && t.TransactionDate <= toDate
                    && t.Actived == true
                )
                .SumAsync(t => t.Amount);

            return new TransactionsTotalCardResponse
            {
                Income = totalIncome,
                Expense = totalExpense,
                ExtraPlanned = totalExpense // Cho nhóm, không phân biệt fixed cost
            };
        }

        public async Task<PagedResult<TransactionsResponse>?> GetGroupTransactionsAsync(int groupId, DateOnly? optionDate, int pageNumber, int pageSize)
        {
            var userId = _currentUser.UserId;

            // Kiểm tra user có phải thành viên không
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId && gm.Actived == true);

            if (!isMember)
            {
                return null;
            }

            // Lấy ngày hiện tại
            var now = DateOnly.FromDateTime(DateTime.UtcNow);
            var firstDayOfMonth = optionDate.HasValue
                ? DateTimeExtensions.ToStartOfMonth(optionDate.Value)
                : DateTimeExtensions.ToStartOfMonth(now);

            var firstDayOfNextMonth = optionDate.HasValue
                ? DateTimeExtensions.ToEndOfMonth(optionDate.Value)
                : DateTimeExtensions.ToEndOfMonth(now);

            var query = await _context.Transactions
               .Where(t => t.GroupId == groupId
                   && t.TransactionDate >= firstDayOfMonth
                   && t.TransactionDate <= firstDayOfNextMonth
                   && t.Actived == true
               )
               .Include(t => t.User)
               .Include(t => t.Category)
               .Select(t => new TransactionsResponse
               {
                   TransactionId = t.TransactionId,
                   UserId = t.UserId,
                   FullName = t.User.Fullname ?? "",
                   CategoryId = t.CategoryId,
                   CategoryName = t.Category.CategoryName ?? "",
                   Description = t.Description ?? "",
                   Amount = t.Amount,
                   TransactionDate = t.TransactionDate,
                   TransactionType = t.TransactionType,
                   TransactionTypeName = t.TransactionType == ConstTransactionType.INCOME_NUMBER ? ConstTransactionType.INCOME : ConstTransactionType.EXPENSE,
                   Actived = t.Actived,
                   CreatedAt = t.CreatedAt,
                   UpdateAt = t.UpdatedAt,
                   GroupId = t.Group.GroupId
               })
               .OrderByDescending(t => t.TransactionDate)
               .ToListAsync();

            // Tổng số bản ghi
            var totalCount = query.Count();
            var transactions = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();

            // Trả về kết quả phân trang
            return new PagedResult<TransactionsResponse>
            {
                Items = transactions,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<List<TransactionsGroupByDateResponse>?> GetGroupTransactionsGroupByDateAsync(int groupId, DateOnly? optionDate)
        {
            var userId = _currentUser.UserId;

            // Kiểm tra user có phải thành viên không
            var isMember = await _context.GroupMembers
                .AnyAsync(gm => gm.GroupId == groupId && gm.UserId == userId && gm.Actived == true);

            if (!isMember)
            {
                return null;
            }

            // Lấy ngày hiện tại
            var now = DateOnly.FromDateTime(DateTime.UtcNow);

            var firstDayOfMonth = optionDate.HasValue
                ? DateTimeExtensions.ToStartOfMonth(optionDate.Value)
                : DateTimeExtensions.ToStartOfMonth(now);

            var firstDayOfNextMonth = optionDate.HasValue
                ? DateTimeExtensions.ToEndOfMonth(optionDate.Value)
                : DateTimeExtensions.ToEndOfMonth(now);

            var transactions = await _context.Transactions
                .Where(t => t.GroupId == groupId
                    && t.TransactionDate >= firstDayOfMonth
                    && t.TransactionDate <= firstDayOfNextMonth
                    && t.Actived == true
                )
                .Include(t => t.User)
                .Include(t => t.Category)
                .Select(t => new TransactionsResponse
                {
                    TransactionId = t.TransactionId,
                    UserId = t.UserId,
                    FullName = t.User.Fullname ?? "",
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.CategoryName ?? "",
                    Description = t.Description ?? "",
                    Amount = t.Amount,
                    TransactionDate = t.TransactionDate,
                    TransactionType = t.TransactionType,
                    TransactionTypeName = t.TransactionType == ConstTransactionType.INCOME_NUMBER ? ConstTransactionType.INCOME : ConstTransactionType.EXPENSE,
                    Actived = t.Actived,
                    CreatedAt = t.CreatedAt,
                    UpdateAt = t.UpdatedAt,
                    GroupId = t.Group.GroupId
                })
                .ToListAsync();

            var groupedTransactions = transactions
                .GroupBy(t => t.TransactionDate)
                .Select(g => new TransactionsGroupByDateResponse
                {
                    DateTime = g.Key,
                    Transactions = g.ToList()
                })
                .OrderByDescending(t => t.DateTime)
                .ToList();

            return groupedTransactions;
        }
    }
}
