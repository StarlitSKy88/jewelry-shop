import prometheus from 'prom-client';
import responseTime from 'response-time';

// 创建指标
const httpRequestDurationMicroseconds = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'HTTP请求持续时间',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
});

const httpRequestsTotalCounter = new prometheus.Counter({
  name: 'http_requests_total',
  help: '总HTTP请求数',
  labelNames: ['method', 'route', 'status_code'],
});

// 监控中间件
export const monitoringMiddleware = responseTime((req, res, time) => {
  if (req.url !== '/metrics') {
    httpRequestDurationMicroseconds
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .observe(time);

    httpRequestsTotalCounter
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .inc();
  }
});

// 指标路由
export const metricsRoute = async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
}; 