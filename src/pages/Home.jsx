// import img from "next/im g"
// import a from "next/a"
import { ChevronLeft, ChevronRight, Sparkles, Zap, ExternalLink, Globe } from "lucide-react"
// import { Button } from "@/components/ui/button"
import Button from "../components/ui/button"
import { useEffect, useState, useCallback, useRef } from "react"
import { useSelector } from 'react-redux'
import { getLocalizedText } from "../utils/i18n"
import { useTranslation } from 'react-i18next'

// Hero Banner Carousel Section
const HeroBannerCarousel = ({ banners, current, next, fadeStage, triggerFade, onDappSelect, setIsHovered, isHovered }) => {
  return (
    <section
      className="relative aspect-[16/7] max-h-[900px] min-h-[180px] bg-cosmic-gradient overflow-hidden flex flex-col justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px]"></div>
      {/* Banner images with true cross-fade transition */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Always render both images, but control their visibility with opacity */}
        <img
          key={`current-${current}`}
          src={banners[current].image}
          alt={banners[current].title}
          className="absolute inset-0 w-full h-full object-cover select-none cursor-pointer transition-all duration-700 ease-in-out"
          style={{
            zIndex: fadeStage === 'fading' ? 1 : 2,
            opacity: fadeStage === 'fading' ? 0 : 1,
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            pointerEvents: fadeStage === 'fading' ? 'none' : 'auto',
          }}
          onClick={() => {
            if (banners[current].dappId && onDappSelect) {
              onDappSelect(banners[current].dappId);
            }
          }}
        />
        {next !== null && (
          <img
            key={`next-${next}`}
            src={banners[next].image}
            alt={banners[next].title}
            className="absolute inset-0 w-full h-full object-cover select-none cursor-pointer transition-all duration-700 ease-in-out"
            style={{
              zIndex: fadeStage === 'fading' ? 2 : 1,
              opacity: fadeStage === 'fading' ? 1 : 0,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              pointerEvents: fadeStage === 'fading' ? 'auto' : 'none',
            }}
            onClick={() => {
              if (banners[next].dappId && onDappSelect) {
                onDappSelect(banners[next].dappId);
              }
            }}
          />
        )}
      </div>
      {/* Pagination and progress dots always on top (z-10) */}
      <button 
        onClick={() => triggerFade('prev')} 
        className="absolute left-0 top-0 h-full w-16 z-10 flex items-center justify-center group transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/10 group-hover:from-white/60 group-hover:to-white/20 transition-all duration-300"></div>
        <ChevronLeft className="h-8 w-8 text-cosmic-dark relative z-10" />
      </button>
      <button 
        onClick={() => triggerFade('next')} 
        className="absolute right-0 top-0 h-full w-16 z-10 flex items-center justify-center group transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-white/40 to-white/10 group-hover:from-white/60 group-hover:to-white/20 transition-all duration-300"></div>
        <ChevronRight className="h-8 w-8 text-cosmic-dark relative z-10" />
      </button>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {banners.map((_, i) => {
          // Determine dot state for animation
          let isLoaded = false;
          if ((fadeStage === 'fading' || fadeStage === 'prepare') && next !== null) {
            if (i === current && fadeStage === 'prepare') isLoaded = true;
            else if (i === next && fadeStage === 'fading') isLoaded = true;
          } else if (i === current) {
            isLoaded = true;
          }
          return (
            <div
              key={i}
              onClick={() => triggerFade(i)}
              className={
                `w-5 h-5 rounded-full cursor-pointer transition-all duration-500`
              }
              style={{
                boxSizing: 'border-box',
                transition: 'all 0.5s cubic-bezier(.4,2,.6,1)',
                background: isLoaded
                  ? 'linear-gradient(to bottom right, #4ade80, #22d3ee)'
                  : '#fff',
                border: isLoaded ? '2px solid #fff' : '1px solid #d1d5db',
                boxShadow: isLoaded ? '0 2px 8px 0 rgba(34,211,238,0.3)' : 'none',
                transform: isLoaded ? 'scale(1.25)' : 'scale(1)',
              }}
            ></div>
          );
        })}
      </div>
    </section>
  );
};

const DOT_COUNT = 50;
const DOT_VERTICAL_MARGIN = 50; // px

