import { ArrowLeft, ExternalLink, Zap, Info } from "lucide-react";
import { FaReddit, FaDiscord, FaTelegramPlane, FaTwitter, FaGithub, FaYoutube, FaMedium, FaQuestionCircle, FaLightbulb } from "react-icons/fa";
import Button from "../components/ui/button";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { getLocalizedText } from "../utils/i18n";
import { useTranslation } from 'react-i18next';
import imagePreloader from "../utils/imagePreloader";

// highlight color configuration, up to 6
const highlightsColors = [
  {
    from: "from-amber-50", to: "to-orange-50", border: "border-amber-200", hover: "hover:border-amber-300", text: "text-amber-700", icon: "text-amber-600", iconHover: "hover:text-amber-700 hover:bg-amber-100"
  },
  {
    from: "from-blue-50", to: "to-purple-50", border: "border-blue-200", hover: "hover:border-blue-300", text: "text-blue-700", icon: "text-blue-600", iconHover: "hover:text-blue-700 hover:bg-blue-100"
  },
  {
    from: "from-green-50", to: "to-emerald-50", border: "border-green-200", hover: "hover:border-green-300", text: "text-green-700", icon: "text-green-600", iconHover: "hover:text-green-700 hover:bg-green-100"
  },
  {
    from: "from-purple-50", to: "to-pink-50", border: "border-purple-200", hover: "hover:border-purple-300", text: "text-purple-700", icon: "text-purple-600", iconHover: "hover:text-purple-700 hover:bg-purple-100"
  },
  {
    from: "from-pink-50", to: "to-red-50", border: "border-pink-200", hover: "hover:border-pink-300", text: "text-pink-700", icon: "text-pink-600", iconHover: "hover:text-pink-700 hover:bg-pink-100"
  },
  {
    from: "from-cyan-50", to: "to-sky-50", border: "border-cyan-200", hover: "hover:border-cyan-300", text: "text-cyan-700", icon: "text-cyan-600", iconHover: "hover:text-cyan-700 hover:bg-cyan-100"
  },
];

// Tag color mapping for project header tags
const tagColorMap = {
  'DOBs': 'bg-[#19B46A] text-white',
  'RGB++': 'bg-[#8F3FFF] text-white',
  'DApp': 'bg-[#2563EB] text-white',
};

const marketingIconMap = {
  twitter: {
    icon: FaTwitter,
    color: 'hover:text-[#1DA1F2] text-gray-700',
    label: 'Twitter',
  },
  github: {
    icon: FaGithub,
    color: 'hover:text-[#333] text-gray-700',
    label: 'GitHub',
  },
  discord: {
    icon: FaDiscord,
    color: 'hover:text-[#5865F2] text-gray-700',
    label: 'Discord',
  },
  telegram: {
    icon: FaTelegramPlane,
    color: 'hover:text-[#229ED9] text-gray-700',
    label: 'Telegram',
  },
  reddit: {
    icon: FaReddit,
    color: 'hover:text-[#FF4500] text-gray-700',
    label: 'Reddit',
  },
  youtube: {
    icon: FaYoutube,
    color: 'hover:text-[#FF0000] text-gray-700',
    label: 'YouTube',
  },
  medium: {
    icon: FaMedium,
    color: 'hover:text-[#00ab6c] text-gray-700',
    label: 'Medium',
  },
};

