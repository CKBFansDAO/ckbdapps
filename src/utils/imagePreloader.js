class ImagePreloader {
  constructor() {
    this.cache = new Map(); // 存储已加载的图片
    this.loading = new Set(); // 正在加载的图片URL
    this.priorities = {
      URGENT: 5,  // 用户立即需要的图片
      HIGH: 3,    // 首屏内容
      MEDIUM: 2,  // 可能很快查看的内容
      LOW: 1      // 背景预加载
    };
    this.loadQueue = [];
    this.maxConcurrent = 4; // 最大并发加载数
    this.currentLoading = 0;
    this.observers = new Map(); // 观察者模式，通知加载完成
  }

  // 紧急加载图片 - 用户立即需要时调用
  urgentPreload(url) {
    return new Promise((resolve, reject) => {
      // 如果已经在缓存中，直接返回
      if (this.cache.has(url)) {
        resolve(this.cache.get(url));
        return;
      }

      // 如果正在加载，添加到观察者但不改变优先级（已经在处理中）
      if (this.loading.has(url)) {
        if (!this.observers.has(url)) {
          this.observers.set(url, []);
        }
        this.observers.get(url).push({ resolve, reject });
        return;
      }

      // 检查是否已在队列中
      const existingTaskIndex = this.loadQueue.findIndex(task => task.url === url);
      
      if (existingTaskIndex !== -1) {
        // 如果在队列中，提升为URGENT优先级并移到队首
        const existingTask = this.loadQueue[existingTaskIndex];
        existingTask.priority = this.priorities.URGENT;
        existingTask.timestamp = Date.now(); // 更新时间戳
        
        // 添加新的回调到现有任务
        if (!existingTask.callbacks) {
          existingTask.callbacks = [{ resolve: existingTask.resolve, reject: existingTask.reject }];
        }
        existingTask.callbacks.push({ resolve, reject });
        
        // 重新排序队列
        this.reorderQueue();
      } else {
        // 不在队列中，添加为URGENT优先级
        this.loadQueue.push({
          url,
          priority: this.priorities.URGENT,
          resolve,
          reject,
          timestamp: Date.now()
        });
        
        // 重新排序队列
        this.reorderQueue();
      }

      this.processQueue();
    });
  }

  // 队列重排序方法
  reorderQueue() {
    this.loadQueue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // 高优先级在前
      }
      return a.timestamp - b.timestamp; // 相同优先级按时间排序
    });
  }

  // 批量紧急加载 - 用于项目详情页
  async urgentPreloadBatch(urls) {
    const promises = urls.map(url => this.urgentPreload(url));
    return Promise.allSettled(promises);
  }

  // 紧急加载项目缩略图 - 当用户即将点击时调用
  urgentPreloadProjectThumbnail(dappId, sections) {
    const imagesToLoad = [];
    
    // 在所有section中查找对应的项目图片
    const allProjects = [
      ...(sections.sparkGranted || []),
      ...(sections.highlighted || []),
      ...(sections.premium || []),
      ...(sections.community || [])
    ];
    
    const project = allProjects.find(p => 
      p.link && p.link.replace(/^\//, '').toLowerCase() === dappId.toLowerCase()
    );
    
    if (project) {
      if (project.image) imagesToLoad.push(project.image);
      if (project.tinyImage) imagesToLoad.push(project.tinyImage);
    }
    
    // 紧急加载这些图片
    return this.urgentPreloadBatch(imagesToLoad);
  }

  // 预加载单个图片
  preloadImage(url, priority = this.priorities.MEDIUM) {
    return new Promise((resolve, reject) => {
      // 如果已经在缓存中，直接返回
      if (this.cache.has(url)) {
        resolve(this.cache.get(url));
        return;
      }

      // 如果正在加载，添加到观察者
      if (this.loading.has(url)) {
        if (!this.observers.has(url)) {
          this.observers.set(url, []);
        }
        this.observers.get(url).push({ resolve, reject });
        return;
      }

      // 添加到加载队列
      this.loadQueue.push({
        url,
        priority,
        resolve,
        reject,
        timestamp: Date.now()
      });

      // 根据优先级排序队列
      this.reorderQueue();

      this.processQueue();
    });
  }

  // 处理加载队列
  async processQueue() {
    while (this.loadQueue.length > 0 && this.currentLoading < this.maxConcurrent) {
      const task = this.loadQueue.shift();
      this.currentLoading++;
      this.loading.add(task.url);

      try {
        const result = await this.loadSingleImage(task.url);
        this.cache.set(task.url, result);
        
        // 处理主要回调
        task.resolve(result);
        
        // 处理额外的回调（来自紧急加载或重复请求）
        if (task.callbacks) {
          task.callbacks.forEach(callback => {
            callback.resolve(result);
          });
        }

        // 通知其他等待同一图片的请求
        if (this.observers.has(task.url)) {
          this.observers.get(task.url).forEach(observer => {
            observer.resolve(result);
          });
          this.observers.delete(task.url);
        }
      } catch (error) {
        task.reject(error);
        
        // 处理额外的回调
        if (task.callbacks) {
          task.callbacks.forEach(callback => {
            callback.reject(error);
          });
        }
        
        // 通知错误
        if (this.observers.has(task.url)) {
          this.observers.get(task.url).forEach(observer => {
            observer.reject(error);
          });
          this.observers.delete(task.url);
        }
      } finally {
        this.loading.delete(task.url);
        this.currentLoading--;
        
        // 继续处理队列
        if (this.loadQueue.length > 0) {
          setTimeout(() => this.processQueue(), 0);
        }
      }
    }
  }

  // 实际加载图片的方法
  loadSingleImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
        img.onabort = null;
      };

      img.onload = () => {
        cleanup();
        resolve({
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          loaded: true,
          timestamp: Date.now()
        });
      };

      img.onerror = () => {
        cleanup();
        reject(new Error(`Failed to load image: ${url}`));
      };

      img.onabort = () => {
        cleanup();
        reject(new Error(`Image loading aborted: ${url}`));
      };

      // 设置超时
      setTimeout(() => {
        if (!this.cache.has(url)) {
          cleanup();
          reject(new Error(`Image loading timeout: ${url}`));
        }
      }, 10000); // 10秒超时

      img.src = url;
    });
  }

  // 批量预加载图片
  async preloadImages(urls, priority = this.priorities.MEDIUM) {
    const promises = urls.map(url => this.preloadImage(url, priority));
    return Promise.allSettled(promises);
  }

  // 根据项目数据预加载相关图片
  async preloadProjectImages(sections) {
    const imagesToPreload = [];

    // 收集所有需要预加载的图片URL
    if (sections.banners) {
      sections.banners.forEach(banner => {
        if (banner.image) {
          imagesToPreload.push({
            url: banner.image,
            priority: this.priorities.HIGH // Banner图片优先级最高
          });
        }
      });
    }

    if (sections.sparkGranted) {
      sections.sparkGranted.forEach(project => {
        if (project.image && !project.placeholder) {
          imagesToPreload.push({
            url: project.image,
            priority: this.priorities.MEDIUM
          });
        }
      });
    }

    if (sections.highlighted) {
      sections.highlighted.forEach(project => {
        if (project.image) {
          imagesToPreload.push({
            url: project.image,
            priority: this.priorities.MEDIUM
          });
        }
        if (project.tinyImage) {
          imagesToPreload.push({
            url: project.tinyImage,
            priority: this.priorities.MEDIUM
          });
        }
      });
    }

    if (sections.premium) {
      sections.premium.forEach(project => {
        if (project.image) {
          imagesToPreload.push({
            url: project.image,
            priority: this.priorities.LOW
          });
        }
      });
    }

    if (sections.community) {
      sections.community.forEach(project => {
        if (project.image && !project.placeholder) {
          imagesToPreload.push({
            url: project.image,
            priority: this.priorities.LOW
          });
        }
      });
    }

    // 分批预加载
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < imagesToPreload.length; i += batchSize) {
      batches.push(imagesToPreload.slice(i, i + batchSize));
    }

    // 按优先级和批次预加载
    for (const batch of batches) {
      const promises = batch.map(({ url, priority }) => 
        this.preloadImage(url, priority).catch(error => {
          console.warn(`Failed to preload image: ${url}`, error);
          return null; // 继续加载其他图片
        })
      );
      
      await Promise.allSettled(promises);
      
      // 在批次之间添加小延迟，避免阻塞主线程
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // 预加载项目详情页图片
  async preloadProjectDetailImages(dappId, urgent = false) {
    try {
      // 预加载项目详情JSON
      const response = await fetch(`/dappDetails/${dappId}.json`);
      const projectData = await response.json();
      
      const detailImages = [];
      const urgentImages = []; // 用户立即需要的图片
      
      // 收集详情页图片
      if (projectData.titleImage) {
        if (urgent) {
          urgentImages.push(projectData.titleImage);
        } else {
          detailImages.push({
            url: projectData.titleImage,
            priority: this.priorities.HIGH
          });
        }
      }

      if (projectData.highlights) {
        projectData.highlights.forEach(highlight => {
          if (highlight.image) {
            if (urgent) {
              urgentImages.push(highlight.image);
            } else {
              detailImages.push({
                url: highlight.image,
                priority: this.priorities.MEDIUM
              });
            }
          }
        });
      }

      if (projectData.related) {
        projectData.related.forEach(related => {
          if (related.icon) {
            detailImages.push({
              url: related.icon,
              priority: this.priorities.LOW // 相关项目图标始终为低优先级
            });
          }
        });
      }

      // 如果是紧急加载，使用urgentPreloadBatch
      if (urgent && urgentImages.length > 0) {
        const urgentPromises = this.urgentPreloadBatch(urgentImages);
        
        // 同时处理非紧急图片
        const normalPromises = detailImages.map(({ url, priority }) => 
          this.preloadImage(url, priority).catch(error => {
            console.warn(`Failed to preload detail image: ${url}`, error);
            return null;
          })
        );

        await Promise.allSettled([urgentPromises, ...normalPromises]);
      } else {
        // 常规预加载
        const promises = detailImages.map(({ url, priority }) => 
          this.preloadImage(url, priority).catch(error => {
            console.warn(`Failed to preload detail image: ${url}`, error);
            return null;
          })
        );

        await Promise.allSettled(promises);
      }
    } catch (error) {
      console.warn(`Failed to preload project detail images for ${dappId}:`, error);
    }
  }

  // 智能预加载：根据用户行为预测需要的图片
  async smartPreload(currentProject, allProjects) {
    const predictions = [];
    
    // 预加载相关项目的图片
    if (currentProject && currentProject.related) {
      currentProject.related.forEach(related => {
        if (related.dappId) {
          predictions.push(related.dappId);
        }
      });
    }

    // 预加载同类别的项目
    // 这里可以根据用户浏览历史、项目相似度等进行更智能的预测

    // 批量预加载预测的项目详情
    for (const dappId of predictions.slice(0, 3)) { // 限制为前3个预测
      this.preloadProjectDetailImages(dappId);
    }
  }

  // 检查图片是否已缓存
  isImageCached(url) {
    return this.cache.has(url);
  }

  // 获取缓存信息
  getCacheInfo() {
    return {
      cacheSize: this.cache.size,
      loadingCount: this.loading.size,
      queueLength: this.loadQueue.length,
      queuePriorities: this.loadQueue.map(task => ({
        url: task.url.substring(task.url.lastIndexOf('/') + 1), // 只显示文件名
        priority: task.priority,
        isUrgent: task.priority === this.priorities.URGENT
      }))
    };
  }

  // 清理过期缓存（可选）
  cleanupCache(maxAge = 30 * 60 * 1000) { // 30分钟
    const now = Date.now();
    for (const [url, data] of this.cache.entries()) {
      if (now - data.timestamp > maxAge) {
        this.cache.delete(url);
      }
    }
  }
}

// 创建全局实例
const imagePreloader = new ImagePreloader();

export default imagePreloader; 
