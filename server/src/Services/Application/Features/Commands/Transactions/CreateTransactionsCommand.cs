using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Common;
using Infrastructure.Models;
using MediatR;

namespace Application.Features.Commands.Transactions
{
    public class CreateTransactionsCommand : IRequest<ApiResponse<bool>>
    {
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Transaction_Date { get; set; }

        // 1: income, 2: expense
        public int Transaction_Type { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class CreateTransactionsCommandHandler : IRequestHandler<CreateTransactionsCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;

        public CreateTransactionsCommandHandler(AppDbContext context ) 
        {
            _context = context;
        }
        public async Task<ApiResponse<bool>> Handle(CreateTransactionsCommand request, CancellationToken cancellationToken)
        {
            try
            {
                if(request.Transaction_Type != 1 && request.Transaction_Type != 2)
                {
                    return ApiResponse<bool>.FailResponse("Loại giao dịch không hợp lệ.", new List<string>
                    {
                        "Transaction_Type phải là 1 (income) hoặc 2 (expense)."
                    });
                }
                var transaction = new Transaction
                {
                    UserId = request.UserId,
                    CategoryId = request.CategoryId,
                    Description = request.Description,
                    Amount = request.Amount,
                    TransactionDate = request.Transaction_Date,
                    TransactionType = request.Transaction_Type,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    Actived = true,
                };

                _context.Transactions.Add(transaction);
                await _context.SaveChangesAsync(cancellationToken);

                return ApiResponse<bool>.SuccessResponse(true, "Thêm giao dịch thành công.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailResponse("Thêm giao dịch thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
