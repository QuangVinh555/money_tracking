using Application.Features.Commands.Transactions;
using Infrastructure.Models;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMediator _mediator;

        public TransactionsController(AppDbContext context, IMediator mediator) {
            _context = context;      
            _mediator = mediator;
        }
        [HttpGet]
        public IActionResult GetListTransactions()
        {
            var transactions = _context.Transactions.ToList();
            return Ok(transactions);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction(CreateTransactionsCommand request)
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
