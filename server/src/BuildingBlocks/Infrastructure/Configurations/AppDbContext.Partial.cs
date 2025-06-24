using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Models
{
    public partial class AppDbContext
    {
        partial void OnModelCreatingPartial(ModelBuilder modelBuilder)
        {
            // Khai báo enum PostgreSQL
            modelBuilder.HasPostgresEnum<TransactionType>("public", "transaction_type");
            // Sử dụng converter của PostgreSQL để ánh xạ enum C# <-> PostgreSQL enum
            modelBuilder.Entity<Transaction>()
                .Property(t => t.TransactionType)
                .HasColumnName("transaction_type")
                .HasColumnType("transaction_type"); // Rõ ràng chỉ định kiểu cột;
        }
    }
}
