using System;
using System.Collections.Generic;

namespace Infrastructure.Models;

public partial class BudgetsLimit
{
    public int BudgetsLimitId { get; set; }

    public int UserId { get; set; }

    public DateOnly? BudgetsLimitStartDate { get; set; }

    public DateOnly? BudgetsLimitEndDate { get; set; }

    public decimal? BudgetsLimitTotal { get; set; }

    public bool? Actived { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
