-- 种子数据 - 用于开发和测试

-- 注意：这个文件仅用于开发环境
-- 生产环境不应该运行此脚本

-- 创建测试用户（密码: test123）
INSERT INTO users (id, email, password_hash) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', '$2b$10$rKvVXZhQJvXqQxQxQxQxQeO8YvYvYvYvYvYvYvYvYvYvYvYvYvY');

-- 创建默认"未分类"文件夹
INSERT INTO folders (id, user_id, name) VALUES
  ('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', '未分类');

-- 创建示例文件夹
INSERT INTO folders (user_id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', '技术文章'),
  ('550e8400-e29b-41d4-a716-446655440000', '生活灵感');

-- 创建示例标签
INSERT INTO tags (user_id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'JavaScript'),
  ('550e8400-e29b-41d4-a716-446655440000', 'React'),
  ('550e8400-e29b-41d4-a716-446655440000', '前端开发');
