import { useEffect, useRef, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { componentMap } from '../constants/Components';
import { decodeLabel } from '../utils/utils';
import { Box } from '@chakra-ui/react';
import { useTransition } from '../hooks/useTransition';
import BackToTopButton from '../components/common/Misc/BackToTopButton';
import { SkeletonLoader, GetStartedLoader } from '../components/common/Misc/SkeletonLoader';

import { Helmet } from 'react-helmet';
const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const { transitionPhase, getPreloadedComponent } = useTransition();

  const scrollRef = useRef(null);
  const decodedLabel = decodeLabel(subcategory);
  const isLoading = transitionPhase === 'loading';
  const opacity = ['fade-out', 'loading'].includes(transitionPhase) ? 0 : 1;
  const isGetStartedRoute = category === 'get-started';

  const SubcategoryComponent = getPreloadedComponent(subcategory)?.default || (subcategory ? lazy(componentMap[subcategory]) : null);
  const Loader = isGetStartedRoute ? GetStartedLoader : SkeletonLoader;

  useEffect(() => {
    if (scrollRef.current && transitionPhase !== 'fade-out') {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [subcategory, transitionPhase]);

  return (
    <Box className={`category-page ${isLoading ? 'loading' : ''}`} ref={scrollRef}>
    <Helmet>
      <title>Split Text Animation — React Bits</title>
      <meta name="description" content="Highly customizable animated components for React projects such as text animations, 3D, and more" />
      <link rel="canonical" href="https://reactbits.dev/text-animations/split-text" />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage", 
            "name": "Split Text Animation — React Bits",
            "description": "Highly customizable animated components for React projects such as text animations, 3D, and more",
            "url": "https://reactbits.dev/text-animations/split-text",
            "inLanguage": "en",
            "isPartOf": { "@id": "https://reactbits.dev/" }
          }, null, 2)
        }}
      />
    </Helmet>
    
      <title>{`React Bits - ${decodedLabel}`}</title>

      <Box className="page-transition-fade" style={{ opacity }}>
        <h1 className={`sub-category ${isGetStartedRoute ? 'docs-category-title' : ''}`}>{decodedLabel}</h1>

        {isLoading
          ? <Loader />
          : <Suspense fallback={<Loader />}><SubcategoryComponent /></Suspense>
        }
      </Box>
      <BackToTopButton />
    </Box>
  );
};

export default CategoryPage;
