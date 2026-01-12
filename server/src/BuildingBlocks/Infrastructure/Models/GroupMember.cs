using System;
using System.Collections.Generic;

namespace Infrastructure.Models;

public partial class GroupMember
{
    public int GroupMemberId { get; set; }

    public int GroupId { get; set; }

    public int UserId { get; set; }

    public string Role { get; set; } = null!;

    public DateTime JoinedAt { get; set; }

    public bool? Actived { get; set; }

    public virtual Group Group { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
