import { useState, useEffect, useRef } from 'react';
import { ClipboardMonitor } from './components/ClipboardMonitor';
import { CollectionDialog } from './components/CollectionDialog';
import { ContentCard } from './components/ContentCard';
import { NotesDialog } from './components/NotesDialog';
import { API_URL } from './config';

interface Folder {
  id: string;
  name: string;
  description?: string;
  contentCount: number;
  children: Folder[];
  created_at: string;
}

function App() {
  const [showDialog, setShowDialog] = useState(false);
  const [detectedUrl, setDetectedUrl] = useState('');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [uncategorizedItems, setUncategorizedItems] = useState<any[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folderContents, setFolderContents] = useState<any[]>([]);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [showEditFolderDialog, setShowEditFolderDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [showEditContentDialog, setShowEditContentDialog] = useState(false);
  const [showMoveContentDialog, setShowMoveContentDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<any | null>(null);
  const [editContentTitle, setEditContentTitle] = useState('');
  const [editContentDescription, setEditContentDescription] = useState('');
  const [moveToFolderId, setMoveToFolderId] = useState('');
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResultsByType, setSearchResultsByType] = useState<{
    byTitle: any[];
    byDescription: any[];
    byTags: any[];
  }>({ byTitle: [], byDescription: [], byTags: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [currentTag, setCurrentTag] = useState<any | null>(null);
  const [tagContents, setTagContents] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [manualUrl, setManualUrl] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingTag, setEditingTag] = useState<any | null>(null);
  const [showEditTagDialog, setShowEditTagDialog] = useState(false);
  const [editTagName, setEditTagName] = useState('');
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [editingNotes, setEditingNotes] = useState<any | null>(null);
  const [notesContent, setNotesContent] = useState('');

  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadFolders();
    loadUncategorizedItems();
    loadTags();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/folders/tree?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    } catch (error) {
      console.error('Load folders failed:', error);
    }
  };

  const loadUncategorizedItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/collections?userId=${userId}&uncategorized=true`);
      if (response.ok) {
        const data = await response.json();
        setUncategorizedItems(data);
      }
    } catch (error) {
      console.error('Load uncategorized items failed:', error);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tags?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Load tags failed:', error);
    }
  };

  const loadFolderContents = async (folderId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/folders/${folderId}/contents`);
      if (response.ok) {
        const data = await response.json();
        setFolderContents(data);
      }
    } catch (error) {
      console.error('Load folder contents failed:', error);
    }
  };

  const handleFolderClick = async (folder: Folder) => {
    setCurrentFolder(folder);
    await loadFolderContents(folder.id);
  };

  const handleBackToFolders = () => {
    setCurrentFolder(null);
    setFolderContents([]);
  };

  const handleLinkDetected = (url: string) => {
    setDetectedUrl(url);
    setShowDialog(true);
  };

  const handleConfirm = async (data: any) => {
    setLoading(true);
    try {
      console.log('Sending request:', data);
      const response = await fetch(`${API_URL}/api/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: data.url,
          userId: userId,
          customTitle: data.title,
          customDescription: data.description,
          folderId: data.folderId || currentFolder?.id || null,
          tags: data.tags || [],
        }),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        setShowDialog(false);
        setShowPasteDialog(false);
        setManualUrl('');
        
        if (currentFolder) {
          await loadFolderContents(currentFolder.id);
        } else {
          await loadUncategorizedItems();
        }
        await loadFolders();
        await loadTags(); // Reload tags to show new tags
      } else {
        console.error('Failed:', responseData);
        alert(`Failed: ${responseData.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed: Please check network and backend');
    } finally {
      setLoading(false);
    }
  };

  const handleManualPaste = () => {
    if (manualUrl.trim()) {
      setDetectedUrl(manualUrl);
      setShowDialog(true);
      setShowPasteDialog(false);
    } else {
      alert('Please enter a link');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      alert('Please enter folder name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          description: newFolderDescription,
          userId: userId,
        }),
      });

      if (response.ok) {
        await response.json(); // Consume response
        setShowFolderDialog(false);
        setNewFolderName('');
        setNewFolderDescription('');
        await loadFolders();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Create folder failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderDescription(folder.description || '');
    setShowEditFolderDialog(true);
  };

  const handleUpdateFolder = async () => {
    if (!editingFolder || !newFolderName.trim()) {
      alert('Please enter folder name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/folders/${editingFolder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName,
          description: newFolderDescription,
        }),
      });

      if (response.ok) {
        setShowEditFolderDialog(false);
        setEditingFolder(null);
        setNewFolderName('');
        setNewFolderDescription('');
        await loadFolders();
        if (currentFolder && currentFolder.id === editingFolder.id) {
          const updatedFolder = await response.json();
          setCurrentFolder(updatedFolder);
        }
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Update folder failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFolder = async (folderId: string, folderName: string) => {
    if (!confirm(`Delete folder "${folderName}"? Items inside will become uncategorized.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/folders/${folderId}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        await loadFolders();
        await loadUncategorizedItems();
        if (currentFolder && currentFolder.id === folderId) {
          handleBackToFolders();
        }
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Delete folder failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handleEditContent = (content: any) => {
    setEditingContent(content);
    setEditContentTitle(content.title);
    setEditContentDescription(content.description || '');
    setShowEditContentDialog(true);
  };

  const handleUpdateContent = async () => {
    if (!editingContent || !editContentTitle.trim()) {
      alert('Please enter title');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/collections/${editingContent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editContentTitle,
          description: editContentDescription,
        }),
      });

      if (response.ok) {
        setShowEditContentDialog(false);
        setEditingContent(null);
        setEditContentTitle('');
        setEditContentDescription('');
        
        if (currentFolder) {
          await loadFolderContents(currentFolder.id);
        } else {
          await loadUncategorizedItems();
        }
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Update content failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId: string, contentTitle: string) => {
    if (!confirm(`Delete "${contentTitle}"?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/collections/${contentId}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        
        if (currentFolder) {
          await loadFolderContents(currentFolder.id);
        } else {
          await loadUncategorizedItems();
        }
        await loadFolders();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Delete content failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveContent = (content: any) => {
    setEditingContent(content);
    setMoveToFolderId('');
    setShowMoveContentDialog(true);
  };

  const handleMoveContentConfirm = async () => {
    if (!editingContent) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/collections/${editingContent.id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: moveToFolderId || null,
        }),
      });

      if (response.ok) {
        setShowMoveContentDialog(false);
        setEditingContent(null);
        setMoveToFolderId('');
        
        if (currentFolder) {
          await loadFolderContents(currentFolder.id);
        } else {
          await loadUncategorizedItems();
        }
        await loadFolders();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Move content failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const getAllFolders = (folderList: Folder[]): Folder[] => {
    let result: Folder[] = [];
    folderList.forEach(folder => {
      result.push(folder);
      if (folder.children && folder.children.length > 0) {
        result = result.concat(getAllFolders(folder.children));
      }
    });
    return result;
  };

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    
    // Minimum search length for performance
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setSearchResults([]);
      setSearchResultsByType({ byTitle: [], byDescription: [], byTags: [] });
      return;
    }

    setIsSearching(true);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout
    
    try {
      const response = await fetch(
        `${API_URL}/api/search?userId=${userId}&query=${encodeURIComponent(searchTerm)}&pageSize=100`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        
        // Categorize results efficiently
        const searchLower = searchTerm.toLowerCase();
        const byTitle: any[] = [];
        const byDescription: any[] = [];
        const byTags: any[] = [];
        
        data.forEach((item: any) => {
          if (item.title.toLowerCase().includes(searchLower)) {
            byTitle.push(item);
          } else if (item.description && item.description.toLowerCase().includes(searchLower)) {
            byDescription.push(item);
          } else {
            // Must be matched by tags
            byTags.push(item);
          }
        });
        
        setSearchResultsByType({ byTitle, byDescription, byTags });
      } else {
        alert('Search failed: ' + response.statusText);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        alert('Search timeout: Request took longer than 4 seconds. Please try a more specific search term.');
        console.error('Search timeout after 4 seconds');
      } else {
        alert('Search error: ' + error.message);
        console.error('Search error:', error);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleTagClick = async (tag: any) => {
    setCurrentTag(tag);
    await loadTagContents(tag.id);
  };

  const loadTagContents = async (tagId: string) => {
    try {
      // Get all content items with this tag
      const response = await fetch(`${API_URL}/api/tags/${tagId}/contents`);
      if (response.ok) {
        const data = await response.json();
        setTagContents(data);
      }
    } catch (error) {
      console.error('Load tag contents failed:', error);
    }
  };

  const handleBackFromTag = () => {
    setCurrentTag(null);
    setTagContents([]);
  };

  const handleEditTag = (tag: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTag(tag);
    setEditTagName(tag.name);
    setShowEditTagDialog(true);
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editTagName.trim()) {
      alert('Please enter tag name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editTagName }),
      });

      if (response.ok) {
        setShowEditTagDialog(false);
        setEditingTag(null);
        setEditTagName('');
        await loadTags();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Update tag failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTag = async (tagId: string, tagName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Delete tag "${tagName}"? This will remove the tag from all items.`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/tags/${tagId}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        await loadTags();
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Delete tag failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handlePriorityChange = async (item: any, priority: number | null) => {
    try {
      const response = await fetch(`${API_URL}/api/collections/${item.id}/priority`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      });

      if (response.ok) {
        // Reload current view
        if (currentFolder) {
          await loadFolderContents(currentFolder.id);
        } else if (currentTag) {
          await loadTagContents(currentTag.id);
        } else {
          await loadUncategorizedItems();
        }
      }
    } catch (error) {
      console.error('Update priority failed:', error);
    }
  };

  const handleReadStatusChange = async (item: any, isRead: boolean) => {
    try {
      const response = await fetch(`${API_URL}/api/collections/${item.id}/read-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead }),
      });

      if (response.ok) {
        // Reload current view
        if (currentFolder) {
          await loadFolderContents(currentFolder.id);
        } else if (currentTag) {
          await loadTagContents(currentTag.id);
        } else {
          await loadUncategorizedItems();
        }
      }
    } catch (error) {
      console.error('Update read status failed:', error);
    }
  };

  const handleNotesClick = (item: any) => {
    setEditingNotes(item);
    setNotesContent(item.notes || '');
    setShowNotesDialog(true);
  };

  const handleSaveNotes = async () => {
    if (!editingNotes) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/collections/${editingNotes.id}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesContent }),
      });

      if (response.ok) {
        setShowNotesDialog(false);
        setEditingNotes(null);
        setNotesContent('');
        
        // Reload current view
        if (currentFolder) {
          await loadFolderContents(currentFolder.id);
        } else if (currentTag) {
          await loadTagContents(currentTag.id);
        } else {
          await loadUncategorizedItems();
        }
      } else {
        const error = await response.json();
        alert(`Failed: ${error.error || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Save notes failed:', error);
      alert('Failed: Please check network');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    // Auto-search with optimized debounce (200ms)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Only search if at least 2 characters
    if (value.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value);
      }, 200);
    } else {
      // Clear results if less than 2 characters
      setSearchResults([]);
      setSearchResultsByType({ byTitle: [], byDescription: [], byTags: [] });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Format as YYYY-MM-DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const renderFolderList = (folderList: Folder[], level: number = 0) => {
    return folderList.map((folder) => (
      <div key={folder.id}>
        <div 
          className="folder-card"
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="folder-card-header" onClick={() => handleFolderClick(folder)}>
            <div className="folder-icon-small">??</div>
            <div className="folder-info">
              <h3>{folder.name}</h3>
              {folder.description && <p className="folder-description">{folder.description}</p>}
              <div className="folder-meta">
                <span className="folder-count">{folder.contentCount} items</span>
                <span className="folder-date">{formatDate(folder.created_at)}</span>
              </div>
            </div>
          </div>
          <div className="folder-actions">
            <button 
              className="folder-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleEditFolder(folder);
              }}
              title="Edit folder"
            >
              ??
            </button>
            <button 
              className="folder-action-btn delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFolder(folder.id, folder.name);
              }}
              title="Delete folder"
            >
              ???
            </button>
          </div>
        </div>
        {folder.children && folder.children.length > 0 && (
          <div className="subfolder-container">
            {renderFolderList(folder.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="app">
      <ClipboardMonitor onLinkDetected={handleLinkDetected} />

      <nav className="navbar">
        <div className="navbar-brand">
          <h1>All in One</h1>
        </div>
        
        <div className="navbar-stats">
          <div className="stat-badge">
            <span className="stat-icon">??</span>
            <span className="stat-text">{folders.length} Folders</span>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">??</span>
            <span className="stat-text">{uncategorizedItems.length} Uncategorized</span>
          </div>
          <div className="stat-badge">
            <span className="stat-icon">??</span>
            <span className="stat-text">5 Platforms</span>
          </div>
        </div>

        <div className="navbar-actions">
          {currentFolder && (
            <button className="btn btn-secondary" onClick={handleBackToFolders}>
              �� Back
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => setShowSearchDialog(true)}>
            ?? Search
          </button>
          <button className="btn btn-secondary" onClick={() => setShowFolderDialog(true)}>
            ?? New Folder
          </button>
          <button className="btn btn-primary" onClick={() => setShowPasteDialog(true)}>
            ?? Paste Link
          </button>
          <button className="btn btn-secondary" onClick={() => {
            loadFolders();
            loadUncategorizedItems();
          }}>
            ?? Refresh
          </button>
        </div>
      </nav>

      <div className="main-content">
        {currentTag ? (
          // Tag Contents View
          <div className="bookshelf">
            <div className="folder-header">
              <h2 className="section-title">
                ??? {currentTag.name}
                <span className="folder-subtitle"> ({tagContents.length} items)</span>
              </h2>
              <button className="btn btn-secondary" onClick={handleBackFromTag}>
                �� Back to Tags
              </button>
            </div>
            {tagContents.length > 0 ? (
              <div className="content-grid">
                {tagContents.map((item: any) => (
                  <div key={item.id} className="content-card-wrapper">
                    <ContentCard
                      item={item}
                      onClick={(clickedItem) => window.open(clickedItem.url, '_blank')}
                      onPriorityChange={handlePriorityChange}
                      onReadStatusChange={handleReadStatusChange}
                      onNotesClick={handleNotesClick}
                    />
                    <div className="content-actions">
                      <button 
                        className="content-action-btn"
                        onClick={() => handleEditContent(item)}
                        title="Edit"
                      >
                        ??
                      </button>
                      <button 
                        className="content-action-btn"
                        onClick={() => handleMoveContent(item)}
                        title="Move to folder"
                      >
                        ??
                      </button>
                      <button 
                        className="content-action-btn delete-btn"
                        onClick={() => handleDeleteContent(item.id, item.title)}
                        title="Delete"
                      >
                        ???
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-folder">
                <p>No items with this tag yet.</p>
              </div>
            )}
          </div>
        ) : !currentFolder ? (
          // Home View: Folders (Left) + Uncategorized Items (Right)
          <div className="home-layout">
            {/* Left: Folders Section */}
            <div className="folders-column">
              <h2 className="section-title">?? My Folders</h2>
              {folders.length > 0 ? (
                <div className="folder-list">
                  {renderFolderList(folders)}
                </div>
              ) : (
                <div className="empty-section">
                  <p>No folders yet</p>
                  <button className="btn btn-primary" onClick={() => setShowFolderDialog(true)}>
                    Create Folder
                  </button>
                </div>
              )}
            </div>

            {/* Right: Uncategorized Items Section */}
            <div className="uncategorized-column">
              <h2 className="section-title">?? Uncategorized Items</h2>
              {uncategorizedItems.length > 0 ? (
                <div className="content-grid">
                  {uncategorizedItems.map((item: any) => (
                    <div key={item.id} className="content-card-wrapper">
                      <ContentCard
                        item={item}
                        onClick={(clickedItem) => window.open(clickedItem.url, '_blank')}
                        onPriorityChange={handlePriorityChange}
                        onReadStatusChange={handleReadStatusChange}
                        onNotesClick={handleNotesClick}
                      />
                      <div className="content-actions">
                        <button 
                          className="content-action-btn"
                          onClick={() => handleEditContent(item)}
                          title="Edit"
                        >
                          ??
                        </button>
                        <button 
                          className="content-action-btn"
                          onClick={() => handleMoveContent(item)}
                          title="Move to folder"
                        >
                          ??
                        </button>
                        <button 
                          className="content-action-btn delete-btn"
                          onClick={() => handleDeleteContent(item.id, item.title)}
                          title="Delete"
                        >
                          ???
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-section">
                  <p>No uncategorized items</p>
                  <button className="btn btn-primary" onClick={() => setShowPasteDialog(true)}>
                    Add Content
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Folder Contents View
          <div className="bookshelf">
            <div className="folder-header">
              <h2 className="section-title">
                ?? {currentFolder.name}
                <span className="folder-subtitle"> ({folderContents.length} items)</span>
              </h2>
              <button className="btn btn-secondary" onClick={() => handleEditFolder(currentFolder)}>
                ?? Edit Folder
              </button>
            </div>
            {folderContents.length > 0 ? (
              <div className="content-grid">
                {folderContents.map((item: any) => (
                  <div key={item.id} className="content-card-wrapper">
                    <ContentCard
                      item={item}
                      onClick={(clickedItem) => window.open(clickedItem.url, '_blank')}
                      onPriorityChange={handlePriorityChange}
                      onReadStatusChange={handleReadStatusChange}
                      onNotesClick={handleNotesClick}
                    />
                    <div className="content-actions">
                      <button 
                        className="content-action-btn"
                        onClick={() => handleEditContent(item)}
                        title="Edit"
                      >
                        ??
                      </button>
                      <button 
                        className="content-action-btn"
                        onClick={() => handleMoveContent(item)}
                        title="Move to folder"
                      >
                        ??
                      </button>
                      <button 
                        className="content-action-btn delete-btn"
                        onClick={() => handleDeleteContent(item.id, item.title)}
                        title="Delete"
                      >
                        ???
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-folder">
                <p>This folder is empty. Paste a link to add content here.</p>
                <button className="btn btn-primary" onClick={() => setShowPasteDialog(true)}>
                  ?? Add Content
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tags Section at Bottom */}
        {tags.length > 0 && !currentTag && (
          <div className="tags-section">
            <h3 className="tags-title">??? Tags</h3>
            <div className="tags-cloud">
              {tags.map((tag: any) => (
                <div key={tag.id} className="tag-chip-wrapper">
                  <button
                    className="tag-chip"
                    onClick={() => handleTagClick(tag)}
                    title={`View ${tag.contentCount || 0} items with tag: ${tag.name}`}
                  >
                    {tag.name}
                    {tag.contentCount > 0 && (
                      <span className="tag-count">{tag.contentCount}</span>
                    )}
                  </button>
                  <div className="tag-actions">
                    <button
                      className="tag-action-btn"
                      onClick={(e) => handleEditTag(tag, e)}
                      title="Edit tag"
                    >
                      ??
                    </button>
                    <button
                      className="tag-action-btn delete-btn"
                      onClick={(e) => handleDeleteTag(tag.id, tag.name, e)}
                      title="Delete tag"
                    >
                      ???
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showDialog && (
        <CollectionDialog
          url={detectedUrl}
          folders={getAllFolders(folders)}
          existingTags={tags}
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowDialog(false);
            setManualUrl('');
          }}
        />
      )}

      {showPasteDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Paste Link</h2>
            <p>Supported: Zhihu, WeChat, Xiaohongshu, Douyin, Bilibili</p>
            <div className="form-group">
              <input
                type="text"
                placeholder="Paste link here..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualPaste()}
                autoFocus
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => setShowPasteDialog(false)}>Cancel</button>
              <button onClick={handleManualPaste} disabled={!manualUrl.trim()}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showFolderDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>New Folder</h2>
            <p>Create a new folder to organize your content</p>
            <div className="form-group">
              <label>Folder Name</label>
              <input
                type="text"
                placeholder="e.g. Tech Articles, Design Inspiration..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                placeholder="Describe what this folder is for..."
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => {
                setShowFolderDialog(false);
                setNewFolderName('');
                setNewFolderDescription('');
              }}>Cancel</button>
              <button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditFolderDialog && editingFolder && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Edit Folder</h2>
            <div className="form-group">
              <label>Folder Name</label>
              <input
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                placeholder="Describe what this folder is for..."
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => {
                setShowEditFolderDialog(false);
                setEditingFolder(null);
                setNewFolderName('');
                setNewFolderDescription('');
              }}>Cancel</button>
              <button onClick={handleUpdateFolder} disabled={!newFolderName.trim()}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditContentDialog && editingContent && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Edit Content</h2>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Content title..."
                value={editContentTitle}
                onChange={(e) => setEditContentTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                placeholder="Add a description..."
                value={editContentDescription}
                onChange={(e) => setEditContentDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => {
                setShowEditContentDialog(false);
                setEditingContent(null);
                setEditContentTitle('');
                setEditContentDescription('');
              }}>Cancel</button>
              <button onClick={handleUpdateContent} disabled={!editContentTitle.trim()}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showMoveContentDialog && editingContent && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Move Content</h2>
            <p>Move "{editingContent.title}" to:</p>
            <div className="form-group">
              <label>Select Folder</label>
              <select
                value={moveToFolderId}
                onChange={(e) => setMoveToFolderId(e.target.value)}
                autoFocus
              >
                <option value="">Uncategorized</option>
                {getAllFolders(folders).map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="dialog-actions">
              <button onClick={() => {
                setShowMoveContentDialog(false);
                setEditingContent(null);
                setMoveToFolderId('');
              }}>Cancel</button>
              <button onClick={handleMoveContentConfirm}>
                Move
              </button>
            </div>
          </div>
        </div>
      )}

      {showSearchDialog && (
        <div className="dialog-overlay">
          <div className="dialog search-dialog">
            <h2>?? Search Content</h2>
            <p>Search by title, description, or tags (min. 2 characters)</p>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter keywords (at least 2 characters)..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                autoFocus
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => {
                setShowSearchDialog(false);
                setSearchQuery('');
                setSearchResults([]);
                setSearchResultsByType({ byTitle: [], byDescription: [], byTags: [] });
              }}>Close</button>
            </div>

            {searchQuery.trim().length > 0 && searchQuery.trim().length < 2 && (
              <div className="search-hint">
                <p>Please enter at least 2 characters to search</p>
              </div>
            )}

            {isSearching && (
              <div className="search-loading">
                <p>Searching...</p>
              </div>
            )}

            {!isSearching && searchQuery && (
              <div className="search-results">
                {searchResultsByType.byTitle.length > 0 && (
                  <div className="search-category">
                    <h3>?? By Title ({searchResultsByType.byTitle.length})</h3>
                    <div className="search-results-grid">
                      {searchResultsByType.byTitle.map((item: any) => (
                        <div key={item.id} className="search-result-item" onClick={() => {
                          window.open(item.url, '_blank');
                        }}>
                          {item.cover_image_url && (
                            <img src={item.cover_image_url} alt={item.title} className="search-result-image" />
                          )}
                          <div className="search-result-content">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            <div className="search-result-meta">
                              <span>{item.platform}</span>
                              {item.author && <span>? {item.author}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResultsByType.byDescription.length > 0 && (
                  <div className="search-category">
                    <h3>?? By Description ({searchResultsByType.byDescription.length})</h3>
                    <div className="search-results-grid">
                      {searchResultsByType.byDescription.map((item: any) => (
                        <div key={item.id} className="search-result-item" onClick={() => {
                          window.open(item.url, '_blank');
                        }}>
                          {item.cover_image_url && (
                            <img src={item.cover_image_url} alt={item.title} className="search-result-image" />
                          )}
                          <div className="search-result-content">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            <div className="search-result-meta">
                              <span>{item.platform}</span>
                              {item.author && <span>? {item.author}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResultsByType.byTags.length > 0 && (
                  <div className="search-category">
                    <h3>??? By Tags ({searchResultsByType.byTags.length})</h3>
                    <div className="search-results-grid">
                      {searchResultsByType.byTags.map((item: any) => (
                        <div key={item.id} className="search-result-item" onClick={() => {
                          window.open(item.url, '_blank');
                        }}>
                          {item.cover_image_url && (
                            <img src={item.cover_image_url} alt={item.title} className="search-result-image" />
                          )}
                          <div className="search-result-content">
                            <h4>{item.title}</h4>
                            {item.description && <p>{item.description}</p>}
                            <div className="search-result-meta">
                              <span>{item.platform}</span>
                              {item.author && <span>? {item.author}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.length === 0 && (
                  <div className="no-results">
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showEditTagDialog && editingTag && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2>Edit Tag</h2>
            <div className="form-group">
              <label>Tag Name</label>
              <input
                type="text"
                placeholder="Tag name..."
                value={editTagName}
                onChange={(e) => setEditTagName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => {
                setShowEditTagDialog(false);
                setEditingTag(null);
                setEditTagName('');
              }}>Cancel</button>
              <button onClick={handleUpdateTag} disabled={!editTagName.trim()}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotesDialog && editingNotes && (
        <NotesDialog
          item={editingNotes}
          notes={notesContent}
          onNotesChange={setNotesContent}
          onSave={handleSaveNotes}
          onCancel={() => {
            setShowNotesDialog(false);
            setEditingNotes(null);
            setNotesContent('');
          }}
        />
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default App;
