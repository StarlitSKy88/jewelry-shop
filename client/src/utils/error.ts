interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string | null;
  type: 'error' | 'unhandledrejection' | 'react';
  timestamp: number;
  url: string;
  userAgent: string;
}

interface ErrorOptions {
  shouldCapture?: (error: Error) => boolean;
  maxErrors?: number;
  reportEndpoint?: string;
}

class ErrorMonitor {
  private errors: ErrorInfo[] = [];
  private options: Required<ErrorOptions>;

  constructor(options: ErrorOptions = {}) {
    this.options = {
      shouldCapture: () => true,
      maxErrors: 50,
      reportEndpoint: '/api/errors',
      ...options,
    };

    this.init();
  }

  private init(): void {
    // 捕获全局错误
    window.addEventListener('error', (event) => {
      this.captureError(event.error, 'error');
    });

    // 捕获未处理的Promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, 'unhandledrejection');
    });
  }

  public captureError(error: Error, type: ErrorInfo['type'] = 'error'): void {
    if (!this.options.shouldCapture(error)) {
      return;
    }

    if (this.errors.length >= this.options.maxErrors) {
      this.errors.shift();
    }

    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      type,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorInfo);
    this.reportError(errorInfo);
  }

  public captureReactError(error: Error, componentStack: string | null): void {
    const errorInfo: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack,
      type: 'react',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.errors.push(errorInfo);
    this.reportError(errorInfo);
  }

  private async reportError(error: ErrorInfo): Promise<void> {
    try {
      const response = await fetch(this.options.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });

      if (!response.ok) {
        console.error('Failed to report error:', error);
      }
    } catch (err) {
      console.error('Error reporting failed:', err);
    }
  }

  public getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
  }
}

export const errorMonitor = new ErrorMonitor(); 