const ProjectHeader = ({ data, onClose, language }) => {
  const [t] = useTranslation();
  return (
    <section className="bg-white py-6 px-4 md:py-8 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="h-32 w-32 rounded-lg bg-cosmic-purple/10 flex items-center justify-center overflow-hidden mr-4 -mt-12 md:-mt-16 relative z-20 border-4 border-white">
              {data.logo ? (
                <img
                  src={data.logo}
                  alt={data.name + ' logo'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <h1 className="text-xl font-bold text-white uppercase">{data.name}</h1>
              )}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{data.name}</h2>
              <div className="flex gap-2 mt-2">
                {data.tags && data.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`text-sm px-3 py-1 rounded-full font-medium ${tagColorMap[tag.name] || 'bg-gray-200 text-gray-800'}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex gap-2 justify-center md:justify-start">
              {/* social icons */}
              {data.socialLinks && Object.entries(data.socialLinks).map(([icon, url]) => {
                const info = marketingIconMap[icon];
                if (!info) return null;
                const Icon = info.icon;
                return (
                  <a
                    key={icon}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={info.label}
                    className={`rounded-full border border-gray-300 w-10 h-10 flex items-center justify-center transition-colors ${info.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            <a
              href={data.websiteUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={data.websiteUrl ? 0 : -1}
              aria-disabled={!data.websiteUrl}
              style={{ pointerEvents: data.websiteUrl ? 'auto' : 'none' }}
            >
              <Button
                className={`w-full md:w-auto px-8 py-3 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transition-transform duration-200 ${data.websiteUrl ? 'hover:scale-105 hover:shadow-lg' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!data.websiteUrl}
              >
                {t('detail.buttons.visit-website')}
              </Button>
            </a>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {getLocalizedText(data.description, language)}
        </p>
      </div>
    </section>
  );
}

const AwesomeHighlights = ({ highlights, language }) => {
  const [t] = useTranslation();
  if (!highlights) return null;
  return (
    <section className="max-w-7xl mx-auto py-8 px-4 md:py-12">
      <div className="bg-[#FFF9E6] border border-[#FFF2CC] rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Zap className="h-8 w-8 text-amber-500" />
            {t('detail.sections.awesome-highlights')}
          </h3>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {highlights.slice(0, 6).map((item, idx) => {
            const color = highlightsColors[idx] || highlightsColors[0];
            return (
              <div
                key={idx}
                className={`w-full group bg-gradient-to-r ${color.from} ${color.to} rounded-xl p-6 border ${color.border} ${color.hover} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="max-w-[90%] min-w-0">
                    <h4 className="text-gray-900 font-bold text-lg break-words whitespace-normal">{getLocalizedText(item.title, language)}</h4>
                    <p className={`${color.text} text-sm break-words whitespace-normal pt-2`}>{getLocalizedText(item.description, language)}</p>
                  </div>
                  {item.link ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${color.icon} ${color.iconHover} rounded-full`}
                      asChild
                    >
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </Button>
                  ) : (
                    <span className={`${color.icon} rounded-full opacity-60`}>
                      <ExternalLink className="h-5 w-5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const VideoSection = ({ videos, videoIndex, setVideoIndex }) => {
  if (!videos) return null;
  return (
    <section className="max-w-7xl mx-auto py-8 px-4 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center relative border border-gray-200 overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={videos[videoIndex].url}
              title={videos[videoIndex].title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            ></iframe>
          </div>
        </div>
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-[400px]">
          {videos.map((video, idx) => (
            <Button
              key={idx}
              onClick={() => setVideoIndex(idx)}
              className={`bg-gray-100 rounded-lg w-full h-32 flex items-center justify-center overflow-hidden transition-all duration-200 ${
                videoIndex === idx
                  ? 'border-2 border-orange-400'
                  : 'border border-gray-200'
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className={`object-cover w-full h-full ${videoIndex === idx ? '' : 'opacity-70'}`}
              />
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}

const ProjectTransparency = ({ transparency, language }) => {
  const [t] = useTranslation();
  if (!transparency) return null;
  return (
    <section className="max-w-7xl mx-auto py-8 px-4 md:py-12">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{t('detail.sections.project-transparency')}</h3>
          {/* Info icon with tooltip */}
          <div className="relative group pt-2 hidden md:block">
            <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none
              bg-white border border-gray-200 rounded-lg shadow-md px-4 py-2 text-sm text-gray-500 whitespace-pre-line min-w-[580px] max-w-xs
              opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
              Disclaimer: The following information may be inaccurate or incomplete, platform does not guarantee the accuracy or completeness. If you have any questions or corrections, please submit an appeal.
            </div>
          </div>
        </div>
        <a
          href="https://github.com/CKBFansDAO/ckbdapps/pulls"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" />
          </svg>
          {t('detail.buttons.submit-correction')}
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Team Card */}
        <div className="group bg-white border border-amber-200 hover:border-amber-300 rounded-2xl p-8 shadow-lg hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-[#28C1B0] rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{t('detail.transparency.team')}</h4>
            </div>
          </div>
          <div className="space-y-4">
            {transparency.team.items.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition
                ${item.status === false ? 'bg-gray-100' : item.status === undefined ? 'bg-yellow-100' : 'bg-green-100 hover:bg-green-200'}`}>
                <span className={item.status === false ? 'text-gray-400 font-medium' : item.status === undefined ? 'text-yellow-700 font-medium' : 'text-gray-900 font-medium'}>{item.name}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center
                  ${item.status === false ? 'bg-gray-400' : item.status === undefined ? 'bg-yellow-400' : 'bg-green-500'}`}>
                  {item.status === false ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293z" clipRule="evenodd" />
                    </svg>
                  ) : item.status === undefined ? (
                    <FaQuestionCircle className="w-3 h-3 text-white" />
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Project Card */}
        <div className="group bg-white border border-amber-200 hover:border-amber-300 rounded-2xl p-8 shadow-lg hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-[#733DFF] rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{t('detail.transparency.project')}</h4>
            </div>
          </div>
          <div className="space-y-4">
            {transparency.project.items.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition
                ${item.status === false ? 'bg-gray-100' : item.status === undefined ? 'bg-yellow-100' : 'bg-green-100 hover:bg-green-200'}`}>
                <span className={item.status === false ? 'text-gray-400 font-medium' : item.status === undefined ? 'text-yellow-700 font-medium' : 'text-gray-900 font-medium'}>{item.name}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center
                  ${item.status === false ? 'bg-gray-400' : item.status === undefined ? 'bg-yellow-400' : 'bg-green-500'}`}>
                  {item.status === false ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293z" clipRule="evenodd" />
                    </svg>
                  ) : item.status === undefined ? (
                    <FaQuestionCircle className="w-3 h-3 text-white" />
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Token Card */}
        <div className="group bg-white border border-amber-200 hover:border-amber-300 rounded-2xl p-8 shadow-lg hover:shadow-md transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-[#F56100] rounded-full p-3 mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{t('detail.transparency.token')}</h4>
            </div>
          </div>
          <div className="space-y-4">
            {transparency.token.items.map((item, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition
                ${item.status === false ? 'bg-gray-100' : item.status === undefined ? 'bg-yellow-100' : 'bg-green-100 hover:bg-green-200'}`}>
                <span className={item.status === false ? 'text-gray-400 font-medium' : item.status === undefined ? 'text-yellow-700 font-medium' : 'text-gray-900 font-medium'}>{item.name}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center
                  ${item.status === false ? 'bg-gray-400' : item.status === undefined ? 'bg-yellow-400' : 'bg-green-500'}`}>
                  {item.status === false ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.707 6.293a1 1 0 00-1.414 1.414L8.586 11l-3.293 3.293a1 1 0 101.414 1.414L10 12.414l3.293 3.293a1 1 0 001.414-1.414L11.414 11l3.293-3.293a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293z" clipRule="evenodd" />
                    </svg>
                  ) : item.status === undefined ? (
                    <FaQuestionCircle className="w-3 h-3 text-white" />
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQAndRelated = ({ faq, related, expandedFaq, setExpandedFaq, onRelatedClick, language }) => {
  const [t] = useTranslation();
  return (
    <section className="max-w-7xl mx-auto py-8 px-4 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQ Area */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">{t('detail.sections.faq')}</h3>
          <div className="space-y-4">
            {faq && faq.map((item, idx) => (
              <div
                key={idx}
                className={`rounded-xl border border-gray-200 p-0 cursor-pointer transition-all duration-300 shadow-sm overflow-hidden
                  ${expandedFaq === idx ? 'bg-orange-50 border-orange-300 shadow-lg scale-[1.02]' : 'bg-white hover:bg-gray-50'}
                `}
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              >
                <div className="flex items-start justify-between px-6 py-4">
                  <div className="flex items-start gap-3">
                    <FaQuestionCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0 pt-1" />
                    <span className="font-medium text-gray-900 text-lg leading-relaxed">{getLocalizedText(item.q, language)}</span>
                  </div>
                  <span className="ml-2 text-gray-400 text-2xl font-bold select-none mt-0.5">
                    {expandedFaq === idx ? '-' : '+'}
                  </span>
                </div>
                {expandedFaq === idx && (
                  <div className="transition-all duration-300 py-4 px-8 bg-white border-t border-orange-100 flex items-start gap-3 text-gray-700 text-base">
                    <FaLightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0 pt-1" />
                    <span className="leading-relaxed">{getLocalizedText(item.a, language)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Related Area */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">{t('detail.sections.related')}</h3>
          <div className="flex flex-col gap-4">
            {related && related.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center bg-white border border-gray-200 rounded-lg shadow transition-shadow duration-300 hover:shadow-lg cursor-pointer px-4 py-3 group h-20"
                onClick={() => onRelatedClick && onRelatedClick(item.dappId)}
              >
                <img src={item.icon} alt={item.title} className="w-12 h-12 rounded-md object-contain bg-gray-100" />
                <div className="ml-4 flex-1 min-w-0">
                  <div className="font-bold text-base text-gray-900 truncate">{item.title}</div>
                  <div className="text-gray-600 text-sm truncate">{getLocalizedText(item.desc, language)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function DappDetail({ dappId, onClose, onRelatedClick }) {
  const language = useSelector(state => state.langReducer.language);
  const [t] = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [videoIndex, setVideoIndex] = useState(0);

  useEffect(() => {
    if (!dappId) return;
    setLoading(true);
    fetch(`/dappDetails/${dappId}.json`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load data");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
        
        // 预加载相关项目的图片
        if (json.related && json.related.length > 0) {
          if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
              // 预加载相关项目的详情图片
              json.related.forEach(related => {
                if (related.dappId) {
                  imagePreloader.preloadProjectDetailImages(related.dappId);
                }
              });
            });
          } else {
            setTimeout(() => {
              json.related.forEach(related => {
                if (related.dappId) {
                  imagePreloader.preloadProjectDetailImages(related.dappId);
                }
              });
            }, 1000);
          }
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [dappId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white text-gray-900 z-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="fixed inset-0 bg-white text-gray-900 z-50 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-white text-gray-900 z-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white py-4 px-4 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center">
          <button onClick={onClose} className="flex items-center text-gray-900 hover:text-gray-600">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <h3 className="text-ml">{t('home.buttons.back-to-projects')}</h3>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-[200px] md:h-[300px] overflow-hidden">
        <img src={data.titleImage} alt={data.name + " Hero"} className="object-cover w-full h-full absolute inset-0" style={{objectFit:'cover'}} />
      </section>

      {/* Project Header (modularized) */}
      <ProjectHeader data={data} onClose={onClose} language={language} />

      {/* Awesome Highlights (modularized) */}
      <AwesomeHighlights highlights={data.highlights} language={language} />

      {/* Video Section (modularized) */}
      <VideoSection videos={data.videos} videoIndex={videoIndex} setVideoIndex={setVideoIndex} />

      {/* Project Transparency (modularized) */}
      <ProjectTransparency transparency={data.transparency} language={language} />

      {/* FAQ & Related (modularized) */}
      <FAQAndRelated
        faq={data.faq}
        related={data.related}
        expandedFaq={expandedFaq}
        setExpandedFaq={setExpandedFaq}
        onRelatedClick={onRelatedClick}
        language={language}
      />
    </div>
  );
} 
