import { useEffect, useState } from "react";
import FeatureCards from "../components/landing/FeatureCards/FeatureCards";
import Testimonials from "../components/landing/Testimonials/Testimonials";
import StartBuilding from "../components/landing/StartBuilding/StartBuilding";
import PlasmaWaveV2 from "../components/landing/PlasmaWave/PlasmaWaveV2";
import Announcement from "../components/common/Misc/Announcement";
import Footer from "../components/landing/Footer/Footer";
import Hero from "../components/landing/Hero/Hero";
import heroImage from "../assets/common/hero.webp";

import { Helmet } from 'react-helmet';
const LandingPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <section className="landing-wrapper">
    <Helmet>
      <title>Landing Page — React Bits</title>
      <meta name="description" content="Highly customizable animated components that make your React projects truly stand out" />
      <link rel="canonical" href="https://reactbits.dev/" />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage", 
            "name": "Landing Page — React Bits",
            "description": "Highly customizable animated components that make your React projects truly stand out",
            "url": "https://reactbits.dev/",
            "inLanguage": "en"
          }, null, 2)
        }}
      />
    </Helmet>
    
      <title>React Bits - Animated UI Components For React</title>

      <Announcement />

      {isMobile && (
        <div className="mobile-hero-background-container">
          <img
            src={heroImage}
            alt="Hero background"
            className="mobile-hero-background-image"
          />
        </div>
      )}

      <PlasmaWaveV2 yOffset={0} xOffset={40} rotationDeg={-45} />

      <Hero />
      <FeatureCards />
      <Testimonials />
      <StartBuilding />
      <Footer />
    </section>
  );
};

export default LandingPage;
