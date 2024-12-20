export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  processingStart?: number;
  hadRecentInput?: boolean;
  value?: number;
}

export interface PerformanceMetricsResponse {
  metrics: {
    // 页面加载性能
    pageLoadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    
    // 交互性能
    firstInputDelay: number;
    totalBlockingTime: number;
    cumulativeLayoutShift: number;
    
    // 资源性能
    resourceLoadTimes: {
      name: string;
      duration: number;
      size: number;
      type: string;
    }[];
    
    // 网络性能
    effectiveConnectionType: string;
    downlink: number;
    rtt: number;
    
    // 内存性能
    jsHeapSize: number;
    jsHeapUsedSize: number;
  };
  timestamp: number;
  url: string;
  userAgent: string;
}

export interface PerformanceError {
  message: string;
  source: string;
  timestamp: number;
  stack?: string;
  componentStack?: string;
}

export interface PerformanceConfig {
  collectionInterval?: number; // 收集间隔（毫秒）
  sampleRate?: number; // 采样率（0-1）
  maxErrors?: number; // 最大错误数量
  ignoreUrls?: string[]; // 忽略的URL
  customMetrics?: string[]; // 自定义指标
} 