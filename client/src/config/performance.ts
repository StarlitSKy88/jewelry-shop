import type { PerformanceConfig } from '../types/performance';

export const defaultPerformanceConfig: PerformanceConfig = {
  collectionInterval: 5 * 60 * 1000, // 5分钟
  sampleRate: 1, // 100%采样
  maxErrors: 100, // 最多存储100条错误记录
  ignoreUrls: [
    // 忽略的资源URL
    '/analytics',
    '/metrics',
    '/favicon.ico',
    '*.gif',
    '*.png',
    '*.jpg',
    '*.jpeg',
  ],
  customMetrics: [
    // 自定义指标
    'userInteraction',
    'resourceTiming',
    'networkInformation',
    'memoryUsage',
  ],
};

// 性能指标阈值
export const performanceThresholds = {
  pageLoadTime: 3000, // 3秒
  firstContentfulPaint: 1000, // 1秒
  largestContentfulPaint: 2500, // 2.5秒
  firstInputDelay: 100, // 100毫秒
  cumulativeLayoutShift: 0.1, // 0.1
  totalBlockingTime: 300, // 300毫秒
};

// 资源类型配置
export const resourceConfig = {
  // 需要监控的资源类型
  types: ['script', 'css', 'fetch', 'xmlhttprequest', 'img', 'font'],
  // 资源加载超时时间
  timeout: 10000, // 10秒
  // 资源大小警告阈值（字节）
  sizeThreshold: {
    script: 500 * 1024, // 500KB
    css: 100 * 1024, // 100KB
    img: 1024 * 1024, // 1MB
    font: 100 * 1024, // 100KB
  },
};

// 错误监控配置
export const errorConfig = {
  // 错误类型
  types: ['error', 'unhandledrejection', 'console'],
  // 需要记录的控制台级别
  consoleLevel: ['error', 'warn'],
  // 错误采样率
  sampleRate: 1,
  // 错误去重时间窗口
  dedupeInterval: 1000, // 1秒
  // 错误信息最大长度
  maxMessageLength: 500,
  // 错误堆栈最大长度
  maxStackLength: 1000,
};

// 网络监控配置
export const networkConfig = {
  // 请求超时时间
  timeout: 10000,
  // 慢请求阈值
  slowRequestTime: 2000,
  // 需要监控的状态码
  statusCodes: [400, 401, 403, 404, 500, 502, 503, 504],
  // 重试配置
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    statusCodes: [408, 500, 502, 503, 504],
  },
};

// 用户行为监控配置
export const userBehaviorConfig = {
  // 记录用户行为类型
  types: ['click', 'input', 'change', 'submit', 'navigation'],
  // 行为采样率
  sampleRate: 0.1, // 10%采样
  // 行为去重时间窗口
  dedupeInterval: 500, // 0.5秒
  // 敏感信息过滤
  sensitiveFields: ['password', 'token', 'credit_card'],
  // 最大记录长度
  maxLength: 100,
};

// 导出所有配置
export const performanceConfig = {
  default: defaultPerformanceConfig,
  thresholds: performanceThresholds,
  resource: resourceConfig,
  error: errorConfig,
  network: networkConfig,
  userBehavior: userBehaviorConfig,
}; 