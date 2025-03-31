import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { SearchProvider } from './components/context/SearchContext/SearchContext';
import { useEffect, useState } from 'react';
import { Toaster } from 'sonner'
import { forceChakraDarkTheme } from './utils/utils';
import { toastStyles } from './utils/customTheme';

import Header from './components/navs/Header';
import Sidebar from './components/navs/Sidebar';
import VideoExportDecorator from './components/VideoExportDecorator';

import LandingPage from './pages/LandingPage'
import CategoryPage from './pages/CategoryPage'
import ShowcasePage from './pages/ShowcasePage';

// 添加一个布局包装器组件来防止页面抖动
const StableLayoutWrapper = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  
  // 组件挂载后，标记为准备好，允许过渡动画
  useEffect(() => {
    // 给浏览器一点时间来计算布局
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <main 
      className='app-container'
      style={{
        opacity: isReady ? 1 : 0.95,
        transition: 'opacity 0.3s ease',
      }}
    >
      {children}
    </main>
  );
};

export default function App() {
  useEffect(() => {
    forceChakraDarkTheme();
  }, []);

  return (
    <Router>
      <VideoExportDecorator />
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route exact path="/showcase" element={<ShowcasePage />} />
        <Route path="/:category/:subcategory" element={
          <SearchProvider>
            <StableLayoutWrapper>
              <Header />
              <section className='category-wrapper'>
                <Sidebar />
                <CategoryPage />
              </section>
              <Toaster
                toastOptions={toastStyles}
                position='bottom-right'
                visibleToasts={1}
              />
            </StableLayoutWrapper>
          </SearchProvider>
        } />
      </Routes>
    </Router>
  )
}