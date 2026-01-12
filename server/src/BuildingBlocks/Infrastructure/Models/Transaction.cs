using System;
using System.Collections.Generic;

namespace Infrastructure.Models;

public partial class Transaction
{
    public int TransactionId { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public decimal? Amount { get; set; }

    public DateOnly TransactionDate { get; set; }

    public bool? Actived { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public int? TransactionType { get; set; }

    public string? Description { get; set; }

    public int? GroupId { get; set; }

    public virtual Category Category { get; set; } = null!;

    public virtual Group? Group { get; set; }

    public virtual User User { get; set; } = null!;
}
