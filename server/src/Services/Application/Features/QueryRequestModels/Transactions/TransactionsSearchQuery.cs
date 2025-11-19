using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.QueryRequestModels.Transactions
{
    public class TransactionsSearchQuery
    {
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public int? CategoryId { get; set; }
        public int? TransactionType { get; set; }
        public string Descriptions { get; set; } = string.Empty;


        // Phân trang
        public int PageNumber { get; set; } = 1;   // mặc định trang 1
        public int PageSize { get; set; } = 10;    // mặc định 10 bản ghi
    }
}
