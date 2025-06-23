import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import imagePreloader from '../../utils/imagePreloader';

const PreloadIndicator = ({ show = false, minimal = false }) => {
  const [t] = useTranslation();
  const [cacheInfo, setCacheInfo] = useState({
    cacheSize: 0,
    loadingCount: 0,
    queueLength: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!show) return;

    const updateCacheInfo = () => {
      const info = imagePreloader.getCacheInfo();
      setCacheInfo(info);
      
      // 如果有正在加载的图片，显示指示器
      if (info.loadingCount > 0 || info.queueLength > 0) {
        setIsVisible(true);
      } else {
        // 延迟隐藏，让用户看到完成状态
        setTimeout(() => setIsVisible(false), 1000);
      }
    };

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 1000);

    return () => clearInterval(interval);
  }, [show]);

  if (!show || !isVisible) return null;

  const totalImages = cacheInfo.cacheSize + cacheInfo.loadingCount + cacheInfo.queueLength;
  const loadedImages = cacheInfo.cacheSize;
  const progress = totalImages > 0 ? (loadedImages / totalImages) * 100 : 0;

  if (minimal) {
    // 最小化版本：只显示一个小圆点
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">
            {cacheInfo.loadingCount > 0 ? 'Loading...' : 'Ready'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900">
            预加载图片
          </h4>
          <span className="text-xs text-gray-500">
            {Math.round(progress)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Status Text */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {cacheInfo.loadingCount > 0 
              ? `正在加载 ${cacheInfo.loadingCount} 张图片` 
              : cacheInfo.queueLength > 0 
                ? `队列中 ${cacheInfo.queueLength} 张图片`
                : '加载完成'
            }
          </span>
          <span>{loadedImages}/{totalImages}</span>
        </div>
        
        {/* Cache Info (Debug) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-gray-400 border-t pt-2">
            <div>缓存: {cacheInfo.cacheSize}</div>
            <div>加载中: {cacheInfo.loadingCount}</div>
            <div>队列: {cacheInfo.queueLength}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreloadIndicator; 
