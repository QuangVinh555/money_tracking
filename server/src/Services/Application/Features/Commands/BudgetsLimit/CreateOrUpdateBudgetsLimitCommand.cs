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

namespace Application.Features.Commands.BudgetsLimit
{
    public class CreateOrUpdateBudgetsLimitCommand : IRequest<ApiResponse<bool>>
    {
        public int UserId { get; set; }
        public DateTime? Budgets_StartDate { get; set; }
        public DateTime? Budgets_EndDate { get; set; }
        public decimal Budgets_Limit_Total { get; set; }
    }

    public class CreateOrUpdateBudgetsLimitCommandHanler : IRequestHandler<CreateOrUpdateBudgetsLimitCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;

        public CreateOrUpdateBudgetsLimitCommandHanler(AppDbContext context)
        {
            _context = context;
        }
        public async Task<ApiResponse<bool>> Handle(CreateOrUpdateBudgetsLimitCommand request, CancellationToken cancellationToken)
        {
            try
            {
                /*
                    - Chuyển về ngày đầu tháng(UTC) và chọn tới cuối tháng(UTC)
                    + True: Sẽ lấy theo ngày của FE truyền xuống và chuyển theo đầu tháng - cuối tháng
                    + False: Sẽ lấy ngày hiện tại và chuyển theo đầu tháng - cuối tháng
                */
                request.Budgets_StartDate = request.Budgets_StartDate.HasValue
                    ? DateTimeExtensions.ToUtcStartOfMonth(request.Budgets_StartDate.Value) 
                    : DateTimeExtensions.ToUtcStartOfMonth(DateTime.UtcNow);

                request.Budgets_EndDate = request.Budgets_EndDate.HasValue
                    ? DateTimeExtensions.ToUtcEndOfMonth(request.Budgets_EndDate.Value)
                    : DateTimeExtensions.ToUtcEndOfMonth(DateTime.UtcNow);

                // Kiểm tra userId này vào tháng này đã có thêm hạn mức hay chưa
                var exitedBudgetsLimit = await _context.BudgetsLimits
                    .FirstOrDefaultAsync(b => 
                        b.UserId == request.UserId 
                        && b.BudgetsLimitStartDate != null
                        && b.BudgetsLimitStartDate.Value.Date == request.Budgets_StartDate.Value.Date
                        && b.Actived == true
                    );

                if (exitedBudgetsLimit != null)
                {
                    exitedBudgetsLimit.BudgetsLimitTotal = request.Budgets_Limit_Total;
                    exitedBudgetsLimit.UpdatedAt = DateTime.UtcNow;

                    // Đánh dấu sự thay đổi dữ liệu của 2 cột này
                    //_context.Entry(exitedBudgetsLimit).Property(b => b.BudgetsLimitTotal).IsModified = true;
                    //_context.Entry(exitedBudgetsLimit).Property(b => b.UpdatedAt).IsModified = true;

                    await _context.SaveChangesAsync(cancellationToken);

                    return ApiResponse<bool>.SuccessResponse(true, "Cập nhật hạn mức thành công.");
                }
                else
                {
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

            }
            catch (Exception ex) {
                return ApiResponse<bool>.FailResponse("Thêm hạn mức thất bại.", new List<string> { ex.Message });
            }
        }
    }
}
