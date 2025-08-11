using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Features.DTOs.Category;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Queries.Category
{
    public interface ICategoriesQuery
    {
        /// <summary>
        /// Lấy ra tất cả danh mục của giao dịch
        /// </summary>
        /// <returns></returns>
        public Task<List<CategoriesResponse>> GetAllCategories();
    }

    public class CategoriesQuery : ICategoriesQuery
    {
        private readonly AppDbContext _context;

        public CategoriesQuery(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<CategoriesResponse>> GetAllCategories()
        {
            var categories = await _context.Categories.Select(c => new CategoriesResponse
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName,
                Index = c.Index,
                Type = c.Type,
                Actived = c.Actived,
                Created_At = c.CreatedAt,
                Updated_At = c.UpdatedAt,
            }).ToListAsync();

            return categories;
        }
    }
}
