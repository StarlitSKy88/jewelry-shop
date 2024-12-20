interface PrefetchOptions {
  priority?: 'high' | 'low';
  type?: 'image' | 'style' | 'script';
}

class PrefetchManager {
  private prefetchedUrls: Set<string> = new Set();
  private observer: IntersectionObserver;
  private loadingUrls: Set<string> = new Set();

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            const url = element.dataset.prefetch;
            if (url) {
              this.prefetch(url);
            }
            this.observer.unobserve(element);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );
  }

  public prefetch(url: string, options: PrefetchOptions = {}): void {
    if (this.prefetchedUrls.has(url) || this.loadingUrls.has(url)) {
      return;
    }

    const { type = 'image' } = options;

    switch (type) {
      case 'image':
        this.prefetchImage(url);
        break;
      case 'style':
        this.prefetchStyle(url);
        break;
      case 'script':
        this.prefetchScript(url);
        break;
    }

    this.loadingUrls.add(url);
  }

  private prefetchImage(url: string): void {
    const img = new Image();
    img.onload = () => {
      this.prefetchedUrls.add(url);
      this.loadingUrls.delete(url);
    };
    img.onerror = () => {
      this.loadingUrls.delete(url);
    };
    img.src = url;
  }

  private prefetchStyle(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'style';
    link.href = url;
    link.onload = () => {
      this.prefetchedUrls.add(url);
      this.loadingUrls.delete(url);
    };
    link.onerror = () => {
      this.loadingUrls.delete(url);
    };
    document.head.appendChild(link);
  }

  private prefetchScript(url: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'script';
    link.href = url;
    link.onload = () => {
      this.prefetchedUrls.add(url);
      this.loadingUrls.delete(url);
    };
    link.onerror = () => {
      this.loadingUrls.delete(url);
    };
    document.head.appendChild(link);
  }

  public observe(element: HTMLElement): void {
    this.observer.observe(element);
  }

  public disconnect(): void {
    this.observer.disconnect();
    this.prefetchedUrls.clear();
    this.loadingUrls.clear();
  }
}

export const prefetchManager = new PrefetchManager(); 