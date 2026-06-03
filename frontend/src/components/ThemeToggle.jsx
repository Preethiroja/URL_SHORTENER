import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  // 1. Get initial theme from localStorage or default to your red/black dark theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('flashlink-theme') || 'vamp-dark';
  });

  // 2. Update the HTML attribute whenever the theme state changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('flashlink-theme', theme);
  }, [theme]);

  // 3. Swap between the two explicit color modes
  const handleToggle = () => {
    setTheme((prev) => (prev === 'vamp-dark' ? 'berry-light' : 'vamp-dark'));
  };

  return (
    <button
      onClick={handleToggle}
      className="theme-toggle-btn"
      aria-label="Toggle Theme"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        color: 'var(--primary)',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontWeight: '600',
        fontFamily: 'var(--font-family)',
        transition: 'var(--transition)',
        boxShadow: 'var(--shadow)'
      }}
    >
      {theme === 'vamp-dark' ? (
        <>
          <Sun size={16} />
          <span className="hide-mobile">Light </span>
        </>
      ) : (
        <>
          <Moon size={16} />
          <span className="hide-mobile">Dark</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;