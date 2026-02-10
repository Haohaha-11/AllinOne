-- Add indexes for search performance optimization

-- Index on user_id for filtering user's content
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);

-- Index on title for text search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_content_items_title_lower ON content_items(LOWER(title));

-- Index on description for text search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_content_items_description_lower ON content_items(LOWER(description));

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at DESC);

-- Index on platform for filtering
CREATE INDEX IF NOT EXISTS idx_content_items_platform ON content_items(platform);

-- Index on folder_id for filtering
CREATE INDEX IF NOT EXISTS idx_content_items_folder_id ON content_items(folder_id);

-- Composite index for user_id + created_at (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_content_items_user_created ON content_items(user_id, created_at DESC);

-- Index on content_tags for faster tag lookups
CREATE INDEX IF NOT EXISTS idx_content_tags_content_id ON content_tags(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tags_tag_id ON content_tags(tag_id);

-- Index on tags name for tag search (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_tags_name_lower ON tags(LOWER(name));

-- Composite index for tags user_id + name
CREATE INDEX IF NOT EXISTS idx_tags_user_name ON tags(user_id, name);
