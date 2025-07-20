import { isLocalStorageAvailable } from './browserUtils';

export const getLanguage = (key) => {
  const languages = {
    code: 'jsx',
    usage: 'jsx',
    tailwind: 'jsx',
    presets: 'jsx',
    utility: 'jsx',
    installation: 'bash',
    css: 'css',
  };

  return languages[key];
};

const formatNumber = (num) => {
  if (num < 1000) return num.toString();

  const rounded = Math.ceil(num / 100) * 100;
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(rounded);
};

export const getStarsCount = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/DavidHDev/react-bits');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return String(formatNumber(data.stargazers_count)).toUpperCase();
  } catch (error) {
    throw new Error('Error fetching stargazers count:', error);
  }
};

export const decodeLabel = (label) => label
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');

export const forceChakraDarkTheme = () => {
  const hasStorage = isLocalStorageAvailable();

  if (!hasStorage) return;

  localStorage.setItem('chakra-ui-color-mode', 'dark');
};

export const randomHex = () => `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;

export const generateCliCommands = (path, variants = ['default', 'tailwind', 'ts/default', 'ts/tailwind']) => {
  const [category, component] = path.split('/');

  return Object.fromEntries(
    variants.map(variant => {
      const formattedKey = `cli${variant
        .split('/')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('')}`;

      return [formattedKey, `npx jsrepo add https://reactbits.dev/${variant}/${category}/${component}`];
    })
  );
};