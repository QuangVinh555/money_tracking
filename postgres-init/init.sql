-- Tạo bảng Users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    actived BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Tạo bảng Categories
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    actived BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Tạo bảng Transactions
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_date TIMESTAMPTZ NOT NULL,
    transaction_type INTEGER,
    actived BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Tạo bảng Budgets
CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    amount DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    actived BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Tạo bảng Budgets Limit
CREATE TABLE budgets_limit (
    budgets_limit_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    budgets_limit_start_date TIMESTAMPTZ,
    budgets_limit_end_date TIMESTAMPTZ,
    budgets_limit_total DECIMAL(15,2),
    actived BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- Chèn dữ liệu mẫu vào bảng Users
INSERT INTO users (username, fullname, email, actived) VALUES
('user1', 'Nguyễn Văn A', 'nguyenvana@example.com', TRUE),
('user2', 'Trần Thị B', 'tranthib@example.com', TRUE);

-- Chèn dữ liệu mẫu vào bảng Categories
INSERT INTO categories (category_name, actived) VALUES
('Ăn uống', TRUE),
('Giải trí', TRUE),
('Mua sắm', TRUE),
('Lương', TRUE);

-- Chèn dữ liệu mẫu vào bảng Transactions
INSERT INTO transactions (user_id, category_id, amount, transaction_date, transaction_type, actived) VALUES
(1, 1, 150000, '2025-06-01', 2, TRUE),
(1, 4, 5000000, '2025-06-02', 1, TRUE),
(2, 2, 300000, '2025-06-03', 2, TRUE),
(2, 3, 1000000, '2025-06-04', 2, TRUE);

-- Chèn dữ liệu mẫu vào bảng Budgets
INSERT INTO budgets (user_id, category_id, amount, start_date, end_date, actived) VALUES
(1, 1, 2000000, '2025-06-01', '2025-06-30', TRUE),
(1, 2, 1000000, '2025-06-01', '2025-06-30', TRUE),
(2, 3, 3000000, '2025-06-01', '2025-06-30', TRUE);
