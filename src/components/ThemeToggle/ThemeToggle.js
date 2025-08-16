import { motion } from 'framer-motion';
import useTheme from '../../hooks/useTheme';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.button
      className={`theme-toggle ${theme}`}
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      initial={false}
      animate={theme}
    >
      <motion.div
        className="toggle-handle"
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
      
      <span className="sun" aria-hidden="true">
        ☀️
      </span>
      <span className="moon" aria-hidden="true">
        🌙
      </span>
    </motion.button>
  );
};

export default ThemeToggle;