// import img from "next/im g"
// import a from "next/a"
import { ChevronLeft, ChevronRight, Sparkles, Zap, ExternalLink, Globe } from "lucide-react"
// import { Button } from "@/components/ui/button"
import Button from "../components/ui/button"
import { useEffect, useState, useCallback } from "react"

// Hero Banner Carousel Section
const HeroBannerCarousel = ({ banners, current, prev, next, goto }) => {
  return (
    <section className="relative h-[600px] bg-cosmic-gradient overflow-hidden flex flex-col justify-end">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px]"></div>
      {/* Banner image */}
      <img src={banners[current].image} alt={banners[current].title} className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none" />
      {/* Title and description */}
      <div className="absolute bottom-24 left-0 right-0 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cosmic-dark">
          <span className="text-cosmic-accent">{banners[current].title.split(' ')[0]}</span> {banners[current].title.split(' ').slice(1).join(' ')}
        </h1>
        <p className="text-lg text-cosmic-gray max-w-2xl mx-auto text-sm">
          {banners[current].desc}
        </p>
      </div>
      {/* Left and right buttons */}
      <button onClick={prev} className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-cosmic-purple/30 flex items-center justify-center hover:bg-white transition-all shadow-lg">
        <ChevronLeft className="h-6 w-6 text-cosmic-purple" />
      </button>
      <button onClick={next} className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-cosmic-purple/30 flex items-center justify-center hover:bg-white transition-all shadow-lg">
        <ChevronRight className="h-6 w-6 text-cosmic-purple" />
      </button>
      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, i) => (
          <div key={i} onClick={() => goto(i)} className={`w-3 h-3 rounded-full cursor-pointer transition-all ${i === current ? 'bg-cosmic-accent' : 'bg-cosmic-gray/30'}`}></div>
        ))}
      </div>
    </section>
  );
};

// Project Introduction Section
const ProjectIntroduction = ({ banners, current }) => {
  return (
    <section className="bg-cosmic-lightGray py-6 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-cosmic-gray text-sm text-center">
          {banners[current].project.desc}
        </p>
      </div>
    </section>
  );
};

