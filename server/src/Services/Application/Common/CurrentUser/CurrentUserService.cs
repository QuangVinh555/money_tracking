using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace Application.Common.CurrentUser
{
    public interface ICurrentUserService
    {
        int? UserId { get; }
    }

    public class CurrentUserService : ICurrentUserService
    {
        public int? UserId { get; }

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            var userIdClaim = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var id))
            {
                UserId = id;
            }
        }
    }

}
