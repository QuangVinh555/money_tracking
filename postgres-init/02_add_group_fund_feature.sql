-- =====================================================
-- Migration Script: Add Group Fund Feature
-- Date: 2026-01-12
-- Description: Thêm bảng groups, group_members và cột group_id vào transactions
-- =====================================================

-- Create Groups table
CREATE TABLE IF NOT EXISTS groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by_user_id INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    actived BOOLEAN DEFAULT TRUE,
    budget_limit DECIMAL(15, 2) DEFAULT 0,
    CONSTRAINT fk_created_by_user_id FOREIGN KEY (created_by_user_id) 
        REFERENCES users(user_id)
);

-- Create GroupMembers table
CREATE TABLE IF NOT EXISTS group_members (
    group_member_id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    actived BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_group_member_group_id FOREIGN KEY (group_id) 
        REFERENCES groups(group_id) ON DELETE CASCADE,
    CONSTRAINT fk_group_member_user_id FOREIGN KEY (user_id) 
        REFERENCES users(user_id),
    CONSTRAINT unique_group_user UNIQUE(group_id, user_id)
);

-- Add GroupId column to Transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS group_id INTEGER;

-- Add foreign key constraint
ALTER TABLE transactions
ADD CONSTRAINT fk_group_id FOREIGN KEY (group_id) 
    REFERENCES groups(group_id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_group_id ON transactions(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_created_by_user_id ON groups(created_by_user_id);

-- Add comments
COMMENT ON TABLE groups IS 'Bảng lưu thông tin các nhóm quỹ';
COMMENT ON TABLE group_members IS 'Bảng lưu thành viên của các nhóm';
COMMENT ON COLUMN transactions.group_id IS 'NULL = giao dịch cá nhân, NOT NULL = giao dịch nhóm';
