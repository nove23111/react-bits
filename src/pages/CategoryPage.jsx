import { useEffect, useRef, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { componentMap } from '../constants/Components';
import { decodeLabel } from '../utils/utils';
import { Helmet } from 'react-helmet-async';
import { Box, Skeleton } from '@chakra-ui/react';

import BackToTopButton from '../components/common/BackToTopButton';

// 添加CSS类，防止组件在加载过程中的闪烁
const preventLayoutShift = {
  position: 'relative',
  transform: 'translate3d(0,0,0)',
  backfaceVisibility: 'hidden', 
  transformStyle: 'preserve-3d',
  minHeight: '800px',
  width: '100%'
};

const CategoryPage = () => {
  const { subcategory } = useParams();
  const scrollRef = useRef(null);
  
  // 使用路径作为key，强制组件完全重新创建
  const SubcategoryComponent = subcategory ? lazy(componentMap[subcategory]) : null;

  useEffect(() => {
    // 使用平滑滚动
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [subcategory]);

  return (
    <Box 
      className='category-page' 
      ref={scrollRef}
    >
      <Helmet>
        <title>React Bits - {decodeLabel(subcategory)}</title>
      </Helmet>

      <h2 className='sub-category'>{decodeLabel(subcategory)}</h2>

      {/* 关键：固定高度容器，使布局稳定 */}
      <Box sx={preventLayoutShift}>
        <Suspense 
          fallback={
            <Box 
              position="absolute" 
              top="0" 
              left="0" 
              width="100%" 
              height="100%"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Skeleton 
                height="400px" 
                width="100%" 
                borderRadius="20px" 
                startColor="#111" 
                endColor="#222" 
              />
            </Box>
          }
        >
          {/* 使用路径作为key，强制完全替换组件 */}
          <Box 
            key={subcategory} 
            className="component-wrapper"
            position="absolute"
            top="0"
            left="0"
            width="100%"
          >
            <SubcategoryComponent />
          </Box>
        </Suspense>
      </Box>

      <BackToTopButton />
    </Box>
  );
};

export default CategoryPage;
