import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`ios-theme-switch ${theme}`} onClick={toggleTheme}>
      <div className="ios-theme-knob">
        <span className="ios-theme-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
      </div>
    </div>
  );
}
