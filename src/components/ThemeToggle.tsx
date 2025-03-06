import { useEffect } from 'react';
import { themeStore } from './utils/AppStores';
import { Button } from 'antd';

const ThemeToggle = () => {
  const ThemeStore = themeStore();
  
  // Update the theme on initial render and when it changes
  useEffect(() => {
    if (ThemeStore.dark) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }, [ThemeStore.dark]);  // Re-run when theme changes
  
  const handleClick = () => {
    ThemeStore.toggleTheme();
  };

  return <Button onClick={handleClick}>🌗</Button>;
};

export default ThemeToggle;
