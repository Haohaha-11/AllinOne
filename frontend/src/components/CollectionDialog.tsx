import React, { useState } from 'react';

interface Folder {
  id: string;
  name: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
}

interface CollectionDialogProps {
  url: string;
  folders?: Folder[];
  existingTags?: Tag[];
  metadata?: {
    title: string;
    description: string;
    coverImage: string;
    author: string;
    platform: string;
  };
  onConfirm: (data: {
    url: string;
    folderId?: string;
    tags: string[];
    title?: string;
    description?: string;
  }) => void;
  onCancel: () => void;
}

export function CollectionDialog({ 
  url, 
  folders = [], 
  existingTags = [],
  metadata, 
  onConfirm, 
  onCancel 
}: CollectionDialogProps) {
  const [customTitle, setCustomTitle] = useState(metadata?.title || '');
  const [customDescription, setCustomDescription] = useState(metadata?.description || '');
  const [folderId, setFolderId] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleAddNewTag = () => {
    const trimmedTag = newTagInput.trim();
    if (trimmedTag && !selectedTags.includes(trimmedTag)) {
      setSelectedTags([...selectedTags, trimmedTag]);
      setNewTagInput('');
      setShowNewTagInput(false);
    }
  };

  const handleRemoveSelectedTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tagName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      url,
      folderId: folderId || undefined,
      tags: selectedTags,
      title: customTitle,
      description: customDescription,
    });
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog collection-dialog-large">
        <h2>Save Content</h2>

        <form onSubmit={handleSubmit}>
          {metadata?.coverImage && (
            <div className="preview-image-container">
              <img src={metadata.coverImage} alt="Cover" className="preview-image" />
            </div>
          )}

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Folder</label>
            <select value={folderId} onChange={(e) => setFolderId(e.target.value)}>
              <option value="">Uncategorized</option>
              {folders.map(folder => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tags (Select multiple)</label>
            
            {/* Selected Tags Display */}
            {selectedTags.length > 0 && (
              <div className="selected-tags-container">
                {selectedTags.map(tag => (
                  <span key={tag} className="selected-tag">
                    {tag}
                    <button
                      type="button"
                      className="remove-tag-btn"
                      onClick={() => handleRemoveSelectedTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Existing Tags Selection */}
            {existingTags.length > 0 && (
              <div className="tags-selection-grid">
                {existingTags.map(tag => (
                  <button
                    key={tag.id}
                    type="button"
                    className={`tag-select-btn ${selectedTags.includes(tag.name) ? 'selected' : ''}`}
                    onClick={() => handleToggleTag(tag.name)}
                  >
                    {selectedTags.includes(tag.name) ? '✓ ' : ''}{tag.name}
                  </button>
                ))}
              </div>
            )}

            {/* Create New Tag */}
            {!showNewTagInput ? (
              <button
                type="button"
                className="btn-create-tag"
                onClick={() => setShowNewTagInput(true)}
              >
                + Create New Tag
              </button>
            ) : (
              <div className="new-tag-input-container">
                <input
                  type="text"
                  placeholder="Enter new tag name..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNewTag();
                    } else if (e.key === 'Escape') {
                      setShowNewTagInput(false);
                      setNewTagInput('');
                    }
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn-add-tag"
                  onClick={handleAddNewTag}
                  disabled={!newTagInput.trim()}
                >
                  Add
                </button>
                <button
                  type="button"
                  className="btn-cancel-tag"
                  onClick={() => {
                    setShowNewTagInput(false);
                    setNewTagInput('');
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="dialog-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
