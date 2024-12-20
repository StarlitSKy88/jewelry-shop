import { userBehaviorConfig } from '../config/performance';

interface UserAction {
  type: string;
  target: string;
  timestamp: number;
  data?: Record<string, any>;
}

class UserBehaviorService {
  private actions: UserAction[] = [];
  private isTracking = false;

  // 开始追踪
  startTracking() {
    if (this.isTracking) return;
    this.isTracking = true;

    // 点击事件
    document.addEventListener('click', this.handleClick);
    // 表单事件
    document.addEventListener('submit', this.handleSubmit);
    // 输入事件
    document.addEventListener('input', this.handleInput);
    // 路由变化
    window.addEventListener('popstate', this.handleNavigation);
    // 页面离开
    window.addEventListener('beforeunload', this.handleUnload);
  }

  // 停止追踪
  stopTracking() {
    if (!this.isTracking) return;
    this.isTracking = false;

    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('submit', this.handleSubmit);
    document.removeEventListener('input', this.handleInput);
    window.removeEventListener('popstate', this.handleNavigation);
    window.removeEventListener('beforeunload', this.handleUnload);
  }

  // 处理点击事件
  private handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!this.shouldTrackElement(target)) return;

    this.trackAction({
      type: 'click',
      target: this.getElementPath(target),
      timestamp: Date.now(),
      data: {
        text: target.textContent?.trim(),
        className: target.className,
        id: target.id,
      },
    });
  };

  // 处理表单提交
  private handleSubmit = (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const data: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (!userBehaviorConfig.sensitiveFields.includes(key)) {
        data[key] = value;
      }
    });

    this.trackAction({
      type: 'submit',
      target: this.getElementPath(form),
      timestamp: Date.now(),
      data,
    });
  };

  // 处理输入事件
  private handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!this.shouldTrackElement(target)) return;

    // 防抖处理
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    this.debounceTimeout = setTimeout(() => {
      const isSensitive = userBehaviorConfig.sensitiveFields.some(
        field => target.name.includes(field) || target.id.includes(field)
      );

      this.trackAction({
        type: 'input',
        target: this.getElementPath(target),
        timestamp: Date.now(),
        data: {
          type: target.type,
          name: target.name,
          value: isSensitive ? '[FILTERED]' : target.value,
        },
      });
    }, userBehaviorConfig.dedupeInterval);
  };

  // 处理导航事件
  private handleNavigation = () => {
    this.trackAction({
      type: 'navigation',
      target: window.location.pathname,
      timestamp: Date.now(),
      data: {
        from: document.referrer,
        to: window.location.href,
      },
    });
  };

  // 处理页面卸载
  private handleUnload = () => {
    this.trackAction({
      type: 'unload',
      target: window.location.pathname,
      timestamp: Date.now(),
      data: {
        duration: performance.now(),
        unsavedChanges: this.hasUnsavedChanges(),
      },
    });

    // 同步发送数据
    this.flushActions(true);
  };

  // 记录行为
  private trackAction(action: UserAction) {
    if (!this.shouldSampleAction()) return;

    this.actions.push(action);

    // 达到最大记录数时自动发送
    if (this.actions.length >= userBehaviorConfig.maxLength) {
      this.flushActions();
    }
  }

  // 发送行为数据
  private async flushActions(isSync = false) {
    if (this.actions.length === 0) return;

    const actions = [...this.actions];
    this.actions = [];

    try {
      if (isSync) {
        // 使用同步 XMLHttpRequest
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/behavior', false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(actions));
      } else {
        // 使用异步请求
        await fetch('/api/behavior', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(actions),
        });
      }
    } catch (error) {
      console.error('Failed to send user behavior data:', error);
      // 失败时恢复数据
      this.actions = [...actions, ...this.actions];
    }
  }

  // 采样判断
  private shouldSampleAction(): boolean {
    return Math.random() < userBehaviorConfig.sampleRate;
  }

  // 判断是否应该追踪元素
  private shouldTrackElement(element: HTMLElement): boolean {
    // 忽略特定元素
    if (element.hasAttribute('data-no-track')) return false;
    
    // 检查是否在忽略列表中
    const ignoredTags = ['script', 'style', 'meta', 'link'];
    if (ignoredTags.includes(element.tagName.toLowerCase())) return false;

    return true;
  }

  // 获取元素路径
  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let current: HTMLElement | null = element;

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }

      path.unshift(selector);
      current = current.parentElement;
    }

    return path.join(' > ');
  }

  // 检查是否有未保存的更改
  private hasUnsavedChanges(): boolean {
    const forms = document.querySelectorAll('form');
    for (const form of forms) {
      const formData = new FormData(form as HTMLFormElement);
      const hasChanges = Array.from(formData.entries()).some(([_, value]) => value !== '');
      if (hasChanges) return true;
    }
    return false;
  }

  private debounceTimeout: NodeJS.Timeout | null = null;
}

export const userBehaviorService = new UserBehaviorService(); 