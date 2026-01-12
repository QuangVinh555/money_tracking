using System;
using System.Collections.Generic;

namespace Infrastructure.Models;

public partial class Group
{
    public int GroupId { get; set; }

    public string GroupName { get; set; } = null!;

    public string? Description { get; set; }

    public int CreatedByUserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public bool? Actived { get; set; }

    public decimal? BudgetLimit { get; set; }

    public virtual User CreatedByUser { get; set; } = null!;

    public virtual ICollection<GroupMember> GroupMembers { get; set; } = new List<GroupMember>();

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
