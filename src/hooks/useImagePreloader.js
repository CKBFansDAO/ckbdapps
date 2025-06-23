import { useState, useEffect, useCallback } from 'react';
import imagePreloader from '../utils/imagePreloader';

export const useImagePreloader = () => {
  const [preloadStatus, setPreloadStatus] = useState({
    isPreloading: false,
    totalImages: 0,
    loadedImages: 0,
    progress: 0
  });

  // 获取缓存信息
  const getCacheInfo = useCallback(() => {
    return imagePreloader.getCacheInfo();
  }, []);

  // 检查图片是否已缓存
  const isImageCached = useCallback((url) => {
    return imagePreloader.isImageCached(url);
  }, []);

  // 预加载项目图片并跟踪进度
  const preloadProjectImages = useCallback(async (sections) => {
    setPreloadStatus(prev => ({ ...prev, isPreloading: true, progress: 0 }));
    
    try {
      await imagePreloader.preloadProjectImages(sections);
      setPreloadStatus(prev => ({ 
        ...prev, 
        isPreloading: false, 
        progress: 100 
      }));
    } catch (error) {
      console.error('Failed to preload project images:', error);
      setPreloadStatus(prev => ({ 
        ...prev, 
        isPreloading: false 
      }));
    }
  }, []);

  // 预加载项目详情图片
  const preloadProjectDetailImages = useCallback(async (dappId) => {
    try {
      await imagePreloader.preloadProjectDetailImages(dappId);
    } catch (error) {
      console.warn(`Failed to preload detail images for ${dappId}:`, error);
    }
  }, []);

  // 智能预加载
  const smartPreload = useCallback(async (currentProject, allProjects) => {
    try {
      await imagePreloader.smartPreload(currentProject, allProjects);
    } catch (error) {
      console.warn('Smart preload failed:', error);
    }
  }, []);

  // 清理缓存
  const cleanupCache = useCallback((maxAge) => {
    imagePreloader.cleanupCache(maxAge);
  }, []);

  // 定期更新缓存信息
  useEffect(() => {
    const interval = setInterval(() => {
      const info = getCacheInfo();
      setPreloadStatus(prev => ({
        ...prev,
        totalImages: info.cacheSize + info.loadingCount + info.queueLength,
        loadedImages: info.cacheSize
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [getCacheInfo]);

  return {
    preloadStatus,
    preloadProjectImages,
    preloadProjectDetailImages,
    smartPreload,
    isImageCached,
    getCacheInfo,
    cleanupCache
  };
};

export default useImagePreloader; 
