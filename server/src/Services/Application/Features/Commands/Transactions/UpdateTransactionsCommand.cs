using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Common;
using Core.Extensions;
using Infrastructure.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Commands.Transactions
{
    public class UpdateTransactionsCommand : IRequest<ApiResponse<bool>>
    {
        public int TransactionId { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public decimal Amount { get; set; }
        public DateOnly Transaction_Date { get; set; }

        // 1: income, 2: expense
        public int Transaction_Type { get; set; }
        public string Description { get; set; } = string.Empty;
    }

    public class UpdateTransactionsCommandHandler : IRequestHandler<UpdateTransactionsCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;

        public UpdateTransactionsCommandHandler(AppDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<bool>> Handle(UpdateTransactionsCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var exitedTransaction = await _context.Transactions
                    .FirstOrDefaultAsync(t =>
                        t.TransactionId == request.TransactionId
                        && t.UserId == request.UserId
                        && t.Actived == true
                    );

                if (exitedTransaction == null) return ApiResponse<bool>.FailResponse("Không tìm thấy giao dịch này.");

                // Gía trị Transaction_Type phải là 1 hoặc 2
                if (request.Transaction_Type != 1 && request.Transaction_Type != 2)
                {
                    return ApiResponse<bool>.FailResponse("Loại giao dịch không hợp lệ.", new List<string>
                        {
                            "Transaction_Type phải là 1 (income) hoặc 2 (expense)."
                        });
                }

                // Ép kiểu về UTC(Sủa lại đoạn này không cần convert về UTC nữa vì Db chủ lưu "YYYY-MM-DD") thôi
                //var transactionDate = DateTimeExtensions.EnsureUtc(request.Transaction_Date);

                exitedTransaction.CategoryId = request.CategoryId;
                exitedTransaction.Amount = request.Amount;
                exitedTransaction.TransactionDate = request.Transaction_Date;
                exitedTransaction.TransactionType = request.Transaction_Type;
                exitedTransaction.Description = request.Description;
                exitedTransaction.UpdatedAt = DateTime.UtcNow;


                await _context.SaveChangesAsync(cancellationToken);

                return ApiResponse<bool>.SuccessResponse(true, "Cập nhật giao dịch này thành công.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailResponse("Cập nhật giao dịch thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
