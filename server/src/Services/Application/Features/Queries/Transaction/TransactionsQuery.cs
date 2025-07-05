using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Common.CurrentUser;
using Application.Features.DTOs.Transactions;
using Core.Constanst;
using Core.Extensions;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Features.Queries.Transaction
{
    public interface ITransactionQuery
    {
        /// <summary>
        /// Tính tông thu nhập, tổng chi tiêu, hạn mức, số dư
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        public Task<TransactionsTotalCardResponse> TransactionsTotalCardByDate(DateOnly? OptionDate);

        /// <summary>
        /// Lấy ra các giao dịch trong tháng nhóm lại theo từng ngày trong tháng
        /// </summary>
        /// <returns></returns>
        public Task<List<TransactionsGroupByDateResponse>> GetTransactionsGroupByDate(DateOnly? OptionDate);
    }
    public class TransactionsQuery : ITransactionQuery
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public TransactionsQuery(AppDbContext context, ICurrentUserService currentUser) {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<TransactionsTotalCardResponse> TransactionsTotalCardByDate(DateOnly? OptionDate)
        {
            var userId = _currentUser.UserId;

            // Không có value thì lấy ngày tháng hiện tại
            if (!OptionDate.HasValue)
            {
                OptionDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }

            // Chuyển về kiểu (UTC) và chọn tới cuối ngày
            var fromDate = DateTimeExtensions.ToStartOfMonth(OptionDate.Value);
            var toDate = DateTimeExtensions.ToEndOfMonth(OptionDate.Value);

            // Tổng thu nhập
            var totalIncome = await _context.Transactions
                .Where(t => t.TransactionType == 1 
                    && t.TransactionDate >= fromDate 
                    && t.TransactionDate <= toDate
                    && t.UserId == userId
                )
                .SumAsync(t => t.Amount);

            // Tổng chi tiêu
            var totalExpense = await _context.Transactions
                .Where(t => t.TransactionType == 2 
                    && t.TransactionDate >= fromDate 
                    && t.TransactionDate <= toDate 
                    && t.UserId == userId
                )
                .SumAsync(t => t.Amount);

            // Hạn mức (Lấy ngày đầu tiên của tháng để so sánh với cột ngày đầu tiên của hạn mức)
            var budgetLimit = await _context.BudgetsLimits
                .Where(b => b.BudgetsLimitStartDate != null && b.BudgetsLimitStartDate.Value == fromDate && b.UserId == userId)
                .FirstOrDefaultAsync();

            return new TransactionsTotalCardResponse
            {
                Income = totalIncome,
                Expense = totalExpense,
                BudgetLimit = budgetLimit?.BudgetsLimitTotal ?? 0,
            };
        }

        public async Task<List<TransactionsGroupByDateResponse>> GetTransactionsGroupByDate(DateOnly? OptionDate)
        {
            var userId = _currentUser.UserId;

            // Lấy ngày hiện tại
            var now = DateOnly.FromDateTime(DateTime.UtcNow);

            /*
                - Chuyển về ngày đầu tháng(UTC) và chọn tới cuối tháng(UTC)
                + True: Sẽ lấy theo ngày của FE truyền xuống và chuyển theo đầu tháng - cuối tháng
                + False: Sẽ lấy ngày hiện tại và chuyển theo đầu tháng - cuối tháng
            */
            var firstDayOfMonth = OptionDate.HasValue 
                ? DateTimeExtensions.ToStartOfMonth(OptionDate.Value) 
                : DateTimeExtensions.ToStartOfMonth(now);

            var firstDayOfNextMonth = OptionDate.HasValue 
                ? DateTimeExtensions.ToEndOfMonth(OptionDate.Value)
                : DateTimeExtensions.ToEndOfMonth(now);

            var transactions = await _context.Transactions
                .Where(t => t.TransactionDate >= firstDayOfMonth 
                    && t.TransactionDate < firstDayOfNextMonth 
                    && t.UserId == userId
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
                    TransactionTypeName = t.TransactionType == 1 ? ConstTransactionType.INCOME : ConstTransactionType.EXPENSE,
                    Actived = t.Actived,
                    CreatedAt = t.CreatedAt,
                    UpdateAt = t.UpdatedAt,
                })
                .ToListAsync();

                var groupedTransactions = transactions
                    .GroupBy(t => t.TransactionDate)
                    .Select(g => new TransactionsGroupByDateResponse
                    {
                        DateTime = g.Key.ToString("yyyy-MM-dd"), //  giờ hợp lệ vì xử lý trong bộ nhớ(không format trực tiếp khi viết linq trong sql)
                        Transactions = g.ToList()
                    })
                    .OrderByDescending(t => t.DateTime)
                    .ToList();


            return groupedTransactions;
        }
    }
}
