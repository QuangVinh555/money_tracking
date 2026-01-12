-- =====================================================
-- Migration Script: Add Budget Limit to Groups
-- Date: 2026-01-12
-- Description: Thêm cột budget_limit vào bảng groups
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'groups' AND column_name = 'budget_limit') THEN
        ALTER TABLE groups ADD COLUMN budget_limit DECIMAL(15, 2) DEFAULT 0;
    END IF;
END $$;

COMMENT ON COLUMN groups.budget_limit IS 'Hạn mức chi tiêu của nhóm';
