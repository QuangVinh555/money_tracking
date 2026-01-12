using System;

namespace Application.Features.DTOs.Groups
{
    public class GroupMemberResponse
    {
        public int GroupMemberId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime JoinedAt { get; set; }
    }
}
