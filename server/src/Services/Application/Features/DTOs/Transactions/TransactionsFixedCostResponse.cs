using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.DTOs.Transactions
{
    public class FixedCostItem
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public decimal Total { get; set; }
    }

    public class TransactionFixedCostResponse
    {
        public List<FixedCostItem> FixedCostItems { get; set; } = new();
        public decimal TotalAll { get; set; }
    }
}
