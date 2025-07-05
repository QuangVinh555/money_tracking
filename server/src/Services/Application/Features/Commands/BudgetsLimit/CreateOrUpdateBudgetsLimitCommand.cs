using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Common.CurrentUser;
using Core.Common;
using Core.Extensions;
using Infrastructure.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Commands.BudgetsLimit
{
    public class CreateOrUpdateBudgetsLimitCommand : IRequest<ApiResponse<bool>>
    {
        public DateOnly? Budgets_StartDate { get; set; }
        public DateOnly? Budgets_EndDate { get; set; }
        public decimal Budgets_Limit_Total { get; set; }
    }

    public class CreateOrUpdateBudgetsLimitCommandHanler : IRequestHandler<CreateOrUpdateBudgetsLimitCommand, ApiResponse<bool>>
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public CreateOrUpdateBudgetsLimitCommandHanler(AppDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }
        public async Task<ApiResponse<bool>> Handle(CreateOrUpdateBudgetsLimitCommand request, CancellationToken cancellationToken)
        {
            try
            {
                var userId = _currentUserService.UserId;
                /*
                    - Chuyển về ngày đầu tháng(UTC) và chọn tới cuối tháng(UTC)
                    + True: Sẽ lấy theo ngày của FE truyền xuống và chuyển theo đầu tháng - cuối tháng
                    + False: Sẽ lấy ngày hiện tại và chuyển theo đầu tháng - cuối tháng
                */
                request.Budgets_StartDate = request.Budgets_StartDate.HasValue
                    ? DateTimeExtensions.ToStartOfMonth(request.Budgets_StartDate.Value) 
                    : DateTimeExtensions.ToStartOfMonth(DateOnly.FromDateTime(DateTime.UtcNow));

                request.Budgets_EndDate = request.Budgets_EndDate.HasValue
                    ? DateTimeExtensions.ToEndOfMonth(request.Budgets_EndDate.Value)
                    : DateTimeExtensions.ToEndOfMonth(DateOnly.FromDateTime(DateTime.UtcNow));

                // Kiểm tra userId này vào tháng này đã có thêm hạn mức hay chưa
                var exitedBudgetsLimit = await _context.BudgetsLimits
                    .FirstOrDefaultAsync(b => 
                        b.UserId == userId
                        && b.BudgetsLimitStartDate != null
                        && b.BudgetsLimitStartDate.Value == request.Budgets_StartDate.Value
                        && b.Actived == true
                    );

                // Cập nhật hạn mức
                if (exitedBudgetsLimit != null)
                {
                    exitedBudgetsLimit.BudgetsLimitTotal = request.Budgets_Limit_Total;
                    exitedBudgetsLimit.UpdatedAt = DateTime.UtcNow;

                    // Đánh dấu sự thay đổi dữ liệu của 2 cột này
                    //_context.Entry(exitedBudgetsLimit).Property(b => b.BudgetsLimitTotal).IsModified = true;
                    //_context.Entry(exitedBudgetsLimit).Property(b => b.UpdatedAt).IsModified = true;

                    // Kiểm tra xem các ngân sách danh mục con có đang sử dụng hạn mức này không
                    // Nếu có thì xóa đi, để user tự tạo lại danh mục con cho hạn mức mới
                    var exitedBudgetsCategories = await _context.Budgets
                        .Where(b => b.BudgetsLimitId == exitedBudgetsLimit.BudgetsLimitId && b.Actived == true)
                        .ToListAsync();

                    if(exitedBudgetsCategories.Any())
                    {
                        foreach (var budget in exitedBudgetsCategories)
                        {
                            budget.Actived = false;
                            budget.DeletedAt = DateTime.UtcNow;
                        }
                    }

                    await _context.SaveChangesAsync(cancellationToken);

                    return ApiResponse<bool>.SuccessResponse(true, "Cập nhật hạn mức thành công.");
                }
                // Thêm mới hạn mức
                else
                {
                    var budgetsLimit = new Infrastructure.Models.BudgetsLimit
                    {
                        UserId = userId,
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
