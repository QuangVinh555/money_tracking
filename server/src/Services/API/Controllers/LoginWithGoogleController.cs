using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http.HttpResults;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginWithGoogleController
    {
        public LoginWithGoogleController()
        {

        }

        [HttpPost("google")]
        public async Task<IActionResult> LoginWithGoogle([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken);

                // Nếu valid, bạn có thể tạo hoặc tìm user từ DB
                var userEmail = payload.Email;
                var userName = payload.Name;

                // → Ví dụ tạo JWT hệ thống bạn trả về frontend:
                var claims = new[]
                {
                new Claim(ClaimTypes.Name, userEmail),
                new Claim("FullName", userName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("super-secret-key-123456"));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: "your-app",
                    audience: "your-app",
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(1),
                    signingCredentials: creds);

                //return OK(new
                //{
                //    token = new JwtSecurityTokenHandler().WriteToken(token)
                //});
                return null;
            }
            catch (Exception ex)
            {
                //return statuscod(500);
                return null;
            }
        }

        public class GoogleAuthRequest
        {
            public string IdToken { get; set; }
        }
    }
}
