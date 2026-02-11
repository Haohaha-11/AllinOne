-- 添加默认用户
-- 创建时间: 2024-02-11

-- 插入默认用户（如果不存在）
INSERT INTO users (id, email, password_hash)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'default@example.com',
  'default_password_hash'
)
ON CONFLICT (id) DO NOTHING;

-- 添加注释
COMMENT ON TABLE users IS '用户表 - 包含默认用户 550e8400-e29b-41d4-a716-446655440000';
