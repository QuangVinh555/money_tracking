using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.DTOs.Transactions
{
    public class TransactionsGroupByDateResponse
    {
        public DateTime DateTime { get; set; }
        public List<TransactionsResponse> Transactions { get; set; } = new();
    }
}
