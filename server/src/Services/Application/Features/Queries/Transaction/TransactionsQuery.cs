using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Features.DTOs.Transactions;
using Core.Constanst;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Features.Queries.Transaction
{
    public interface ITransactionQuery
    {
        /// <summary>
        /// Lấy ra danh sách giao dịch theo tháng hiện tại
        /// </summary>
        /// <returns></returns>
        public Task<List<TransactionsResponse>> GetAllTransactionsByCurrentMonth();

        /// <summary>
        /// Lấy ra danh sách giao dịch theo ngày tự chọn
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        public Task<List<TransactionsResponse>> GetAllTransactionsByDate(DateTime OptionDate);

        /// <summary>
        /// Tính tông thu nhập, tổng chi tiêu, hạn mức, số dư
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        public Task<TransactionsTotalCardResponse> TransactionsTotalCardByDate(DateTime? OptionDate);
    }
    public class TransactionsQuery : ITransactionQuery
    {
        private readonly AppDbContext _context;

        public TransactionsQuery(AppDbContext context) {
            _context = context;
        }
        public async Task<List<TransactionsResponse>> GetAllTransactionsByCurrentMonth()
        {
            // Lấy ngày hiện tại
            var now = DateTime.UtcNow;

            // Chuyển về ngày đầu tháng(UTC) và chọn tới cuối tháng
            var firstDayOfMonth = DateTime.SpecifyKind(new DateTime(now.Year, now.Month, 1), DateTimeKind.Utc);
            var firstDayOfNextMonth = firstDayOfMonth.AddMonths(1);

            var transactions = await _context.Transactions
                .Where(t => t.TransactionDate >= firstDayOfMonth && t.TransactionDate < firstDayOfNextMonth && t.Actived == true)
                .Include(t => t.User)
                .Include(t => t.Category)
                .Select(t => new TransactionsResponse
                {
                    TransactionId = t.TransactionId,
                    UserId = t.UserId,
                    FullName = t.User.Fullname,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.CategoryName,
                    Description = t.Description ?? "",
                    Amount = t.Amount,
                    TransactionDate = t.TransactionDate,
                    TransactionType = t.TransactionType,
                    TransactionTypeName = t.TransactionType == 1 ? ConstTransactionType.INCOME : ConstTransactionType.EXPENSE,
                    Actived = t.Actived,
                    CreatedAt = t.CreatedAt,
                    UpdateAt = t.UpdatedAt,
                })
                .OrderByDescending(t => t.TransactionDate)
                .ToListAsync();

            return transactions;
        }

        public async Task<List<TransactionsResponse>> GetAllTransactionsByDate(DateTime OptionDate)
        {
            // Chuyển về kiểu (UTC) và chọn tới cuối ngày
            var fromDate = new DateTime(OptionDate.Year, OptionDate.Month, OptionDate.Day, 0, 0, 0, DateTimeKind.Utc);
            var toDate = fromDate.AddDays(1);

            var transactions = await _context.Transactions
                .Where(t =>  t.TransactionDate >= fromDate && t.TransactionDate < toDate && t.Actived == true)
                .Select(t => new TransactionsResponse
                {
                    TransactionId = t.TransactionId,
                    UserId = t.UserId,
                    CategoryId = t.CategoryId,
                    CategoryName = t.Category.CategoryName,
                    Description = t.Description ?? "",
                    Amount = t.Amount,
                    TransactionDate = t.TransactionDate,
                    TransactionType = t.TransactionType,
                    TransactionTypeName = t.TransactionType == 1 ? ConstTransactionType.INCOME : ConstTransactionType.EXPENSE,
                    Actived = t.Actived,
                    CreatedAt = t.CreatedAt,
                    UpdateAt = t.UpdatedAt,
                })
                .OrderByDescending (t => t.TransactionDate)
                .ToListAsync();

            return transactions;

        }

        public async Task<TransactionsTotalCardResponse> TransactionsTotalCardByDate(DateTime? OptionDate)
        {
            // Không có value thì lấy ngày tháng hiện tại
            if (!OptionDate.HasValue)
            {
                OptionDate = DateTime.UtcNow;
            }

            // Chuyển về kiểu (UTC) và chọn tới cuối ngày
            var fromDate = new DateTime(OptionDate.Value.Year, OptionDate.Value.Month, OptionDate.Value.Day, 0, 0, 0, DateTimeKind.Utc);
            var toDate = fromDate.AddMonths(1);

            // Tổng thu nhập
            var totalIncome = await _context.Transactions
                .Where(t => t.TransactionType == 1 && t.TransactionDate >= fromDate && t.TransactionDate < toDate)
                .SumAsync(t => t.Amount);

            // Tổng chi tiêu
            var totalExpense = await _context.Transactions
                .Where(t => t.TransactionType == 2 && t.TransactionDate >= fromDate && t.TransactionDate < toDate)
                .SumAsync(t => t.Amount);

            return new TransactionsTotalCardResponse
            {
                Income = totalIncome,
                Expense = totalExpense,
            };
        }
    }
}
