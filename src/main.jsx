import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

import { HelmetProvider } from 'react-helmet-async';

import { ChakraProvider } from '@chakra-ui/react'
import { customTheme } from './utils/customTheme.js';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

// 防止初始化闪烁
document.documentElement.classList.add('loading');

ReactDOM.createRoot(document.createElement('div')).render(
  // eslint-disable-next-line react/no-children-prop
  <SyntaxHighlighter language="" children={''} />
)

// 创建根组件并渲染
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={customTheme}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ChakraProvider>,
);

// 移除loading类，允许过渡动画
window.addEventListener('load', () => {
  // 延迟移除，确保所有内容都已加载
  setTimeout(() => {
    document.documentElement.classList.remove('loading');
  }, 100);
});
