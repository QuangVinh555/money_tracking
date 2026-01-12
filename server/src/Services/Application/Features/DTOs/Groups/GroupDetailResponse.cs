using System.Collections.Generic;

namespace Application.Features.DTOs.Groups
{
    public class GroupDetailResponse
    {
        public int GroupId { get; set; }
        public string GroupName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal BudgetLimit { get; set; }
        public int CreatedByUserId { get; set; }
        public string CreatedByUserName { get; set; } = string.Empty;
        public List<GroupMemberResponse> Members { get; set; } = new List<GroupMemberResponse>();
        public decimal TotalBalance { get; set; }
        public string CurrentUserRole { get; set; } = string.Empty;
    }
}
