using Application.Common.CurrentUser;
using Core.Common;
using Infrastructure.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Features.Commands.Transactions
{
    public class DeleteTransactionsCommand : IRequest<ApiResponse<bool>>
    {
        public int TransactionId { get; set; }
    }
    public class DeleteTransactionsCommandHandler : IRequestHandler<DeleteTransactionsCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public DeleteTransactionsCommandHandler(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }
        public async Task<ApiResponse<bool>> Handle(DeleteTransactionsCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var rowsDeleted = await _context.Transactions
                    .Where(t => t.TransactionId == request.TransactionId
                             && t.UserId == _currentUserService.UserId
                             && t.Actived == true)
                    .ExecuteDeleteAsync(cancellationToken);

                if (rowsDeleted > 0)
                {
                    return ApiResponse<bool>.SuccessResponse(true, "Xóa giao dịch này thành công.");
                }

                return ApiResponse<bool>.FailResponse("Không tìm thấy giao dịch để xóa.");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailResponse("Xóa giao dịch thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
