import React, { useEffect, useMemo, useState } from 'react';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App
 * A minimal, modern, responsive Notes UI that allows adding, viewing, and deleting notes.
 * Notes are persisted in localStorage for simplicity.
 */
function App() {
  // Theme: light only by default per requirements, but keep toggling support for UX polish.
  const [theme, setTheme] = useState('light');

  // Notes state
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Input state
  const [noteText, setNoteText] = useState('');

  // Persist notes
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch {
      // Ignore storage write failures (e.g., privacy mode)
    }
  }, [notes]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  const handleAddNote = (e) => {
    e.preventDefault();
    const text = noteText.trim();
    if (!text) return;
    const newNote = {
      id: cryptoRandomId(),
      text,
      createdAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteText('');
  };

  // PUBLIC_INTERFACE
  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const isAddDisabled = useMemo(() => noteText.trim().length === 0, [noteText]);

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden="true" />
          <h1 className="brand-title">Notes</h1>
        </div>
        <div className="actions">
          <button
            className="btn ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main className="container">
        <section className="composer">
          <form className="composer-form" onSubmit={handleAddNote}>
            <input
              aria-label="Add a new note"
              className="input"
              placeholder="Write a new note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              maxLength={1000}
            />
            <button
              type="submit"
              className="btn primary"
              disabled={isAddDisabled}
              aria-disabled={isAddDisabled}
              title={isAddDisabled ? 'Enter some text to add a note' : 'Add note'}
            >
              Add
            </button>
          </form>
          <p className="helper">Your notes are saved locally in this browser.</p>
        </section>

        <section className="notes-section">
          {notes.length === 0 ? (
            <div className="empty">
              <div className="empty-graphic" aria-hidden="true">📝</div>
              <p className="empty-title">No notes yet</p>
              <p className="empty-subtitle">Start by writing a note above.</p>
            </div>
          ) : (
            <ul className="notes-grid">
              {notes.map((note) => (
                <li key={note.id} className="note-card">
                  <div className="note-text">{note.text}</div>
                  <div className="note-footer">
                    <time className="note-time" dateTime={new Date(note.createdAt).toISOString()}>
                      {formatTime(note.createdAt)}
                    </time>
                    <button
                      className="btn danger small"
                      onClick={() => handleDeleteNote(note.id)}
                      aria-label="Delete note"
                      title="Delete note"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>Light, modern, and minimal.</span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function formatTime(ts) {
  /** Formats a timestamp to a short, human-readable string. */
  try {
    const d = new Date(ts);
    return d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '';
  }
}

// PUBLIC_INTERFACE
function cryptoRandomId() {
  /** Generates a reasonably unique id for local usage. */
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback if randomUUID is not available
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default App;
