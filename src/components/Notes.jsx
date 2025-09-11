import React, { useState, useEffect } from 'react';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    filterNotes();
  }, [notes, searchTerm]);

  // Filter notes based on search term
  const filterNotes = () => {
    if (!searchTerm) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  // Add a new note
  const addNote = () => {
    if (title.trim() !== '') {
      const newNote = {
        id: Date.now(),
        title,
        content,
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNotes([...notes, newNote]);
      resetForm();
    }
  };

  // Update an existing note
  const updateNote = () => {
    if (title.trim() !== '' && selectedNote) {
      const updatedNotes = notes.map(note => 
        note.id === selectedNote.id 
          ? {...note, title, content, category, updatedAt: new Date().toISOString()}
          : note
      );
      
      setNotes(updatedNotes);
      resetForm();
    }
  };

  // Delete a note
  const deleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
      if (selectedNote && selectedNote.id === id) {
        resetForm();
      }
    }
  };

  // Select a note for viewing/editing
  const selectNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setIsEditing(true);
  };

  // Reset the form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('personal');
    setSelectedNote(null);
    setIsEditing(false);
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // Get category color
  const getCategoryColor = (cat) => {
    const colors = {
      personal: '#45b7d1',
      work: '#6c5ce7',
      ideas: '#e84393',
      tasks: '#00b894'
    };
    return colors[cat] || '#45b7d1';
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        color: '#333'
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
        }}
      >
        <h1
          style={{
            color: '#2d3436',
            margin: '0',
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6c5ce7 0%, #45b7d1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Advanced Notes
        </h1>
        
        <div style={{ position: 'relative', width: '40%' }}>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px 12px 40px',
              border: '1px solid #ddd',
              borderRadius: '50px',
              fontSize: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#aaa'
            }}
          >
            🔍
          </span>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '30px' }}>
        {/* Notes Grid */}
        <div style={{ flex: '2' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px',
            }}
          >
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => selectNote(note)}
                  style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                    borderLeft: `4px solid ${getCategoryColor(note.category)}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    height: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3
                        style={{
                          margin: '0 0 10px 0',
                          color: '#2d3436',
                          fontSize: '1.2rem',
                          fontWeight: '600'
                        }}
                      >
                        {note.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '4px 8px',
                          borderRadius: '20px',
                          backgroundColor: `${getCategoryColor(note.category)}20`,
                          color: getCategoryColor(note.category),
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}
                      >
                        {note.category}
                      </span>
                    </div>
                    <p
                      style={{
                        color: '#666',
                        margin: '0 0 15px 0',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: '3',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {note.content}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#999',
                      }}
                    >
                      {formatDate(note.updatedAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#e74c3c',
                        border: 'none',
                        padding: '5px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px',
                backgroundColor: '#fff',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📝</div>
                <h3 style={{ color: '#636e72', margin: '0 0 10px 0' }}>No notes found</h3>
                <p style={{ color: '#aaa', margin: '0' }}>
                  {searchTerm ? 'Try a different search term' : 'Create your first note to get started'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Note Form */}
        <div style={{ flex: '1' }}>
          <div
            style={{
              backgroundColor: '#fff',
              padding: '25px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
              position: 'sticky',
              top: '20px'
            }}
          >
            <h3
              style={{
                margin: '0 0 20px 0',
                color: '#2d3436',
                fontSize: '1.5rem',
                fontWeight: '600'
              }}
            >
              {isEditing ? 'Edit Note' : 'Add New Note'}
            </h3>
            <div
              style={{
                marginBottom: '20px',
              }}
            >
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Note title"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '15px',
                  boxSizing: 'border-box'
                }}
              />
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  marginBottom: '15px',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="ideas">Ideas</option>
                <option value="tasks">Tasks</option>
              </select>
              
              <textarea
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder="Note content"
                rows="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={isEditing ? updateNote : addNote}
                style={{
                  flex: '1',
                  backgroundColor: '#6c5ce7',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5c4fc7'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c5ce7'}
              >
                {isEditing ? 'Update Note' : 'Add Note'}
              </button>
              
              {isEditing && (
                <button
                  onClick={resetForm}
                  style={{
                    backgroundColor: '#dfe6e9',
                    color: '#636e72',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d1d8dc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dfe6e9'}
                >
                  Cancel
                </button>
              )}
            </div>
            
            {notes.length > 0 && (
              <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#636e72' }}>
                  <strong>Total notes:</strong> {notes.length}
                  {searchTerm && ` (${filteredNotes.length} match${filteredNotes.length !== 1 ? 'es' : ''} found)`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;