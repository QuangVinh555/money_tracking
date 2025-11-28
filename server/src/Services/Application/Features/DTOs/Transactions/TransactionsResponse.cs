using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.DTOs.Transactions
{
    public class TransactionsResponse : TransactionsTotalCardResponse
    {
        public int TransactionId { get; set; }
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal? Amount { get; set; }
        public DateOnly TransactionDate { get; set; }
        public int? TransactionType { get; set; }
        public string TransactionTypeName { get; set; } = string.Empty;
        public bool? Actived { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdateAt { get; set; }
    }
}
