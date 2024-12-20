interface Event {
  type: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  url: string;
  userAgent: string;
}

interface TrackerOptions {
  maxEvents?: number;
  reportEndpoint?: string;
  reportInterval?: number;
  shouldTrack?: (event: Event) => boolean;
}

class Tracker {
  private events: Event[] = [];
  private options: Required<TrackerOptions>;
  private reportTimer: number | null = null;

  constructor(options: TrackerOptions = {}) {
    this.options = {
      maxEvents: 100,
      reportEndpoint: '/api/events',
      reportInterval: 5000,
      shouldTrack: () => true,
      ...options,
    };

    this.init();
  }

  private init(): void {
    // 追踪页面浏览
    this.trackPageView();

    // 追踪点击事件
    document.addEventListener('click', this.handleClick);

    // 追踪路由变化
    window.addEventListener('popstate', () => this.trackPageView());

    // 定时上报
    this.startReporting();
  }

  private handleClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    if (!target) return;

    // 获取最近的可点击元素
    const clickable = target.closest('button, a, [role="button"]');
    if (!clickable) return;

    const label = clickable.getAttribute('data-track-label') || clickable.textContent?.trim();
    if (!label) return;

    this.track('click', 'interaction', label);
  };

  private trackPageView(): void {
    this.track('pageview', 'navigation', window.location.pathname);
  }

  public track(type: string, category: string, label?: string, value?: number): void {
    const event: Event = {
      type,
      category,
      label,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    if (!this.options.shouldTrack(event)) {
      return;
    }

    if (this.events.length >= this.options.maxEvents) {
      this.events.shift();
    }

    this.events.push(event);
  }

  private startReporting(): void {
    if (this.reportTimer !== null) {
      return;
    }

    this.reportTimer = window.setInterval(() => {
      this.reportEvents();
    }, this.options.reportInterval);
  }

  private stopReporting(): void {
    if (this.reportTimer !== null) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
  }

  private async reportEvents(): Promise<void> {
    if (this.events.length === 0) {
      return;
    }

    const eventsToReport = [...this.events];
    this.events = [];

    try {
      const response = await fetch(this.options.reportEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventsToReport),
      });

      if (!response.ok) {
        console.error('Failed to report events:', eventsToReport);
        // 重新添加未成功上报的事件
        this.events.push(...eventsToReport);
      }
    } catch (error) {
      console.error('Event reporting failed:', error);
      // 重新添加未成功上报的事件
      this.events.push(...eventsToReport);
    }
  }

  public getEvents(): Event[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  public destroy(): void {
    this.stopReporting();
    document.removeEventListener('click', this.handleClick);
    this.events = [];
  }
}

export const tracker = new Tracker(); 