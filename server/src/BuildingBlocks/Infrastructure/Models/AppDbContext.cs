using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Budget> Budgets { get; set; }

    public virtual DbSet<BudgetsLimit> BudgetsLimits { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Group> Groups { get; set; }

    public virtual DbSet<GroupMember> GroupMembers { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Budget>(entity =>
        {
            entity.HasKey(e => e.BudgetId).HasName("budgets_pk");

            entity.ToTable("budgets");

            entity.Property(e => e.BudgetId).HasColumnName("budget_id");
            entity.Property(e => e.Actived).HasColumnName("actived");
            entity.Property(e => e.Amount)
                .HasPrecision(15, 2)
                .HasColumnName("amount");
            entity.Property(e => e.BudgetsLimitId).HasColumnName("budgets_limit_id");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.EndDate).HasColumnName("end_date");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
        });

        modelBuilder.Entity<BudgetsLimit>(entity =>
        {
            entity.HasKey(e => e.BudgetsLimitId).HasName("budgets_limit_pk");

            entity.ToTable("budgets_limit");

            entity.Property(e => e.BudgetsLimitId).HasColumnName("budgets_limit_id");
            entity.Property(e => e.Actived).HasColumnName("actived");
            entity.Property(e => e.BudgetsLimitEndDate).HasColumnName("budgets_limit_end_date");
            entity.Property(e => e.BudgetsLimitStartDate).HasColumnName("budgets_limit_start_date");
            entity.Property(e => e.BudgetsLimitTotal)
                .HasPrecision(15, 2)
                .HasColumnName("budgets_limit_total");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("categories_pk");

            entity.ToTable("categories");

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Actived).HasColumnName("actived");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(50)
                .HasColumnName("category_name");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Index).HasColumnName("index");
            entity.Property(e => e.IsFixedCost).HasColumnName("is_fixed_cost");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("groups_pkey");

            entity.ToTable("groups");

            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.Actived)
                .HasDefaultValue(true)
                .HasColumnName("actived");
            entity.Property(e => e.BudgetLimit)
                .HasPrecision(15, 2)
                .HasDefaultValueSql("0")
                .HasColumnName("budget_limit");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatedByUserId).HasColumnName("created_by_user_id");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.GroupName)
                .HasMaxLength(100)
                .HasColumnName("group_name");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(d => d.CreatedByUser).WithMany(p => p.Groups)
                .HasForeignKey(d => d.CreatedByUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_created_by_user_id");
        });

        modelBuilder.Entity<GroupMember>(entity =>
        {
            entity.HasKey(e => e.GroupMemberId).HasName("group_members_pkey");

            entity.ToTable("group_members");

            entity.HasIndex(e => new { e.GroupId, e.UserId }, "unique_group_user").IsUnique();

            entity.Property(e => e.GroupMemberId).HasColumnName("group_member_id");
            entity.Property(e => e.Actived)
                .HasDefaultValue(true)
                .HasColumnName("actived");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.JoinedAt)
                .HasDefaultValueSql("now()")
                .HasColumnName("joined_at");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValueSql("'member'::character varying")
                .HasColumnName("role");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Group).WithMany(p => p.GroupMembers)
                .HasForeignKey(d => d.GroupId)
                .HasConstraintName("fk_group_member_group_id");

            entity.HasOne(d => d.User).WithMany(p => p.GroupMembers)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_group_member_user_id");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.TransactionId).HasName("transactions_pk");

            entity.ToTable("transactions");

            entity.Property(e => e.TransactionId).HasColumnName("transaction_id");
            entity.Property(e => e.Actived).HasColumnName("actived");
            entity.Property(e => e.Amount)
                .HasPrecision(15, 2)
                .HasColumnName("amount");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.GroupId).HasColumnName("group_id");
            entity.Property(e => e.TransactionDate).HasColumnName("transaction_date");
            entity.Property(e => e.TransactionType).HasColumnName("transaction_type");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.Category).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("fk_category_id");

            entity.HasOne(d => d.Group).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.GroupId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("fk_group_id");

            entity.HasOne(d => d.User).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_user_id");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("users_pk");

            entity.ToTable("users");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Actived).HasColumnName("actived");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DeletedAt).HasColumnName("deleted_at");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.Fullname)
                .HasMaxLength(100)
                .HasColumnName("fullname");
            entity.Property(e => e.LastLoginAt).HasColumnName("last_login_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
