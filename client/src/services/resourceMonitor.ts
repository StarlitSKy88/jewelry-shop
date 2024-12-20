import { resourceConfig } from '../config/performance';

interface ResourceTiming {
  name: string;
  initiatorType: string;
  startTime: number;
  duration: number;
  transferSize: number;
  decodedBodySize: number;
  encodedBodySize: number;
}

interface ResourceWarning {
  type: 'size' | 'performance' | 'error';
  resource: string;
  message: string;
  value?: number;
  threshold?: number;
}

class ResourceMonitorService {
  private observer: PerformanceObserver | null = null;
  private resourceTimings: ResourceTiming[] = [];
  private warnings: ResourceWarning[] = [];

  // 开始监控
  startMonitoring() {
    // 清理旧数据
    this.resourceTimings = [];
    this.warnings = [];

    // 设置性能观察器
    this.observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceResourceTiming[];
      entries.forEach(entry => {
        if (this.shouldMonitorResource(entry)) {
          this.processResourceTiming(entry);
        }
      });
    });

    try {
      // 观察资源加载性能
      this.observer.observe({ entryTypes: ['resource'] });
      
      // 检查已加载的资源
      const existingEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      existingEntries.forEach(entry => {
        if (this.shouldMonitorResource(entry)) {
          this.processResourceTiming(entry);
        }
      });
    } catch (error) {
      console.error('Resource monitoring not supported:', error);
    }
  }

  // 停止监控
  stopMonitoring() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  // 获取资源统计
  getStats() {
    const stats = {
      totalResources: this.resourceTimings.length,
      totalSize: 0,
      totalDuration: 0,
      averageSize: 0,
      averageDuration: 0,
      byType: {} as Record<string, {
        count: number;
        totalSize: number;
        totalDuration: number;
      }>,
      warnings: this.warnings,
    };

    this.resourceTimings.forEach(timing => {
      stats.totalSize += timing.transferSize;
      stats.totalDuration += timing.duration;

      if (!stats.byType[timing.initiatorType]) {
        stats.byType[timing.initiatorType] = {
          count: 0,
          totalSize: 0,
          totalDuration: 0,
        };
      }

      const typeStats = stats.byType[timing.initiatorType];
      typeStats.count++;
      typeStats.totalSize += timing.transferSize;
      typeStats.totalDuration += timing.duration;
    });

    if (stats.totalResources > 0) {
      stats.averageSize = stats.totalSize / stats.totalResources;
      stats.averageDuration = stats.totalDuration / stats.totalResources;
    }

    return stats;
  }

  // 获取性能建议
  getOptimizationSuggestions() {
    const suggestions: string[] = [];
    const stats = this.getStats();

    // 检查总资源大小
    if (stats.totalSize > 5 * 1024 * 1024) { // 5MB
      suggestions.push('总资源大小超过5MB，建议优化资源大小');
    }

    // 检查各类型资源
    Object.entries(stats.byType).forEach(([type, typeStats]) => {
      const threshold = resourceConfig.sizeThreshold[type as keyof typeof resourceConfig.sizeThreshold];
      if (threshold && typeStats.totalSize > threshold * typeStats.count) {
        suggestions.push(
          `${type}类型资源平均大小超过${threshold / 1024}KB，建议优化`
        );
      }
    });

    // 检查加载时间
    if (stats.averageDuration > 1000) { // 1秒
      suggestions.push('资源平均加载时间超过1秒，建议优化加载性能');
    }

    // 检查资源压缩
    this.resourceTimings.forEach(timing => {
      if (timing.encodedBodySize > 0 && timing.decodedBodySize / timing.encodedBodySize > 4) {
        suggestions.push(`资源 ${timing.name} 压缩率过低，建议使用更好的压缩算法`);
      }
    });

    return suggestions;
  }

  // 清理数据
  clearData() {
    this.resourceTimings = [];
    this.warnings = [];
    performance.clearResourceTimings();
  }

  private shouldMonitorResource(entry: PerformanceResourceTiming): boolean {
    // 检查资源类型是否需要监控
    if (!resourceConfig.types.includes(entry.initiatorType)) {
      return false;
    }

    // 检查是否是忽略的URL
    const url = entry.name;
    return !resourceConfig.ignoreUrls.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(url);
      }
      return url.includes(pattern);
    });
  }

  private processResourceTiming(entry: PerformanceResourceTiming) {
    const timing: ResourceTiming = {
      name: entry.name,
      initiatorType: entry.initiatorType,
      startTime: entry.startTime,
      duration: entry.duration,
      transferSize: entry.transferSize,
      decodedBodySize: entry.decodedBodySize,
      encodedBodySize: entry.encodedBodySize,
    };

    this.resourceTimings.push(timing);

    // 检查资源大小
    const sizeThreshold = resourceConfig.sizeThreshold[entry.initiatorType as keyof typeof resourceConfig.sizeThreshold];
    if (sizeThreshold && entry.transferSize > sizeThreshold) {
      this.warnings.push({
        type: 'size',
        resource: entry.name,
        message: `资源大小超过阈值`,
        value: entry.transferSize,
        threshold: sizeThreshold,
      });
    }

    // 检查加载时间
    if (entry.duration > resourceConfig.timeout) {
      this.warnings.push({
        type: 'performance',
        resource: entry.name,
        message: `资源加载时间超过${resourceConfig.timeout}ms`,
        value: entry.duration,
        threshold: resourceConfig.timeout,
      });
    }

    // 检查加载失败
    if (entry.transferSize === 0 && entry.decodedBodySize === 0) {
      this.warnings.push({
        type: 'error',
        resource: entry.name,
        message: '资源可能加载失败',
      });
    }
  }
}

export const resourceMonitorService = new ResourceMonitorService(); 