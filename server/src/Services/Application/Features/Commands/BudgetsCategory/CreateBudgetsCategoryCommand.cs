//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using Core.Common;
//using Core.Extensions;
//using Infrastructure.Models;
//using MediatR;
//using Microsoft.EntityFrameworkCore;

//namespace Application.Features.Commands.BudgetsCategory
//{
//    public class CreateBudgetsCategoryCommand : IRequest<ApiResponse<bool>>
//    {
//        public int UserId { get; set; }
//        public int CategoryId { get; set; }
//        public decimal Amount { get; set; }
//        public DateTime StartDate { get; set; }
//        public DateTime EndDate { get; set; }
//    }

//    public class CreateBudgetsCategoryCommandHandler : IRequestHandler<CreateBudgetsCategoryCommand, ApiResponse<bool>>
//    {
//        private readonly AppDbContext _context;

//        public CreateBudgetsCategoryCommandHandler(AppDbContext context)
//        {
//            _context = context;
//        }
//        public async Task<ApiResponse<bool>> Handle(CreateBudgetsCategoryCommand request, CancellationToken cancellationToken)
//        {
//            /*
//             - Khi đặt ngân sách cho từng danh mục thì tháng đó bắt buộc phải có đăng ký hạn mức
//             - Kiểm tra UserId và StartDate để coi thử tháng đó người dùng đó đã có thêm hạn mức chưa
//             - Nếu có rồi thì hãy thêm BudgetsLimitId vào bảng Budgets luôn.
//             - Nếu chưa thì thông báo "Vui lòng thêm hạn mức của tháng này."
//             */

//            // Chuyển ngày bắt đầu và ngày kết thúc = ngày đầu tháng và ngày cuối tháng
//            request.StartDate = DateTimeExtensions.ToUtcStartOfMonth(request.StartDate);
//            request.EndDate = DateTimeExtensions.ToUtcEndOfMonth(request.EndDate);

//            // Kiểm tra hạn mức tháng này có chưa
//            var exitedBudgetsLimit = await _context.BudgetsLimits
//                .FirstOrDefaultAsync(b => 
//                    b.UserId == request.UserId 
//                    && b.BudgetsLimitStartDate != null
//                    && b.BudgetsLimitStartDate.Value.Date == request.StartDate.Date
//                );

//            if( exitedBudgetsLimit == null ) return ApiResponse<bool>.FailResponse("Vui lòng thêm hạn mức của tháng này.");

//            // Kiểm tra danh mục để trả ra response CategoryName
//            var exitedCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == request.CategoryId);
//            if( exitedCategory == null ) return ApiResponse<bool>.FailResponse("Danh mục này không tồn tại");

//            // Kiểm tra danh mục này của người dùng này trong tháng này đã tạo chưa
//            var exitedBudgetCategory = await _context.Budgets
//                .FirstOrDefaultAsync(b =>
//                    b.CategoryId == request.CategoryId
//                    && b.UserId == request.UserId
//                    && b.StartDate.Date == request.StartDate.Date
//                    && b.Actived == true
//                );

//            if ( exitedBudgetCategory != null ) return ApiResponse<bool>.FailResponse("Ngân sách cho danh mục này đã được tạo.");

//            // Tính tổng ngân sách của từng danh mục trong tháng này có vượt qua tổng hạn mức không
//            var totalBudgetedThisMonth = await _context.Budgets
//                .Where(b =>
//                    b.UserId == request.UserId
//                    && b.BudgetsLimitId == exitedBudgetsLimit.BudgetsLimitId
//                )
//                .SumAsync(b => (decimal?)b.Amount ?? 0);

//            // Tính tổng sau khi cộng thêm request.Amount
//            var newTotal = totalBudgetedThisMonth + request.Amount;

//            // So sánh với hạn mức
//            if (newTotal > exitedBudgetsLimit.BudgetsLimitTotal)
//            {
//                var remain = exitedBudgetsLimit.BudgetsLimitTotal - totalBudgetedThisMonth;
//                return ApiResponse<bool>.FailResponse($"Không thể tạo ngân sách. Số tiền còn lại của hạn mức là {remain:N0}.");
//            }

//            var newBudget = new Infrastructure.Models.Budget
//            {
//                UserId = request.UserId,
//                CategoryId = request.CategoryId,
//                BudgetsLimitId = exitedBudgetsLimit.BudgetsLimitId,
//                Amount = request.Amount,
//                StartDate = request.StartDate,
//                EndDate = request.EndDate,
//                Actived = true,
//                CreatedAt = DateTime.UtcNow,
//                UpdatedAt = DateTime.UtcNow,
//            };

//            _context.Budgets.Add(newBudget);
//            await _context.SaveChangesAsync(cancellationToken);

//            return ApiResponse<bool>.SuccessResponse(true, $"Tạo ngân sách cho danh mục {exitedCategory.CategoryName} thành công. ");
//        }
//    }
//}
