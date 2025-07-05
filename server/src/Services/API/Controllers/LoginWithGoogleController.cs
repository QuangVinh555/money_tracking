using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Models;
using System.Xml.Linq;
using Microsoft.Extensions.Configuration;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginWithGoogleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public LoginWithGoogleController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("google")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);

                // Nếu valid, bạn có thể tạo hoặc tìm user từ DB
                var email = payload.Email;
                var userName = payload.Name;
                var fullName = payload.Name;

                // Nếu xác thực thành công thì check xem user này có tồn tại trong db hay chưa
                // Tìm user theo email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
                if (user == null) {
                    // Tạo mới user
                    user = new User
                    {
                        Email = email,
                        Username = userName,
                        Fullname = fullName,
                        Actived = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow,
                        LastLoginAt = DateTime.UtcNow,
                    };
                    _context.Users.Add(user);
                }
                else
                {
                    user.LastLoginAt = DateTime.UtcNow;
                }

                // → Ví dụ tạo JWT hệ thống bạn trả về frontend:
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()), // ID kiểu int
                    new Claim(ClaimTypes.Email, user.Email ?? ""),
                    new Claim("FullName", user.Fullname ?? ""),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:issuer"],
                    audience: _configuration["Jwt:audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(1), // Hết hạn token sau 1 ngày
                    signingCredentials: creds
                );

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    UserInfo = new
                    {
                        id = user.UserId,
                        email = user.Email,
                        fullName = user.Fullname
                    },
                    token = new JwtSecurityTokenHandler().WriteToken(token)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error {ex}");
            }
        }

        public class GoogleAuthRequest
        {
            public string IdToken { get; set; } = string.Empty;
        }
    }
}
