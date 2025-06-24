using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Enums;

namespace Infrastructure.Models
{
	public partial class Transaction
	{
		public TransactionType TransactionType { get; set; }
	}
}
