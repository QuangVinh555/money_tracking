using Application.Common.CurrentUser;
using Application.Features.Commands.Transactions;
using Application.Features.DTOs.PagedResult;
using Application.Features.DTOs.Transactions;
using Application.Features.Queries.Transaction;
using Application.Features.QueryRequestModels.Transactions;
using Core.Common;
using Infrastructure.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMediator _mediator;
        private readonly ITransactionQuery _transactionQuery;

        public TransactionsController(AppDbContext context, IMediator mediator, ITransactionQuery transactionQuery) {
            _context = context;      
            _mediator = mediator;
            _transactionQuery = transactionQuery;
        }

        /// <summary>
        /// Lấy ra tất cả các giao dịch trong tháng hiện tại
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        [HttpGet("get-all-transactions")]
        public async Task<IActionResult> GetAllTransactions(DateOnly? OptionDate, int PageNumber = 1, int PageSize = 10)
        {
            var data = await _transactionQuery.GetAllTransactions(OptionDate, PageNumber, PageSize);

            return Ok(new ApiResponse<PagedResult<TransactionsResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy ra tất cả các giao dịch thành công"
            });
        }

        /// <summary>
        /// Thêm mới giao dịch.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<IActionResult> CreateTransaction([FromBody] CreateTransactionsCommand request)
        {
            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response); // 200

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response); // 400

            return StatusCode(500, response); // fallback
        }

        /// <summary>
        /// Cập nhật giao dịch.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateTransaction(int id, [FromBody] UpdateTransactionsCommand request)
        {
            // đồng bộ id từ route vào request
            request.TransactionId = id;

            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response); // 200

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response); // 400

            return StatusCode(500, response); // fallback
        }

        /// <summary>
        /// Xóa giao dịch.
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            // đồng bộ id từ route vào request
            var request = new DeleteTransactionsCommand { TransactionId = id };

            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response); // 200

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response); // 400

            return StatusCode(500, response); // fallback
        }

        /// <summary>
        /// Tính tổng các card.
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        [HttpGet("total-card")]
        public async Task<IActionResult> TransactionsTotalCardByDate([FromQuery] DateOnly? OptionDate)
        {
            var data = await _transactionQuery.TransactionsTotalCardByDate(OptionDate);

            return Ok(new ApiResponse<TransactionsTotalCardResponse>
            {
                Success = true,
                Data = data,
                Message = "Tính tổng các card thành công."
            });
        }

        /// <summary>
        /// Lấy ra các giao dịch trong tháng nhóm lại theo từng ngày trong tháng
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        [HttpGet("get-by-group-date")]
        public async Task<IActionResult> GetTransactionsGroupByDate(DateOnly? OptionDate)
        {
            var data = await _transactionQuery.GetTransactionsGroupByDate(OptionDate);

            return Ok(new ApiResponse<List<TransactionsGroupByDateResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy ra các giao dịch thành công"
            });
        }

        /// <summary>
        /// Tính tổng các card theo từng ngày chọn.
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        [HttpGet("total-card-by-date")]
        public async Task<IActionResult> TransactionsTotalCardByOptionDate([FromQuery] DateOnly? OptionDate)
        {
            var data = await _transactionQuery.TransactionsTotalCardByOptionDate(OptionDate);

            return Ok(new ApiResponse<TransactionsTotalCardResponse>
            {
                Success = true,
                Data = data,
                Message = $"Tổng số card ngày {OptionDate?.ToString("yyyy-MM-dd") ?? "không xác định"} đã được tính thành công."

            });
        }

        /// <summary>
        /// Lấy ra các giao dịch có loại cố định
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        [HttpGet("get-transaction-fixed-cost")]
        public async Task<IActionResult> TransactionsFixedCost([FromQuery] DateOnly? OptionDate)
        {
            var data = await _transactionQuery.TransactionsFixedCost(OptionDate);

            return Ok(new ApiResponse<TransactionFixedCostResponse>
            {
                Success = true,
                Data = data,
                Message = "Lấy ra các giao dịch có loại cố định tính thành công."

            });
        }

        /// <summary>
        /// Tìm kiếm giao dịch
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpGet("search")]
        public async Task<IActionResult> TransactionSearchQuery([FromQuery] TransactionsSearchQuery request)
        {
            var data = await _transactionQuery.SearchTransactions(request);

            return Ok(new ApiResponse<PagedResult<TransactionsResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy ra các giao dịch thành công."

            });
        }
    }
}
