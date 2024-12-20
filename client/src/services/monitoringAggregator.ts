import { performanceConfig } from '../config/performance';
import { userBehaviorService } from './userBehavior';
import { networkMonitorService } from './networkMonitor';
import { resourceMonitorService } from './resourceMonitor';

interface AggregatedData {
  timestamp: number;
  performance: {
    metrics: {
      pageLoadTime: number;
      firstContentfulPaint: number;
      largestContentfulPaint: number;
      firstInputDelay: number;
      cumulativeLayoutShift: number;
    };
    resources: {
      totalCount: number;
      totalSize: number;
      avgLoadTime: number;
      warnings: {
        type: string;
        message: string;
        count: number;
      }[];
    };
    network: {
      totalRequests: number;
      successRate: number;
      avgResponseTime: number;
      errorRate: number;
      slowRequestCount: number;
    };
  };
  userBehavior: {
    pageViews: number;
    uniqueUsers: number;
    avgSessionDuration: number;
    bounceRate: number;
    topActions: {
      type: string;
      count: number;
    }[];
  };
  errors: {
    total: number;
    unique: number;
    topErrors: {
      message: string;
      count: number;
      lastOccurred: number;
    }[];
  };
}

class MonitoringAggregator {
  private data: AggregatedData[] = [];
  private isRunning = false;
  private aggregationInterval: NodeJS.Timeout | null = null;

  // 启动聚合服务
  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    // 启动各个监控服务
    userBehaviorService.startTracking();
    networkMonitorService.startMonitoring();
    resourceMonitorService.startMonitoring();

    // 定期聚合数据
    this.aggregationInterval = setInterval(() => {
      this.aggregate();
    }, performanceConfig.default.collectionInterval);

