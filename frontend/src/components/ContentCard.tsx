import React from 'react';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  cover_image_url?: string;
  author?: string;
  platform: string;
  url: string;
  createdAt: string;
  created_at?: string;
  tags?: Array<{ id: string; name: string }>;
  priority?: number | null;
  is_read?: boolean;
  notes?: string;
}

interface ContentCardProps {
  item: ContentItem;
  onClick?: (item: ContentItem) => void;
  onContextMenu?: (item: ContentItem, event: React.MouseEvent) => void;
  onPriorityChange?: (item: ContentItem, priority: number | null) => void;
  onReadStatusChange?: (item: ContentItem, isRead: boolean) => void;
  onNotesClick?: (item: ContentItem) => void;
}

export function ContentCard({ 
  item, 
  onClick, 
  onContextMenu,
  onPriorityChange,
  onReadStatusChange,
  onNotesClick
}: ContentCardProps) {
  const handleClick = () => {
    onClick?.(item);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onContextMenu?.(item, e);
  };

  const handlePriorityClick = (e: React.MouseEvent, priority: number | null) => {
    e.stopPropagation();
    onPriorityChange?.(item, priority);
  };

  const handleReadStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReadStatusChange?.(item, !item.is_read);
  };

  const handleNotesClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNotesClick?.(item);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    
    // Format as YYYY-MM-DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      wechat: '📱',
      zhihu: '🔵',
      xiaohongshu: '📕',
      douyin: '🎵',
      bilibili: '📺',
    };
    return icons[platform] || '🔗';
  };

  const getPriorityColor = (priority: number | null) => {
    if (!priority) return 'transparent';
    switch (priority) {
      case 1: return '#4caf50'; // Low - Green
      case 2: return '#ff9800'; // Medium - Orange
      case 3: return '#f44336'; // High - Red
      default: return 'transparent';
    }
  };

  return (
    <div className={`content-card ${item.is_read ? 'read' : 'unread'}`} onClick={handleClick} onContextMenu={handleContextMenu}>
      {/* Priority Indicator */}
      <div className="card-priority-indicator">
        <div 
          className={`priority-dot ${item.priority ? 'active' : ''}`}
          style={{ backgroundColor: getPriorityColor(item.priority) }}
          title={item.priority ? `Priority: ${['', 'Low', 'Medium', 'High'][item.priority]}` : 'No priority'}
        />
      </div>

      {/* Read Status Badge */}
      {item.is_read && (
        <div className="card-read-badge" title="Read">
          ✓
        </div>
      )}

      {(item.coverImageUrl || item.cover_image_url) && (
        <div className="card-image">
          <img
            src={item.coverImageUrl || item.cover_image_url}
            alt={item.title}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>

        {item.description && <p className="card-description">{item.description}</p>}

        <div className="card-meta">
          <span className="platform-icon">{getPlatformIcon(item.platform)}</span>
          {item.author && <span className="author">{item.author}</span>}
          <span className="date">📅 {formatDate(item.createdAt || item.created_at)}</span>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="card-tags">
            {item.tags.map((tag) => (
              <span key={tag.id} className="card-tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Card Actions */}
        <div className="card-status-actions">
          {/* Priority Selector */}
          <div className="priority-selector">
            <button
              className={`priority-btn ${item.priority === 1 ? 'active' : ''}`}
              onClick={(e) => handlePriorityClick(e, item.priority === 1 ? null : 1)}
              title="Low Priority"
              style={{ color: '#4caf50' }}
            >
              ●
            </button>
            <button
              className={`priority-btn ${item.priority === 2 ? 'active' : ''}`}
              onClick={(e) => handlePriorityClick(e, item.priority === 2 ? null : 2)}
              title="Medium Priority"
              style={{ color: '#ff9800' }}
            >
              ●
            </button>
            <button
              className={`priority-btn ${item.priority === 3 ? 'active' : ''}`}
              onClick={(e) => handlePriorityClick(e, item.priority === 3 ? null : 3)}
              title="High Priority"
              style={{ color: '#f44336' }}
            >
              ●
            </button>
          </div>

          {/* Read Status Toggle */}
          <button
            className={`read-status-btn ${item.is_read ? 'read' : 'unread'}`}
            onClick={handleReadStatusClick}
            title={item.is_read ? 'Mark as unread' : 'Mark as read'}
          >
            {item.is_read ? '✓ Read' : '○ Unread'}
          </button>

          {/* Notes Button */}
          <button
            className={`notes-btn ${item.notes ? 'has-notes' : ''}`}
            onClick={handleNotesClick}
            title={item.notes ? 'Edit notes' : 'Add notes'}
          >
            📝 {item.notes ? 'Notes' : 'Add Note'}
          </button>
        </div>
      </div>
    </div>
  );
}
