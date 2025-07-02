using Application.Common.CurrentUser;
using Application.Features.Commands.Transactions;
using Application.Features.DTOs.Transactions;
using Application.Features.Queries.Transaction;
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
        [HttpPut("update")]
        public async Task<IActionResult> UpdateTransaction([FromBody] UpdateTransactionsCommand request)
        {
            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response); // 200

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response); // 400

            return StatusCode(500, response); // fallback
        }

        /// <summary>
        /// Lấy danh sách giao dịch tháng hiện tại.
        /// </summary>
        /// <returns></returns>
        [HttpGet("current-month")]
        public async Task<IActionResult> GetAllTransactionsByCurrentMonth()
        {
            var data = await _transactionQuery.GetAllTransactionsByCurrentMonth();

            return Ok(new ApiResponse<List<TransactionsResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy danh sách giao dịch tháng hiện tại thành công."
            });
        }

        /// <summary>
        /// Lấy danh sách giao dịch ngày(tùy chọn).
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        [HttpGet("by-date")]
        public async Task<IActionResult> GetAllTransactionsByDate([FromQuery] DateTime OptionDate)
        {
            var data = await _transactionQuery.GetAllTransactionsByDate(OptionDate);

            return Ok(new ApiResponse<List<TransactionsResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy danh sách giao dịch ngày này thành công."
            });
        }

        /// <summary>
        /// Tính tổng các card.
        /// </summary>
        /// <param name="OptionDate"></param>
        /// <returns></returns>
        [HttpGet("total-card")]
        public async Task<IActionResult> TransactionsTotalCardByDate([FromQuery] DateTime? OptionDate)
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
        public async Task<IActionResult> GetTransactionsGroupByDate(DateTime? OptionDate)
        {
            var data = await _transactionQuery.GetTransactionsGroupByDate(OptionDate);

            return Ok(new ApiResponse<List<TransactionsGroupByDateResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy ra các giao dịch thành công"
            });
        }
    }
}
