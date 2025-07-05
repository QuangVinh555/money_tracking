using System;
using System.Collections.Generic;

namespace Infrastructure.Models;

public partial class User
{
    public int UserId { get; set; }

    public string? Username { get; set; }

    public string? Fullname { get; set; }

    public string? Email { get; set; }

    public bool? Actived { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public DateTime? LastLoginAt { get; set; }

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
