using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Common;
using Core.Extensions;
using Infrastructure.Models;
using MediatR;

namespace Application.Features.Commands.BudgetsLimit
{
    public class CreateBudgetsLimitCommand : IRequest<ApiResponse<bool>>
    {
        public int UserId { get; set; }
        public DateTime? Budgets_StartDate { get; set; }
        public DateTime? Budgets_EndDate { get; set; }
        public decimal Budgets_Limit_Total { get; set; }
    }

    public class CreateBudgetsLimitCommandHanler : IRequestHandler<CreateBudgetsLimitCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;

        public CreateBudgetsLimitCommandHanler(AppDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<bool>> Handle(CreateBudgetsLimitCommand request, CancellationToken cancellationToken)
        {
            try
            {
                /*
                    - Chuyển về ngày đầu tháng(UTC) và chọn tới cuối tháng(UTC)
                    + True: Có giá trị thì dùng hàm EnsureUtc kiểm tra kind = UTC hay không để ép kiểu về UTC
                    + False: Sẽ lấy ngày hiện tại và chuyển theo đầu tháng - cuối tháng
                */
                request.Budgets_StartDate = request.Budgets_StartDate.HasValue
                    ? DateTimeExtensions.EnsureUtc(request.Budgets_StartDate.Value) 
                    : DateTimeExtensions.ToUtcStartOfMonth(DateTime.UtcNow);

                request.Budgets_EndDate = request.Budgets_EndDate.HasValue
                    ? DateTimeExtensions.EnsureUtc(request.Budgets_EndDate.Value)
                    : DateTimeExtensions.ToUtcEndOfMonth(DateTime.UtcNow);


                var budgetsLimit = new Infrastructure.Models.BudgetsLimit
                {
                    UserId = request.UserId,
                    BudgetsLimitStartDate = request.Budgets_StartDate,
                    BudgetsLimitEndDate = request.Budgets_EndDate,
                    BudgetsLimitTotal = request.Budgets_Limit_Total,
                    Actived = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                _context.BudgetsLimits.Add(budgetsLimit);
                await _context.SaveChangesAsync(cancellationToken);

                return ApiResponse<bool>.SuccessResponse(true, "Thêm hạn mức thành công.");
            }
            catch (Exception ex) {
                return ApiResponse<bool>.FailResponse("Thêm hạn mức thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
