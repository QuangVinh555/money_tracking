using Infrastructure.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TransactionsController(AppDbContext context) {
            _context = context;      
        }
        [HttpGet]
        public IActionResult GetListTransactions()
        {
            var transactions = _context.Transactions.ToList();
            return Ok(transactions);
        }
    }
}
