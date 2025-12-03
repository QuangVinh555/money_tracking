using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.DTOs.Transactions
{
    public class TransactionsTotalCardResponse
    {
        // Tổng thu nhập
        public decimal? Income { get; set; }
        // Tổng chi tiêu (kể cả giao dịch phát sinh có dự định)
        public decimal? Expense { get; set; }
        // Tổng chi tiêu (không tính giao dịch có phát sinh dự định)
        public decimal? ExtraPlanned { get; set; }
        // Tổng hạn mức tháng này
        public decimal? BudgetLimit { get; set; }
        // Số dư còn lại = tổng thu nhập - tổng chi tiêu (kể cả giao dịch phát sinh có dự định)
        public decimal? Balance => (Income ?? 0) - Expense;
        // Hạn mức còn lại = tổng hạn mức - tổng chi tiêu (không tính giao dịch có phát sinh dự định)
        public decimal? RemainingLimit => (BudgetLimit ?? 0) - ExtraPlanned;
        // Chi tiêu TB/ngày (không tính giao dịch có phát sinh dự định)
        public decimal? AverageDailySpending { get; set;}
    }
}