    // 初始聚合
    this.aggregate();
  }

  // 停止聚合服务
  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;

    // 停止各个监控服务
    userBehaviorService.stopTracking();
    networkMonitorService.stopMonitoring();
    resourceMonitorService.stopMonitoring();

    // 清理定时器
    if (this.aggregationInterval) {
      clearInterval(this.aggregationInterval);
      this.aggregationInterval = null;
    }
  }

  // 获取聚合数据
  getData(startTime?: number, endTime?: number): AggregatedData[] {
    if (!startTime && !endTime) {
      return this.data;
    }

    return this.data.filter(item => {
      const timestamp = item.timestamp;
      const matchesStart = !startTime || timestamp >= startTime;
      const matchesEnd = !endTime || timestamp <= endTime;
      return matchesStart && matchesEnd;
    });
  }

  // 获取性能分析
  getPerformanceAnalysis() {
    const thresholds = performanceConfig.thresholds;
    const data = this.getData();
    if (data.length === 0) return null;

    const analysis = {
      metrics: {
        pageLoadTime: this.calculateMetricStats(data, 'performance.metrics.pageLoadTime'),
        firstContentfulPaint: this.calculateMetricStats(data, 'performance.metrics.firstContentfulPaint'),
        largestContentfulPaint: this.calculateMetricStats(data, 'performance.metrics.largestContentfulPaint'),
        firstInputDelay: this.calculateMetricStats(data, 'performance.metrics.firstInputDelay'),
        cumulativeLayoutShift: this.calculateMetricStats(data, 'performance.metrics.cumulativeLayoutShift'),
      },
      issues: [] as string[],
      trends: {} as Record<string, number[]>,
    };

    // 检查性能问题
    if (analysis.metrics.pageLoadTime.avg > thresholds.pageLoadTime) {
      analysis.issues.push(`页面加载时间(${analysis.metrics.pageLoadTime.avg}ms)超过阈值(${thresholds.pageLoadTime}ms)`);
    }
    if (analysis.metrics.firstContentfulPaint.avg > thresholds.firstContentfulPaint) {
      analysis.issues.push(`首次内容绘制时间(${analysis.metrics.firstContentfulPaint.avg}ms)超过阈值(${thresholds.firstContentfulPaint}ms)`);
    }
    if (analysis.metrics.largestContentfulPaint.avg > thresholds.largestContentfulPaint) {
      analysis.issues.push(`最大内容绘制时间(${analysis.metrics.largestContentfulPaint.avg}ms)超过阈值(${thresholds.largestContentfulPaint}ms)`);
    }
    if (analysis.metrics.firstInputDelay.avg > thresholds.firstInputDelay) {
      analysis.issues.push(`首次输入延迟(${analysis.metrics.firstInputDelay.avg}ms)超过阈值(${thresholds.firstInputDelay}ms)`);
    }
    if (analysis.metrics.cumulativeLayoutShift.avg > thresholds.cumulativeLayoutShift) {
      analysis.issues.push(`累积布局偏移(${analysis.metrics.cumulativeLayoutShift.avg})超过阈值(${thresholds.cumulativeLayoutShift})`);
    }

    // 计算趋势
    Object.keys(analysis.metrics).forEach(metric => {
      analysis.trends[metric] = data.map(item => this.getNestedValue(item, `performance.metrics.${metric}`));
    });

    return analysis;
  }

  // 获取用户行为分析
  getUserBehaviorAnalysis() {
    const data = this.getData();
    if (data.length === 0) return null;

    return {
      overview: {
        totalPageViews: data.reduce((sum, item) => sum + item.userBehavior.pageViews, 0),
        avgSessionDuration: data.reduce((sum, item) => sum + item.userBehavior.avgSessionDuration, 0) / data.length,
        bounceRate: data.reduce((sum, item) => sum + item.userBehavior.bounceRate, 0) / data.length,
      },
      topActions: this.aggregateTopActions(data),
      trends: {
        pageViews: data.map(item => item.userBehavior.pageViews),
        uniqueUsers: data.map(item => item.userBehavior.uniqueUsers),
      },
    };
  }

  // 获取错误分析
  getErrorAnalysis() {
    const data = this.getData();
    if (data.length === 0) return null;

    return {
      overview: {
        totalErrors: data.reduce((sum, item) => sum + item.errors.total, 0),
        uniqueErrors: data.reduce((sum, item) => sum + item.errors.unique, 0),
      },
      topErrors: this.aggregateTopErrors(data),
      trends: {
        errors: data.map(item => item.errors.total),
      },
    };
  }

  // 清理数据
  clearData() {
    this.data = [];
  }

  private aggregate() {
    const timestamp = Date.now();
    const networkStats = networkMonitorService.getStats();
    const resourceStats = resourceMonitorService.getStats();

    const aggregatedData: AggregatedData = {
      timestamp,
      performance: {
        metrics: this.getPerformanceMetrics(),
        resources: {
          totalCount: resourceStats.totalResources,
          totalSize: resourceStats.totalSize,
          avgLoadTime: resourceStats.averageDuration,
          warnings: this.aggregateResourceWarnings(resourceStats.warnings),
        },
        network: {
          totalRequests: networkStats.total,
          successRate: networkStats.success / networkStats.total * 100,
          avgResponseTime: networkStats.avgResponseTime,
          errorRate: networkStats.error / networkStats.total * 100,
          slowRequestCount: networkStats.slow,
        },
      },
      userBehavior: this.getUserBehaviorMetrics(),
      errors: this.getErrorMetrics(),
    };

    this.data.push(aggregatedData);

    // 限制数据量
    const maxDataPoints = 1000;
    if (this.data.length > maxDataPoints) {
      this.data = this.data.slice(-maxDataPoints);
    }
  }

  private getPerformanceMetrics() {
    const entries = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paintEntries = performance.getEntriesByType('paint');

    return {
      pageLoadTime: entries.loadEventEnd - entries.startTime,
      firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      largestContentfulPaint: this.getLargestContentfulPaint(),
      firstInputDelay: this.getFirstInputDelay(),
      cumulativeLayoutShift: this.getCumulativeLayoutShift(),
    };
  }

  private getUserBehaviorMetrics() {
    // 这里需要实现从 userBehaviorService 获取指标的逻辑
    return {
      pageViews: 0,
      uniqueUsers: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      topActions: [],
    };
  }

  private getErrorMetrics() {
    // 这里需要实现错误指标的收集逻辑
    return {
      total: 0,
      unique: 0,
      topErrors: [],
    };
  }

  private getLargestContentfulPaint(): number {
    let lcp = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      lcp = lastEntry.startTime;
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    return lcp;
  }

  private getFirstInputDelay(): number {
    let fid = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstInput = entries[0];
      fid = firstInput.processingStart - firstInput.startTime;
    });
    
    observer.observe({ entryTypes: ['first-input'] });
    return fid;
  }

  private getCumulativeLayoutShift(): number {
    let cls = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          cls += entry.value;
        }
      });
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    return cls;
  }

  private calculateMetricStats(data: AggregatedData[], metricPath: string) {
    const values = data.map(item => this.getNestedValue(item, metricPath)).filter(Boolean);
    if (values.length === 0) return { min: 0, max: 0, avg: 0 };

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / values.length,
    };
  }

  private getNestedValue(obj: any, path: string): number {
    return path.split('.').reduce((current, key) => current?.[key], obj) || 0;
  }

  private aggregateResourceWarnings(warnings: any[]): { type: string; message: string; count: number; }[] {
    const warningMap = new Map<string, number>();
    warnings.forEach(warning => {
      const key = `${warning.type}:${warning.message}`;
      warningMap.set(key, (warningMap.get(key) || 0) + 1);
    });

    return Array.from(warningMap.entries()).map(([key, count]) => {
      const [type, message] = key.split(':');
      return { type, message, count };
    });
  }

  private aggregateTopActions(data: AggregatedData[]) {
    const actionMap = new Map<string, number>();
    data.forEach(item => {
      item.userBehavior.topActions.forEach(action => {
        actionMap.set(action.type, (actionMap.get(action.type) || 0) + action.count);
      });
    });

    return Array.from(actionMap.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private aggregateTopErrors(data: AggregatedData[]) {
    const errorMap = new Map<string, { count: number; lastOccurred: number; }>();
    data.forEach(item => {
      item.errors.topErrors.forEach(error => {
        const existing = errorMap.get(error.message);
        if (!existing || error.lastOccurred > existing.lastOccurred) {
          errorMap.set(error.message, {
            count: (existing?.count || 0) + error.count,
            lastOccurred: error.lastOccurred,
          });
        }
      });
    });

    return Array.from(errorMap.entries())
      .map(([message, stats]) => ({
        message,
        count: stats.count,
        lastOccurred: stats.lastOccurred,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}

export const monitoringAggregator = new MonitoringAggregator(); 