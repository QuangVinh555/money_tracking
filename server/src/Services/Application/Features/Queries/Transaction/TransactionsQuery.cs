using Application.Common.CurrentUser;
using Application.Features.DTOs.PagedResult;
using Application.Features.DTOs.Transactions;
using Application.Features.QueryRequestModels.Transactions;
using Core.Constanst;
using Core.Extensions;
using Infrastructure.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Features.Queries.Transaction
{
    public interface ITransactionQuery
    {
        /// <summary>
        /// Tính tông thu nhập, tổng chi tiêu, hạn mức, số dư theo tháng
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        public Task<TransactionsTotalCardResponse> TransactionsTotalCardByDate(DateOnly? OptionDate);

        /// <summary>
        /// Tính tông thu nhập, tổng chi tiêu, hạn mức, số dư theo từng ngày
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        public Task<TransactionsTotalCardResponse> TransactionsTotalCardByOptionDate(DateOnly? OptionDate);

        /// <summary>
        /// Lấy ra các giao dịch trong tháng nhóm lại theo từng ngày trong tháng
        /// </summary>
        /// <returns></returns>
        public Task<List<TransactionsGroupByDateResponse>> GetTransactionsGroupByDate(DateOnly? OptionDate);

        /// <summary>
        /// Lấy ra tất cả các giao dịch trong tháng hiện tại
        /// </summary>
        /// <returns></returns>
        public Task<PagedResult<TransactionsResponse>> GetAllTransactions(DateOnly? OptionDate, int PageNumber, int PageSize);

        /// <summary>
        /// Tìm kiếm giao dịch
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public Task<PagedResult<TransactionsResponse>> SearchTransactions(TransactionsSearchQuery request);
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

            // --- Chi tiêu trung bình / ngày (loại bỏ category = 6) ---
            var expenseWithoutRent = await _context.Transactions
                .Where(t => t.TransactionType == 2
                    && t.TransactionDate >= fromDate
                    && t.TransactionDate <= toDate
                    && t.UserId == userId
                    && t.CategoryId != 6 // loại bỏ tiền trọ
                )
                .SumAsync(t => t.Amount);

            // Xác định ngày cuối để tính trung bình
            DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);
            DateOnly toDateNow;

            if (OptionDate.Value.Year == today.Year && OptionDate.Value.Month == today.Month)
            {
                // Nếu là tháng hiện tại -> dùng hôm nay
                toDateNow = today;
            }
            else
            {
                // Nếu là tháng khác -> dùng ngày cuối tháng đó
                toDateNow = toDate;
            }

            var totalDays = (toDateNow.ToDateTime(TimeOnly.MinValue) - fromDate.ToDateTime(TimeOnly.MinValue)).Days + 1;
            var averageDailySpending = totalDays > 0 ? Math.Round((expenseWithoutRent ?? 0) / totalDays) : 0;

            return new TransactionsTotalCardResponse
            {
                Income = totalIncome,
                Expense = totalExpense,
                BudgetLimit = budgetLimit?.BudgetsLimitTotal ?? 0,
                AverageDailySpending = averageDailySpending
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
                    && t.TransactionDate <= firstDayOfNextMonth 
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
                        DateTime = g.Key, //  giờ hợp lệ vì xử lý trong bộ nhớ(không format trực tiếp khi viết linq trong sql)
                        Transactions = g.ToList()
                    })
                    .OrderByDescending(t => t.DateTime)
                    .ToList();


            return groupedTransactions;
        }

        public async Task<TransactionsTotalCardResponse> TransactionsTotalCardByOptionDate(DateOnly? OptionDate)
        {
            var userId = _currentUser.UserId;

            // Không có value thì lấy ngày tháng hiện tại
            if (!OptionDate.HasValue)
            {
                OptionDate = DateOnly.FromDateTime(DateTime.UtcNow);
            }

            // Tổng thu nhập
            var totalIncome = await _context.Transactions
                .Where(t => t.TransactionType == 1
                    && t.TransactionDate == OptionDate
                    && t.UserId == userId
                )
                .SumAsync(t => t.Amount);

            // Tổng chi tiêu
            var totalExpense = await _context.Transactions
                .Where(t => t.TransactionType == 2
                    && t.TransactionDate == OptionDate
                    && t.UserId == userId
                )
                .SumAsync(t => t.Amount);


            return new TransactionsTotalCardResponse
            {
                Income = totalIncome,
                Expense = totalExpense,
            };
        }

        public async Task<PagedResult<TransactionsResponse>> GetAllTransactions(DateOnly? OptionDate, int PageNumber, int PageSize)
        {
            var userId = _currentUser.UserId;

            // Lấy ngày hiện tại
            var now = DateOnly.FromDateTime(DateTime.UtcNow);
            var firstDayOfMonth = OptionDate.HasValue
                ? DateTimeExtensions.ToStartOfMonth(OptionDate.Value)
                : DateTimeExtensions.ToStartOfMonth(now);

            var firstDayOfNextMonth = OptionDate.HasValue
                ? DateTimeExtensions.ToEndOfMonth(OptionDate.Value)
                : DateTimeExtensions.ToEndOfMonth(now);

            var query = await _context.Transactions
               .Where(t => t.TransactionDate >= firstDayOfMonth
                   && t.TransactionDate <= firstDayOfNextMonth
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
               .OrderByDescending(t => t.TransactionDate)
               .ToListAsync();

            // Tổng số bản ghi
            var totalCount = query.Count();
            var transactions = query.Skip((PageNumber - 1) * PageSize).Take(PageSize).ToList();
            // Trả về kết quả phân trang
            return new PagedResult<TransactionsResponse>
            {
                Items = transactions,
                TotalCount = totalCount,
                PageNumber = PageNumber,
                PageSize = PageSize
            };
        }

        public async Task<PagedResult<TransactionsResponse>> SearchTransactions(TransactionsSearchQuery request)
        {
            var userId = _currentUser.UserId;
            // Lấy ngày hiện tại
            var now = DateOnly.FromDateTime(DateTime.UtcNow);

            // Tính ngày mặc định
            var fromDate = request.FromDate ?? DateTimeExtensions.ToStartOfMonth(now);
            var toDate = request.ToDate ?? DateTimeExtensions.ToEndOfMonth(now);

            var query =  _context.Transactions
                .Where(t => t.UserId == userId) // lọc theo user
                .Where(t => t.TransactionDate >= fromDate && t.TransactionDate <= toDate)
                .Where(t=> t.Actived == true)
                .AsQueryable();

            // Lọc theo CategoryId
            if (request.CategoryId.HasValue)
            {
                query = query.Where(t => t.CategoryId == request.CategoryId.Value);
            }

            // Lọc theo TransactionType (1 = income, 2 = expense)
            if (request.TransactionType.HasValue)
            {
                query = query.Where(t => t.TransactionType == request.TransactionType.Value);
            }

            // Lọc theo mô tả (chứa chuỗi)
            if (!string.IsNullOrWhiteSpace(request.Descriptions))
            {
                var keyword = request.Descriptions.Trim().ToLower();
                query = query.Where(t => t.Description != null && t.Description.ToLower().Contains(keyword));
            }
            // Filter xong, query vẫn là IQueryable
            var filteredQuery = query;

            // Tính tổng thu nhập
            var totalIncome = await filteredQuery
                .Where(t => t.TransactionType == 1)
                .SumAsync(t => t.Amount);

            // Tính tổng chi tiêu
            var totalExpense = await filteredQuery
                .Where(t => t.TransactionType == 2)
                .SumAsync(t => t.Amount);


            // Tổng số bản ghi trước khi phân trang
            var totalCount = await filteredQuery.CountAsync();

            // Lấy list transactions
            var transactions = await filteredQuery
                .OrderByDescending(t => t.TransactionDate)
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
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
                    Income = totalIncome,
                    Expense = totalExpense,
                })
                .ToListAsync();

            // Trả về DTO kèm tổng số, phân trang
            return new PagedResult<TransactionsResponse>
            {
                Items = transactions,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}
