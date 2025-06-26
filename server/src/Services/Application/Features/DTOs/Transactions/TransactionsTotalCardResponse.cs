using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.DTOs.Transactions
{
    public class TransactionsTotalCardResponse
    {
        public decimal Income { get; set; }
        public decimal Expense { get; set; }    
        public decimal? BudgetLimit { get; set; }
        public decimal Balance => (BudgetLimit ?? 0) - Expense;
    }
}