// Spark Granted Projects Section
const SparkGrantedProjects = ({ sparkProjects, sparkPage, setSparkPage, sparkWindows, showSparkSlider, onDappSelect }) => {
  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-cosmic-accent" />
            <h2 className="text-2xl font-bold text-cosmic-dark">Spark Granted Projects</h2>
          </div>
          {showSparkSlider && (
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
                onClick={() => setSparkPage((p) => (p - 1 + sparkWindows.length) % sparkWindows.length)}
              >
                <ChevronLeft className="h-5 w-5 text-cosmic-purple" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
                onClick={() => setSparkPage((p) => (p + 1) % sparkWindows.length)}
              >
                <ChevronRight className="h-5 w-5 text-cosmic-purple" />
              </Button>
            </div>
          )}
        </div>
        <div className="overflow-hidden">
          <div
            className={`flex transition-transform duration-200${showSparkSlider ? '' : ' !transition-none'}`}
            style={{
              width: `${sparkWindows.length * 100}%`,
              transform: `translateX(-${sparkPage * (100 / sparkWindows.length)}%)`
            }}
          >
            {sparkWindows.map((page, pageIdx) => (
              <div
                key={pageIdx}
                className="flex-shrink-0"
                style={{ width: `${100 / sparkWindows.length}%` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {page.map((project, idx) =>
                    project.placeholder ? (
                      <div key={`${pageIdx}-${idx}`} className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-[280px] flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                            <Zap className="h-8 w-8 text-cosmic-purple/70" />
                          </div>
                          <p className="text-cosmic-gray text-sm">{project.name}</p>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={`${pageIdx}-${idx}`}
                        className="block group cursor-pointer"
                        onClick={() => onDappSelect(project.link.replace(/^\//, '').toLowerCase())}
                      >
                        <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 h-[280px] shadow-lg">
                          <div className="h-40 relative bg-gradient-to-br from-purple-600 to-blue-600 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.name + ' Logo'}
                              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity transition-transform duration-300 group-hover:scale-110"
                            />
                            {project.tag && (
                              <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                                  {project.tag}
                                </span>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-xl font-bold text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                              {project.name}
                            </h3>
                            <div className="flex justify-between items-center mt-3">
                              <p className="text-sm text-cosmic-gray text-sm">{project.desc}</p>
                              <p className="text-cosmic-accent font-future">{project.amount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Highlighted Projects Section
const HighlightedProjects = ({ highlightedProjects, onDappSelect }) => {
  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px w-12 bg-cosmic-purple/50"></div>
          <h2 className="text-2xl font-bold text-cosmic-dark">Highlighted Projects</h2>
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
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-6 left-6 flex gap-3">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 md:bg-none"></div>
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
                    <h3 className="text-2xl font-bold text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-cosmic-gray text-sm leading-relaxed">
                    {project.desc}
                  </p>
                  <div className="mt-6 flex justify-end">
                    <div className="inline-flex items-center gap-2 text-cosmic-accent text-sm group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
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
const PremiumProjects = ({ premiumProjects, onDappSelect }) => {
  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px w-12 bg-cosmic-purple/50"></div>
          <h2 className="text-2xl font-bold text-cosmic-dark">Premium Projects</h2>
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
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-white/90 backdrop-blur-sm text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cosmic-dark group-hover:text-cosmic-accent transition-colors mb-3">
                    {project.name}
                  </h3>
                  <p className="text-cosmic-gray text-sm leading-relaxed">
                    {project.desc}
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
const CommunityDrivenProjects = ({ communityProjects, communityPage, setCommunityPage, communityWindows, onDappSelect }) => {
  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#B7AFFF] opacity-60"></div>
            <h2 className="text-2xl font-bold text-cosmic-dark">Community-driven Projects</h2>
            <div className="h-px w-12 bg-[#B7AFFF] opacity-60"></div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
              onClick={() => setCommunityPage((p) => (p - 1 + communityWindows.length) % communityWindows.length)}
            >
              <ChevronLeft className="h-5 w-5 text-cosmic-purple" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full border border-cosmic-purple/50 bg-white hover:bg-cosmic-lightGray"
              onClick={() => setCommunityPage((p) => (p + 1) % communityWindows.length)}
            >
              <ChevronRight className="h-5 w-5 text-cosmic-purple" />
            </Button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-200"
              style={{
                width: `${communityWindows.length * 100}%`,
                transform: `translateX(-${communityPage * (100 / communityWindows.length)}%)`
              }}
            >
              {communityWindows.map((page, pageIdx) => (
                <div
                  key={pageIdx}
                  className="flex-shrink-0"
                  style={{ width: `${100 / communityWindows.length}%` }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {page.map((project, idx) =>
                      project.placeholder ? (
                        <div key={idx} className="bg-cosmic-lightGray/50 rounded-xl border border-dashed border-cosmic-purple/30 h-60 flex items-center justify-center">
                          <div className="text-center p-6">
                            <div className="w-16 h-16 rounded-full bg-cosmic-purple/10 flex items-center justify-center mx-auto mb-4 border border-cosmic-purple/20">
                              <Globe className="h-8 w-8 text-cosmic-purple/70" />
                            </div>
                            <p className="text-cosmic-gray text-sm">{project.name}</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={idx}
                          className="block group cursor-pointer"
                          onClick={() => onDappSelect(project.link.replace(/^\//, '').toLowerCase())}
                        >
                          <div className="bg-white rounded-xl p-6 transition-all duration-300 h-60 shadow-lg">
                            <div className="flex items-start">
                              <div className="h-24 w-28 bg-cosmic-purple/10 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                                <img
                                  src={project.image}
                                  alt={project.name + ' Logo'}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-cosmic-dark group-hover:text-cosmic-accent transition-colors">
                                  {project.name}
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {project.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="bg-cosmic-purple/10 text-cosmic-purple text-xs px-3 py-1 rounded-full font-tech border border-cosmic-purple/30">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-cosmic-gray text-sm mt-4 leading-relaxed">
                              {project.desc}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
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
const CommunityFundDAO = () => {
  return (
    <section className="bg-cosmic-light py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <a href="https://talk.nervos.org/c/ckb-community-fund-dao/65" target="_blank" rel="noopener noreferrer" className="block group">
          <div className="relative bg-cosmic-gradient rounded-xl h-52 overflow-hidden border border-cosmic-purple/20 shadow-lg transition-transform group-hover:scale-[1.02] cursor-pointer">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-30"></div>
            <div className="absolute w-80 h-80 rounded-full bg-cosmic-purple/10 blur-3xl -top-20 -left-20"></div>
            <div className="absolute w-80 h-80 rounded-full bg-cosmic-neonBlue/5 blur-3xl -bottom-20 -right-20"></div>
            <div className="absolute w-60 h-60 rounded-full border border-cosmic-purple/20 top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow"></div>
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-4xl md:text-5xl font-bold text-cosmic-dark mb-4">
                  Community <span className="text-cosmic-accent">Fund</span> DAO
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
  const [sections, setSections] = useState({
    sparkGranted: [],
    highlighted: [],
    premium: [],
    community: [],
    banners: []
  });
  const [loading, setLoading] = useState(true);
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
  const prev = () => setCurrent((current - 1 + banners.length) % banners.length);
  const next = useCallback(() => setCurrent((current + 1) % banners.length), [current, banners.length]);
  const goto = (i) => setCurrent(i);

  // Add auto-play timer for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000); // Auto-play every 5 seconds
    return () => clearInterval(interval);
  }, [current, next]); // Depend on current and next to reset timer when current changes

  // Spark Granted Projects sliding window pagination
  const [sparkPage, setSparkPage] = useState(0);
  const sparkProjects = sections.sparkGranted;
  const sparkWindowSize = 3;
  const sparkWindowPages = sparkProjects.length <= sparkWindowSize ? 1 : sparkProjects.length - sparkWindowSize + 1;
  const sparkWindows = [];
  for (let i = 0; i < sparkWindowPages; i++) {
    let windowItems = sparkProjects.slice(i, i + sparkWindowSize);
    if (windowItems.length < sparkWindowSize) {
      windowItems = windowItems.concat(Array(sparkWindowSize - windowItems.length).fill({ placeholder: true }));
    }
    sparkWindows.push(windowItems);
  }
  const showSparkSlider = sparkProjects.length > sparkWindowSize;

  // Highlighted Projects data
  const highlightedProjects = sections.highlighted;

  // Premium Projects data
  const premiumProjects = sections.premium;

  // Community-driven Projects data
  const communityProjects = sections.community;
  const communityPerPage = 3;
  const [communityPage, setCommunityPage] = useState(0);
  const communityMaxPage = Math.ceil(communityProjects.length / communityPerPage);
  const communityPrev = () => setCommunityPage((p) => (p - 1 + communityMaxPage) % communityMaxPage);
  const communityNext = () => setCommunityPage((p) => (p + 1) % communityMaxPage);

  // 1. Generate windowed pagination data
  const total = communityProjects.length;
  const windowSize = 3;
  const windowPages = total <= windowSize ? 1 : total - windowSize + 1;
  const communityWindows = [];
  for (let i = 0; i < windowPages; i++) {
    let windowItems = communityProjects.slice(i, i + windowSize);
    // If the last page has less than 3 items, pad left with empty slots
    if (windowItems.length < windowSize) {
      windowItems = Array(windowSize - windowItems.length).fill({ placeholder: true }).concat(windowItems);
    }
    communityWindows.push(windowItems);
  }

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="cosmic-inscription min-h-screen bg-cosmic-light text-cosmic-dark overflow-hidden">
      {/* Main Content */}
      <div className="w-full">
        <HeroBannerCarousel banners={banners} current={current} prev={prev} next={next} goto={goto} />
        <ProjectIntroduction banners={banners} current={current} />
        <SparkGrantedProjects sparkProjects={sparkProjects} sparkPage={sparkPage} setSparkPage={setSparkPage} sparkWindows={sparkWindows} showSparkSlider={showSparkSlider} onDappSelect={onDappSelect} />
        <HighlightedProjects highlightedProjects={highlightedProjects} onDappSelect={onDappSelect} />
        <PremiumProjects premiumProjects={premiumProjects} onDappSelect={onDappSelect} />
        <CommunityDrivenProjects communityProjects={communityProjects} communityPage={communityPage} setCommunityPage={setCommunityPage} communityWindows={communityWindows} onDappSelect={onDappSelect} />
        <CommunityFundDAO />
      </div>
    </div>
  );
}
  