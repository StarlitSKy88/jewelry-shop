import { ReportHandler } from 'web-vitals';

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  // 新增性能指标
  memoryUsage: number;
  cpuUsage: number;
  fps: number;
  networkLatency: number;
  domNodes: number;
  resourceCount: number;
  jsHeapSize: number;
  paintTime: number;
  scriptTime: number;
  layoutTime: number;
  recalcStyleTime: number;
  compositeTime: number;
}

interface ResourceTiming {
  name: string;
  duration: number;
  startTime: number;
  transferSize: number;
  initiatorType: string;
  cacheHitRate: number;
}

interface PerformanceData {
  metrics: PerformanceMetrics;
  resources: ResourceTiming[];
  timestamp: number;
  url: string;
  userAgent: string;
}

interface PerformanceOptions {
  sampleRate?: number;
  reportInterval?: number;
  maxDataPoints?: number;
  reportEndpoint?: string;
  enableMemoryMonitoring?: boolean;
  enableCPUMonitoring?: boolean;
  enableFPSMonitoring?: boolean;
}

class PerformanceMonitor {
  private data: PerformanceData[] = [];
  private metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    fps: 0,
    networkLatency: 0,
    domNodes: 0,
    resourceCount: 0,
    jsHeapSize: 0,
    paintTime: 0,
    scriptTime: 0,
    layoutTime: 0,
    recalcStyleTime: 0,
    compositeTime: 0,
  };
  private options: Required<PerformanceOptions>;
  private fpsInterval: number | null = null;
  private lastFrameTime: number = performance.now();
  private frameCount: number = 0;

  constructor(options: PerformanceOptions = {}) {
    this.options = {
      sampleRate: 100,
      reportInterval: 5000,
      maxDataPoints: 1000,
      reportEndpoint: '/api/performance',
      enableMemoryMonitoring: true,
      enableCPUMonitoring: true,
      enableFPSMonitoring: true,
      ...options,
    };

    this.init();
  }

  private init(): void {
    // Web Vitals
    this.initWebVitals();
    
    // 性能观察器
    this.initPerformanceObserver();
    
    // 内存监控
    if (this.options.enableMemoryMonitoring) {
      this.initMemoryMonitoring();
    }
    
    // CPU监控
    if (this.options.enableCPUMonitoring) {
      this.initCPUMonitoring();
    }
    
    // FPS监控
    if (this.options.enableFPSMonitoring) {
      this.initFPSMonitoring();
    }

    // 定时上报
    setInterval(() => this.reportData(), this.options.reportInterval);
  }

  private initWebVitals(): void {
    const reportWebVitals: ReportHandler = (metric) => {
      switch (metric.name) {
        case 'FCP':
          this.metrics.fcp = metric.value;
          break;
        case 'LCP':
          this.metrics.lcp = metric.value;
          break;
        case 'FID':
          this.metrics.fid = metric.value;
          break;
        case 'CLS':
          this.metrics.cls = metric.value;
          break;
        case 'TTFB':
          this.metrics.ttfb = metric.value;
          break;
      }
    };

    import('web-vitals').then(({ onFCP, onLCP, onFID, onCLS, onTTFB }) => {
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onFID(reportWebVitals);
      onCLS(reportWebVitals);
      onTTFB(reportWebVitals);
    });
  }

  private initPerformanceObserver(): void {
    // 监控长任务
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.metrics.scriptTime += entry.duration;
      });
    });
    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // 监控布局变化
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.metrics.layoutTime += entry.duration;
      });
    });
    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

    // 监控绘制时间
    const paintObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.metrics.paintTime += entry.duration;
      });
    });
    paintObserver.observe({ entryTypes: ['paint'] });
  }

  private initMemoryMonitoring(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.metrics.jsHeapSize = memory.usedJSHeapSize;
        this.metrics.memoryUsage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      }, 1000);
    }
  }

  private initCPUMonitoring(): void {
    if ('cpuUsage' in process) {
      setInterval(() => {
        const startUsage = process.cpuUsage();
        setTimeout(() => {
          const endUsage = process.cpuUsage(startUsage);
          this.metrics.cpuUsage = (endUsage.user + endUsage.system) / 1000000;
        }, 100);
      }, 1000);
    }
  }

  private initFPSMonitoring(): void {
    const measureFPS = () => {
      const now = performance.now();
      const elapsed = now - this.lastFrameTime;
      this.frameCount++;

      if (elapsed >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / elapsed);
        this.frameCount = 0;
        this.lastFrameTime = now;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  private async reportData(): Promise<void> {
    if (Math.random() * 100 > this.options.sampleRate) {
      return;
    }

    const performanceData: PerformanceData = {
      metrics: { ...this.metrics },
      resources: this.getResourceTimings(),
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    try {
      const response = await fetch(this.options.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(performanceData),
      });

      if (!response.ok) {
        console.error('Failed to report performance data');
      }

      // 清理资源计时数据
      performance.clearResourceTimings();
      
      // 限制数据点数量
      this.data.push(performanceData);
      if (this.data.length > this.options.maxDataPoints) {
        this.data.shift();
      }
    } catch (error) {
      console.error('Error reporting performance data:', error);
    }
  }

  public getResourceTimings(): ResourceTiming[] {
    return performance.getEntriesByType('resource').map((entry) => {
      const resourceEntry = entry as PerformanceResourceTiming;
      return {
        name: resourceEntry.name,
        duration: resourceEntry.duration,
        startTime: resourceEntry.startTime,
        transferSize: resourceEntry.transferSize,
        initiatorType: resourceEntry.initiatorType,
        cacheHitRate: resourceEntry.transferSize === 0 ? 100 : 0,
      };
    });
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getData(): PerformanceData[] {
    return [...this.data];
  }

  public getAnalytics() {
    const data = this.getData();
    return {
      averages: this.calculateAverages(data),
      trends: this.calculateTrends(data),
      anomalies: this.detectAnomalies(data),
      recommendations: this.generateRecommendations(data),
    };
  }

  private calculateAverages(data: PerformanceData[]) {
    const metrics = Object.keys(this.metrics);
    const averages: Record<string, number> = {};

    metrics.forEach((metric) => {
      const values = data.map((d) => d.metrics[metric as keyof PerformanceMetrics]);
      averages[metric] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    return averages;
  }

  private calculateTrends(data: PerformanceData[]) {
    const metrics = Object.keys(this.metrics);
    const trends: Record<string, 'improving' | 'stable' | 'degrading'> = {};

    metrics.forEach((metric) => {
      const values = data.map((d) => d.metrics[metric as keyof PerformanceMetrics]);
      const firstHalf = values.slice(0, values.length / 2);
      const secondHalf = values.slice(values.length / 2);
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      const change = ((secondAvg - firstAvg) / firstAvg) * 100;
      
      if (change < -5) {
        trends[metric] = 'improving';
      } else if (change > 5) {
        trends[metric] = 'degrading';
      } else {
        trends[metric] = 'stable';
      }
    });

    return trends;
  }

  private detectAnomalies(data: PerformanceData[]) {
    const metrics = Object.keys(this.metrics);
    const anomalies: Record<string, { value: number; timestamp: number }[]> = {};

    metrics.forEach((metric) => {
      const values = data.map((d) => d.metrics[metric as keyof PerformanceMetrics]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(
        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
      );

      anomalies[metric] = data
        .filter((d, i) => {
          const value = d.metrics[metric as keyof PerformanceMetrics];
          return Math.abs(value - mean) > stdDev * 2;
        })
        .map((d) => ({
          value: d.metrics[metric as keyof PerformanceMetrics],
          timestamp: d.timestamp,
        }));
    });

    return anomalies;
  }

  private generateRecommendations(data: PerformanceData[]) {
    const recommendations: string[] = [];
    const metrics = this.getMetrics();
    const trends = this.calculateTrends(data);

    // FCP recommendations
    if (metrics.fcp > 2000) {
      recommendations.push('Consider optimizing First Contentful Paint by reducing server response time and minimizing render-blocking resources.');
    }

    // LCP recommendations
    if (metrics.lcp > 2500) {
      recommendations.push('Improve Largest Contentful Paint by optimizing image loading and implementing proper caching strategies.');
    }

    // Memory usage recommendations
    if (metrics.memoryUsage > 80) {
      recommendations.push('High memory usage detected. Consider implementing memory leak detection and cleanup.');
    }

    // FPS recommendations
    if (metrics.fps < 30) {
      recommendations.push('Low FPS detected. Optimize animations and reduce DOM complexity to improve frame rate.');
    }

    // Resource recommendations
    const resources = this.getResourceTimings();
    const slowResources = resources.filter((r) => r.duration > 1000);
    if (slowResources.length > 0) {
      recommendations.push(`${slowResources.length} resources are loading slowly. Consider implementing lazy loading or optimizing resource size.`);
    }

    return recommendations;
  }

  public exportData(format: 'json' | 'csv' = 'json'): string {
    const data = this.getData();
    
    if (format === 'csv') {
      const headers = [
        'timestamp',
        'url',
        ...Object.keys(this.metrics),
        'resourceCount',
      ].join(',');
      
      const rows = data.map((d) => [
        d.timestamp,
        d.url,
        ...Object.values(d.metrics),
        d.resources.length,
      ].join(','));
      
      return [headers, ...rows].join('\n');
    }
    
    return JSON.stringify(data, null, 2);
  }

  public destroy(): void {
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor(); 