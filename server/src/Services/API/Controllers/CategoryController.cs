using Application.Features.DTOs.Category;
using Application.Features.DTOs.Transactions;
using Application.Features.Queries.Category;
using Core.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoriesQuery _categoriesQuery;

        public CategoryController(ICategoriesQuery categoriesQuery) {
            _categoriesQuery = categoriesQuery;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var data = await _categoriesQuery.GetAllCategories();

            return Ok(new ApiResponse<List<CategoriesResponse>>
            {
                Success = true,
                Data = data,
                Message = "Lấy danh sách danh mục thành công."
            });
        }
    }
}
