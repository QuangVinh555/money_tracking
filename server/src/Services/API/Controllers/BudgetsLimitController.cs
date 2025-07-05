using Application.Features.Commands.BudgetsLimit;
using Application.Features.Commands.Transactions;
using Application.Features.Queries.Transaction;
using Infrastructure.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BudgetsLimitController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMediator _mediator;

        public BudgetsLimitController(AppDbContext context, IMediator mediator) {
            _context = context;      
            _mediator = mediator;
        }

        /// <summary>
        /// Thêm hạn mức
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<IActionResult> CreateBudgetsLimit([FromBody] CreateOrUpdateBudgetsLimitCommand request)
        {
            var response = await _mediator.Send(request);

            if (response.Success)
                return Ok(response); // 200

            if (response.Errors != null && response.Errors.Any())
                return BadRequest(response); // 400

            return StatusCode(500, response); // fallback
        }
    }
}
