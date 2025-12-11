import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', label: 'Sáng', icon: '☀️' },
    { value: 'dark', label: 'Tối', icon: '🌙' },
    { value: 'system', label: 'Máy', icon: '💻' }
  ];

  return (
    <div className="theme-toggle-container">
      <div className="theme-toggle">
        {themes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTheme(t.value)}
            className={`theme-toggle-btn ${theme === t.value ? 'active' : ''}`}
            title={t.label}
          >
            <span className="theme-icon">{t.icon}</span>
            <span className="theme-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeToggle;
