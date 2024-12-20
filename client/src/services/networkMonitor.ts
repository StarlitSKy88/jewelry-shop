import { networkConfig } from '../config/performance';

interface NetworkRequest {
  url: string;
  method: string;
  startTime: number;
  endTime?: number;
  status?: number;
  error?: string;
  retryCount?: number;
}

class NetworkMonitorService {
  private requests: Map<string, NetworkRequest> = new Map();
  private isMonitoring = false;

  // 开始监控
  startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // 监听 fetch 请求
    this.interceptFetch();
    // 监听 XMLHttpRequest
    this.interceptXHR();
  }

  // 停止监控
  stopMonitoring() {
    if (!this.isMonitoring) return;
    this.isMonitoring = false;
    // 恢复原始方法
    window.fetch = this.originalFetch;
    XMLHttpRequest.prototype.open = this.originalXHROpen;
    XMLHttpRequest.prototype.send = this.originalXHRSend;
  }

  // 获取请求统计
  getStats() {
    const stats = {
      total: this.requests.size,
      success: 0,
      error: 0,
      slow: 0,
      avgResponseTime: 0,
      totalResponseTime: 0,
      statusCodes: {} as Record<number, number>,
    };

    this.requests.forEach(request => {
      if (!request.endTime) return;

      const duration = request.endTime - request.startTime;
      stats.totalResponseTime += duration;

      if (request.error) {
        stats.error++;
      } else {
        stats.success++;
        if (request.status) {
          stats.statusCodes[request.status] = (stats.statusCodes[request.status] || 0) + 1;
        }
        if (duration > networkConfig.slowRequestTime) {
          stats.slow++;
        }
      }
    });

    if (stats.total > 0) {
      stats.avgResponseTime = stats.totalResponseTime / stats.total;
    }

    return stats;
  }

  // 清理请求记录
  clearRequests() {
    this.requests.clear();
  }

  private originalFetch = window.fetch;
  private originalXHROpen = XMLHttpRequest.prototype.open;
  private originalXHRSend = XMLHttpRequest.prototype.send;

  // 拦截 fetch 请求
  private interceptFetch() {
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method || 'GET';
      const requestId = `${method}:${url}:${Date.now()}`;

      this.requests.set(requestId, {
        url,
        method,
        startTime: Date.now(),
      });

      try {
        const response = await this.retryFetch(input, init, requestId);
        this.updateRequest(requestId, {
          endTime: Date.now(),
          status: response.status,
        });
        return response;
      } catch (error) {
        this.updateRequest(requestId, {
          endTime: Date.now(),
          error: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    };
  }

  // 拦截 XMLHttpRequest
  private interceptXHR() {
    XMLHttpRequest.prototype.open = function(
      method: string,
      url: string | URL,
      async: boolean = true,
      username?: string | null,
      password?: string | null
    ) {
      const requestId = `${method}:${url}:${Date.now()}`;
      this.__requestId = requestId;
      this.__networkMonitor = {
        url: url.toString(),
        method,
        startTime: Date.now(),
      };
      return NetworkMonitorService.prototype.originalXHROpen.call(
        this,
        method,
        url,
        async,
        username,
        password
      );
    };

    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
      const requestId = this.__requestId;
      if (requestId) {
        const monitor = this.__networkMonitor;
        NetworkMonitorService.prototype.requests.set(requestId, monitor);

        this.addEventListener('load', () => {
          NetworkMonitorService.prototype.updateRequest(requestId, {
            endTime: Date.now(),
            status: this.status,
          });
        });

        this.addEventListener('error', () => {
          NetworkMonitorService.prototype.updateRequest(requestId, {
            endTime: Date.now(),
            error: 'Network error',
          });
        });

        this.addEventListener('timeout', () => {
          NetworkMonitorService.prototype.updateRequest(requestId, {
            endTime: Date.now(),
            error: 'Timeout',
          });
        });
      }
      return NetworkMonitorService.prototype.originalXHRSend.call(this, body);
    };
  }

  // 重试机制
  private async retryFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
    requestId?: string,
    retryCount = 0
  ): Promise<Response> {
    try {
      const response = await this.originalFetch(input, init);
      
      // 检查是否需要重试
      if (
        networkConfig.retry.statusCodes.includes(response.status) &&
        retryCount < networkConfig.retry.maxRetries
      ) {
        await new Promise(resolve => 
          setTimeout(resolve, networkConfig.retry.retryDelay * Math.pow(2, retryCount))
        );
        if (requestId) {
          this.updateRequest(requestId, { retryCount: retryCount + 1 });
        }
        return this.retryFetch(input, init, requestId, retryCount + 1);
      }

      return response;
    } catch (error) {
      if (retryCount < networkConfig.retry.maxRetries) {
        await new Promise(resolve => 
          setTimeout(resolve, networkConfig.retry.retryDelay * Math.pow(2, retryCount))
        );
        if (requestId) {
          this.updateRequest(requestId, { retryCount: retryCount + 1 });
        }
        return this.retryFetch(input, init, requestId, retryCount + 1);
      }
      throw error;
    }
  }

  // 更新请求记录
  private updateRequest(requestId: string, update: Partial<NetworkRequest>) {
    const request = this.requests.get(requestId);
    if (request) {
      this.requests.set(requestId, { ...request, ...update });
    }
  }
}

// 扩展 XMLHttpRequest 类型
declare global {
  interface XMLHttpRequest {
    __requestId?: string;
    __networkMonitor?: NetworkRequest;
  }
}

export const networkMonitorService = new NetworkMonitorService(); 