// Project Introduction Section
const ProjectIntroduction = ({ banners, current, language }) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(300);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Initialize dots with random properties, including hue for color animation
  const [dots, setDots] = useState(() =>
    Array.from({ length: DOT_COUNT }).map(() => ({
      left: Math.random() * 100, // percent
      bottom: DOT_VERTICAL_MARGIN + Math.random() * Math.max(0, 300 - 2 * DOT_VERTICAL_MARGIN),
      size: 8 + Math.random() * 16, // px
      opacity: 0.4 + Math.random() * 0.5,
      dx: (Math.random() - 0.5) * 0.04, // quadrupled horizontal speed
      dy: (Math.random() - 0.5) * 0.25, // quadrupled vertical speed
      hue: 200 + Math.random() * 80, // initial hue (blue to purple)
      dhue: 0.2 + Math.random() * 0.2, // hue change rate
    }))
  );

  // Animate dots movement and color
  useEffect(() => {
    let animationId;
    let lastTime = performance.now();
    const FRAME_DURATION = 1000 / 60; // 60fps

    function animate(currentTime) {
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= FRAME_DURATION) {
        setDots(prev =>
          prev.map(dot => {
            let newLeft = dot.left + dot.dx;
            let newBottom = dot.bottom + dot.dy;
            let dx = dot.dx;
            let dy = dot.dy;
            // Bounce on horizontal edges
            if (newLeft < 0 || newLeft > 100) {
              dx = -dx;
              newLeft = Math.max(0, Math.min(100, newLeft));
            }
            // Bounce on vertical edges，留出上下 margin
            if (newBottom < DOT_VERTICAL_MARGIN || newBottom > containerHeight - DOT_VERTICAL_MARGIN) {
              dy = -dy;
              newBottom = Math.max(DOT_VERTICAL_MARGIN, Math.min(containerHeight - DOT_VERTICAL_MARGIN, newBottom));
            }
            // Animate hue (color)
            let newHue = dot.hue + dot.dhue;
            if (newHue > 280) newHue = 200; // loop in blue-purple range
            return {
              ...dot,
              left: newLeft,
              bottom: newBottom,
              dx,
              dy,
              hue: newHue,
            };
          })
        );
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    }
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [containerHeight]);

  return (
    <section ref={containerRef} className="relative bg-cosmic-lightGray py-6 px-6 overflow-hidden">
      {/* Bottom light blue bar with animated decorative dots */}
      <div className="absolute left-0 right-0 bottom-0 top-0 h-full pointer-events-none z-0">
        {/* Animated decorative dots with color gradient */}
        {dots.map((dot, i) => (
          <div
            key={i}
            className="rounded-full pointer-events-none"
            style={{
              position: 'absolute',
              left: `${dot.left}%`,
              bottom: `${dot.bottom}px`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              opacity: dot.opacity,
              zIndex: 1,
              background: `hsl(${dot.hue}, 80%, 80%)`,
              transition: 'background-color 0.3s ease-in-out', // faster color transition
            }}
          ></div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span
            className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(80,200,255,0.5)]"
            style={{
              WebkitTextStroke: '2px rgba(255,255,255,0.85)',
              textShadow: '0 4px 12px rgba(0,0,0,0.45)'
            }}
          >
            {banners[current].title}
          </span>
        </h1>
        <div
          style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.75)',
            borderRadius: '1rem',
            padding: '0.75rem 1.5rem',
            boxShadow: '0 2px 6px 0 rgba(80,200,255,0.10)',
            backdropFilter: 'blur(2px)',
            margin: '0 auto'
          }}
        >
          <p
            className="text-cosmic-gray text-l text-center"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.10)',
              margin: 0
            }}
          >
            {getLocalizedText(banners[current].project.desc, language)}
          </p>
        </div>
      </div>
    </section>
  );
};

