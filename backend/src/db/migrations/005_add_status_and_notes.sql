-- Add status and notes fields to content_items table

-- Add priority field (1=low, 2=medium, 3=high, null=none)
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS priority INTEGER CHECK (priority IN (1, 2, 3));

-- Add is_read field (default false)
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Add notes field for markdown notes
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add index for filtering by priority and read status
CREATE INDEX IF NOT EXISTS idx_content_items_priority ON content_items(priority);
CREATE INDEX IF NOT EXISTS idx_content_items_is_read ON content_items(is_read);

-- Add updated_at field to track when notes are modified
ALTER TABLE content_items 
ADD COLUMN IF NOT EXISTS notes_updated_at TIMESTAMP;
