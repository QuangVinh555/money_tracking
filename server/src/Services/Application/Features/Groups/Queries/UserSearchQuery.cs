using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Common.CurrentUser;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Groups.Queries
{
    public class UserSearchResponse
    {
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }

    public interface IUserSearchQuery
    {
        /// <summary>
        /// Tìm kiếm user theo email
        /// </summary>
        Task<List<UserSearchResponse>> SearchUsersByEmailAsync(string email);
    }

    public class UserSearchQuery : IUserSearchQuery
    {
        private readonly AppDbContext _context;
        private readonly ICurrentUserService _currentUser;

        public UserSearchQuery(AppDbContext context, ICurrentUserService currentUser)
        {
            _context = context;
            _currentUser = currentUser;
        }

        public async Task<List<UserSearchResponse>> SearchUsersByEmailAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return new List<UserSearchResponse>();
            }

            var users = await _context.Users
                .Where(u => u.Email != null && u.Email.ToLower().Contains(email.ToLower()))
                .Where(u => u.Actived == true)
                .Take(10) // Giới hạn 10 kết quả
                .Select(u => new UserSearchResponse
                {
                    UserId = u.UserId,
                    UserName = u.Username ?? "",
                    FullName = u.Fullname ?? "",
                    Email = u.Email ?? ""
                })
                .ToListAsync();

            return users;
        }
    }
}