// Spark Granted Projects Section
const SparkGrantedProjects = ({ sparkProjects, sparkPage, setSparkPage, windowSize, maxPage, onDappSelect, language }) => {
  const [t] = useTranslation();
  const [currentWindowSize, setCurrentWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return windowSize.mobile;
      if (window.innerWidth < 1024) return windowSize.tablet;
      return windowSize.desktop;
    }
    return windowSize.desktop;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCurrentWindowSize(windowSize.mobile);
      else if (window.innerWidth < 1024) setCurrentWindowSize(windowSize.tablet);
      else setCurrentWindowSize(windowSize.desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowSize]);

  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-cosmic-accent" />
            <h2 className="text-2xl font-bold text-cosmic-dark">{t('home.sections.spark-granted')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              className="w-10 h-10 rounded-full bg-white hover:bg-cosmic-lightGray shadow"
              onClick={() => setSparkPage((p) => Math.max(0, p - 1))}
              disabled={sparkPage === 0}
            >
              <ChevronLeft className="h-5 w-5 text-cosmic-purple" />
            </Button>
            <Button
              size="icon"
              className="w-10 h-10 rounded-full bg-white hover:bg-cosmic-lightGray shadow"
              onClick={() => setSparkPage((p) => Math.min(maxPage, p + 1))}
              disabled={sparkPage === maxPage}
            >
              <ChevronRight className="h-5 w-5 text-cosmic-purple" />
            </Button>
            <a
              href="https://discord.com/channels/657799690070523914/1364236242190995558/threads/1365948819728105503"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center px-4 h-12 rounded-full bg-gradient-to-br from-[#4ade80] via-[#22d3ee] to-[#a78bfa] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none text-white font-semibold text-base"
              style={{ boxShadow: '0 0 16px 2px #22d3ee55, 0 2px 8px 0 #a78bfa33', minWidth: '120px' }}
            >
              <svg className="w-6 h-6 mr-2 animate-pulse group-hover:animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
              </svg>
              {t('home.buttons.discord')}
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden" style={{ margin: '-8px', padding: '8px' }}>
            <div
              className="flex transition-transform duration-200"
              style={{
                width: "100%",
                transform: `translateX(-${sparkPage * (100 / currentWindowSize)}%)`
              }}
            >
              {sparkProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
                  style={{ padding: '8px' }}
                >
                  {project.placeholder ? (
                    <div className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-[280px] flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                          <Zap className="h-8 w-8 text-cosmic-purple/70" />
                        </div>
                        <p className="text-cosmic-gray text-sm">{project.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="block group cursor-pointer"
                      onClick={() => onDappSelect(project.link.replace(/^\//, '').toLowerCase())}
                    >
                      <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 h-[280px] shadow-lg">
                        <div className="h-40 relative bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.name + ' Logo'}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <h3
                            className="text-xl font-bold text-cosmic-dark"
                            style={{ position: 'relative', zIndex: 2 }}
                            data-text={project.name}
                          >
                            {project.name}
                          </h3>
                          <div className="flex justify-between items-start mt-3 gap-2">
                            <p className="text-sm text-cosmic-gray flex-grow">{getLocalizedText(project.desc, language)}</p>
                            {project.amount && (
                              <div className="flex-shrink-0 text-left font-future text-cosmic-accent">
                                <span className="block">{project.amount.split(' ')[0]}</span>
                                <span className="block">{project.amount.split(' ')[1]}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Highlighted Projects Section
const HighlightedProjects = ({ highlightedProjects, onDappSelect, language }) => {
  const [t] = useTranslation();
  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px w-12 bg-cosmic-purple/50"></div>
          <h2 className="text-2xl font-bold text-cosmic-dark">{t('home.sections.highlighted')}</h2>
          <div className="h-px w-24 bg-[#B7AFFF] opacity-60"></div>
        </div>
        <div className="space-y-16">
          {highlightedProjects.map((project, idx) => (
            <div
              key={idx}
              className="block group cursor-pointer"
              onClick={() => onDappSelect(project.link.replace(/^\//, '').toLowerCase())}
            >
              <div className={
                idx % 2 === 1
                  ? 'grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-6 bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-lg md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1'
                  : 'grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-lg'
              }>
                <div className="h-[520px] relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name + ' Logo'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-20 w-20 rounded-lg bg-cosmic-purple/10 flex items-center justify-center overflow-hidden mr-4">
                      <img
                        src={project.tinyImage}
                        alt={project.name + ' Logo'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3
                      className="text-2xl font-bold text-cosmic-dark"
                      style={{ position: 'relative', zIndex: 2 }}
                      data-text={project.name}
                    >
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-cosmic-gray text-sm leading-relaxed">
                    {getLocalizedText(project.desc, language)}
                  </p>
                  <div className="mt-6 flex justify-end">
                    <div className="inline-flex items-center gap-2 text-cosmic-accent text-sm group-hover:translate-x-1 transition-transform">
                      <span>{t('home.buttons.explore')}</span>
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Premium Projects Section
const PremiumProjects = ({ premiumProjects, onDappSelect, language }) => {
  const [t] = useTranslation();
  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px w-12 bg-cosmic-purple/50"></div>
          <h2 className="text-2xl font-bold text-cosmic-dark">{t('home.sections.premium')}</h2>
          <div className="h-px w-24 bg-[#B7AFFF] opacity-60"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumProjects.map((project, idx) => (
            <div
              key={idx}
              className="block group cursor-pointer"
              onClick={() => onDappSelect(project.link.replace(/^\//, '').toLowerCase())}
            >
              <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 h-full shadow-lg">
                <div className="h-48 relative">
                  <img
                    src={project.image}
                    alt={project.name + ' Logo'}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3
                    className="text-xl font-bold text-cosmic-dark mb-3"
                    style={{ position: 'relative', zIndex: 2 }}
                    data-text={project.name}
                  >
                    {project.name}
                  </h3>
                  <p className="text-cosmic-gray text-sm leading-relaxed">
                    {getLocalizedText(project.desc, language)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Community-driven Projects Section
const CommunityDrivenProjects = ({ communityProjects, communityPage, setCommunityPage, windowSize, maxPage, onDappSelect, language }) => {
  const [t] = useTranslation();
  const [currentWindowSize, setCurrentWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return windowSize.mobile;
      if (window.innerWidth < 1024) return windowSize.tablet;
      return windowSize.desktop;
    }
    return windowSize.desktop;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCurrentWindowSize(windowSize.mobile);
      else if (window.innerWidth < 1024) setCurrentWindowSize(windowSize.tablet);
      else setCurrentWindowSize(windowSize.desktop);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowSize]);

  return (
    <section className="bg-cosmic-light pt-8 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#B7AFFF] opacity-60"></div>
            <h2 className="text-2xl font-bold text-cosmic-dark">{t('home.sections.community')}</h2>
            <div className="h-px w-12 bg-[#B7AFFF] opacity-60"></div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              className="w-10 h-10 rounded-full bg-white hover:bg-cosmic-lightGray shadow"
              onClick={() => setCommunityPage((p) => Math.max(0, p - 1))}
              disabled={communityPage === 0}
            >
              <ChevronLeft className="h-5 w-5 text-cosmic-purple" />
            </Button>
            <Button
              size="icon"
              className="w-10 h-10 rounded-full bg-white hover:bg-cosmic-lightGray shadow"
              onClick={() => setCommunityPage((p) => Math.min(maxPage, p + 1))}
              disabled={communityPage === maxPage}
            >
              <ChevronRight className="h-5 w-5 text-cosmic-purple" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden" style={{ margin: '-8px', padding: '8px' }}>
            <div
              className="flex transition-transform duration-200"
              style={{
                width: "100%",
                transform: `translateX(-${communityPage * (100 / currentWindowSize)}%)`
              }}
            >
              {communityProjects.map((project, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3"
                  style={{ padding: '8px' }}
                >
                  {project.placeholder ? (
                    <div className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-60 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                          <Globe className="h-8 w-8 text-cosmic-purple/70" />
                        </div>
                        <p className="text-cosmic-gray text-sm">{project.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="block group cursor-pointer"
                      onClick={() => onDappSelect(project.link.replace(/^\//, '').toLowerCase())}
                    >
                      <div className="bg-white rounded-xl p-6 transition-all duration-300 min-h-60 shadow-lg">
                        <div className="flex items-start h-24">
                          <div className="h-24 w-28 bg-cosmic-purple/10 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.name + ' Logo'}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-col justify-center h-24 ml-4 pt-6 pl-2">
                            <h3
                              className="text-xl font-bold text-cosmic-dark mb-2"
                              style={{ position: 'relative', zIndex: 2 }}
                              data-text={project.name}
                            >
                              {project.name}
                            </h3>
                          </div>
                        </div>
                        <p className="text-cosmic-gray text-sm mt-2 leading-relaxed pt-4">
                          {getLocalizedText(project.desc, language)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Community Fund DAO Section
const CommunityFundDAO = ({ language }) => {
  return (
    <section className="bg-cosmic-light pt-2 pb-28 px-6">
      <div className="max-w-6xl mx-auto">
        <a href="https://talk.nervos.org/c/ckb-community-fund-dao/65" target="_blank" rel="noopener noreferrer" className="block group">
          <div
            className="relative bg-cosmic-gradient rounded-xl h-52 overflow-hidden border border-cosmic-purple/20 shadow-lg transition-transform group-hover:scale-[1.04] cursor-pointer"
            style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-30"></div>
            <div className="absolute w-80 h-80 rounded-full bg-cosmic-purple/10 blur-3xl -top-20 -left-20"></div>
            <div className="absolute w-80 h-80 rounded-full bg-cosmic-neonBlue/5 blur-3xl -bottom-20 -right-20"></div>
            <div className="absolute w-60 h-60 rounded-full border border-cosmic-purple/20 top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-cosmic-dark mb-4">
                  Community <span className="text-fund-dao">Fund</span> DAO
                </h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-cosmic-purple/50"></div>
                  <p className="text-cosmic-gray text-sm">Empowering the CKB ecosystem</p>
                  <div className="h-px w-12 bg-cosmic-purple/50"></div>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default function Home({ onDappSelect }) {
  const language = useSelector(state => state.langReducer.language);
  const [sections, setSections] = useState({
    sparkGranted: [],
    highlighted: [],
    premium: [],
    community: [],
    banners: []
  });
  const [loading, setLoading] = useState(true);
  const [currentWindowSize, setCurrentWindowSize] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    }
    return 3;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCurrentWindowSize(1);
      else if (window.innerWidth < 1024) setCurrentWindowSize(2);
      else setCurrentWindowSize(3);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.classList.add("cosmic-inscription");
    fetch("/homeSections.json")
      .then(res => res.json())
      .then(data => {
        setSections(data);
        setLoading(false);
      });
    return () => {
      document.body.classList.remove("cosmic-inscription");
    };
  }, []);

  // Carousel data
  const banners = sections.banners;
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(null);
  const [fadeStage, setFadeStage] = useState('idle'); // 'idle' | 'prepare' | 'fading'
  const [isHovered, setIsHovered] = useState(false);

  // Cross-fade trigger for both auto and manual
  const triggerFade = useCallback((iOrDir) => {
    if (fadeStage === 'fading' || fadeStage === 'prepare') return;
    let target = 0;
    if (iOrDir === 'prev') {
      target = (current - 1 + banners.length) % banners.length;
    } else if (iOrDir === 'next') {
      target = (current + 1) % banners.length;
    } else {
      target = iOrDir;
    }
    if (target === current) return;
    setNext(target);
    setFadeStage('prepare');
  }, [current, banners.length, fadeStage]);

  // Fade stage effect: prepare -> fading -> idle
  useEffect(() => {
    if (fadeStage === 'prepare') {
      const id = setTimeout(() => setFadeStage('fading'), 50); // Slightly longer delay
      return () => clearTimeout(id);
    }
    if (fadeStage === 'fading') {
      const id = setTimeout(() => {
        setCurrent(next);
        setNext(null);
        setFadeStage('idle');
      }, 700); // Match the transition duration
      return () => clearTimeout(id);
    }
  }, [fadeStage, next]);

  // Auto-play timer for carousel, pause on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      triggerFade('next');
    }, 15000);
    return () => clearInterval(interval);
  }, [triggerFade, isHovered]);

  // For title/desc: always show the one matching the visible banner (immediate switch)
  const displayIdx = (fadeStage === 'fading' || fadeStage === 'prepare') && next !== null ? next : current;

  // Spark Granted Projects sliding window pagination
  const [sparkPage, setSparkPage] = useState(0);
  const sparkProjects = sections.sparkGranted;
  const sparkWindowSize = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };
  const sparkMaxPage = sparkProjects.length > currentWindowSize ? sparkProjects.length - currentWindowSize : 0;

  // Highlighted Projects data
  const highlightedProjects = sections.highlighted;

  // Premium Projects data
  const premiumProjects = sections.premium;

  // Community-driven Projects data
  const communityProjects = sections.community;
  const [communityPage, setCommunityPage] = useState(0);
  const windowSize = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };
  const total = communityProjects.length;
  const maxPage = total > currentWindowSize ? total - currentWindowSize : 0;

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="cosmic-inscription min-h-screen bg-cosmic-light text-cosmic-dark overflow-hidden">
      {/* Main Content */}
      <div className="w-full">
        <HeroBannerCarousel banners={banners} current={current} next={next} fadeStage={fadeStage} triggerFade={triggerFade} onDappSelect={onDappSelect} setIsHovered={setIsHovered} isHovered={isHovered} />
        <ProjectIntroduction banners={banners} current={displayIdx} language={language} />
          <SparkGrantedProjects 
            sparkProjects={sparkProjects} 
            sparkPage={sparkPage} 
            setSparkPage={setSparkPage} 
            windowSize={sparkWindowSize}
            maxPage={sparkMaxPage}
            onDappSelect={onDappSelect}
            language={language}
          />
          <HighlightedProjects highlightedProjects={highlightedProjects} onDappSelect={onDappSelect} language={language} />
          <PremiumProjects premiumProjects={premiumProjects} onDappSelect={onDappSelect} language={language} />
          <CommunityDrivenProjects 
            communityProjects={communityProjects} 
            communityPage={communityPage} 
            setCommunityPage={setCommunityPage} 
            windowSize={windowSize}
            maxPage={maxPage}
            onDappSelect={onDappSelect}
            language={language}
          />
        <CommunityFundDAO language={language} />
      </div>
    </div>
  );
}
