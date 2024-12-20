import { useState, useEffect, useCallback, useRef } from 'react';

interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  onComplete?: () => void;
}

interface AnimationState {
  isAnimating: boolean;
  progress: number;
}

interface KeyframeConfig {
  [key: string]: string | number;
}

interface AnimationKeyframes {
  from: KeyframeConfig;
  to: KeyframeConfig;
}

export const useAnimation = (config: AnimationConfig = {}) => {
  const {
    duration = 300,
    delay = 0,
    easing = 'ease',
    onComplete,
  } = config;

  const [state, setState] = useState<AnimationState>({
    isAnimating: false,
    progress: 0,
  });

  const elementRef = useRef<HTMLElement | null>(null);
  const animationRef = useRef<Animation | null>(null);

  // 停止当前动画
  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }
    setState({ isAnimating: false, progress: 0 });
  }, []);

  // 执行动画
  const animate = useCallback(
    (keyframes: AnimationKeyframes, customConfig: AnimationConfig = {}) => {
      if (!elementRef.current) return;

      // 停止当前动画
      stopAnimation();

      // 合并配置
      const mergedConfig = {
        duration,
        delay,
        easing,
        ...customConfig,
      };

      // 创建关键帧数组
      const keyframeEffect = new KeyframeEffect(
        elementRef.current,
        [keyframes.from, keyframes.to],
        {
          duration: mergedConfig.duration,
          delay: mergedConfig.delay,
          easing: mergedConfig.easing,
          fill: 'forwards',
        }
      );

      // 创建动画
      const animation = new Animation(keyframeEffect);

      // 更新状态和引用
      setState({ isAnimating: true, progress: 0 });
      animationRef.current = animation;

      // 监听动画进度
      animation.onfinish = () => {
        setState({ isAnimating: false, progress: 1 });
        mergedConfig.onComplete?.();
      };

      animation.oncancel = () => {
        setState({ isAnimating: false, progress: 0 });
      };

      // 开始动画
      animation.play();
    },
    [duration, delay, easing, onComplete, stopAnimation]
  );

  // 淡入动画
  const fadeIn = useCallback(
    (options: AnimationConfig = {}) => {
      animate(
        {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        options
      );
    },
    [animate]
  );

  // 淡出动画
  const fadeOut = useCallback(
    (options: AnimationConfig = {}) => {
      animate(
        {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        options
      );
    },
    [animate]
  );

  // 滑入动画
  const slideIn = useCallback(
    (direction: 'left' | 'right' | 'top' | 'bottom', options: AnimationConfig = {}) => {
      const directionMap = {
        left: { transform: ['translateX(-100%)', 'translateX(0)'] },
        right: { transform: ['translateX(100%)', 'translateX(0)'] },
        top: { transform: ['translateY(-100%)', 'translateY(0)'] },
        bottom: { transform: ['translateY(100%)', 'translateY(0)'] },
      };

      animate(
        {
          from: { transform: directionMap[direction].transform[0] },
          to: { transform: directionMap[direction].transform[1] },
        },
        options
      );
    },
    [animate]
  );

  // 缩放动画
  const scale = useCallback(
    (from: number, to: number, options: AnimationConfig = {}) => {
      animate(
        {
          from: { transform: `scale(${from})` },
          to: { transform: `scale(${to})` },
        },
        options
      );
    },
    [animate]
  );

  // 旋转动画
  const rotate = useCallback(
    (from: number, to: number, options: AnimationConfig = {}) => {
      animate(
        {
          from: { transform: `rotate(${from}deg)` },
          to: { transform: `rotate(${to}deg)` },
        },
        options
      );
    },
    [animate]
  );

  // 清理函数
  useEffect(() => {
    return () => {
      stopAnimation();
    };
  }, [stopAnimation]);

  return {
    elementRef,
    isAnimating: state.isAnimating,
    progress: state.progress,
    animate,
    stopAnimation,
    fadeIn,
    fadeOut,
    slideIn,
    scale,
    rotate,
  };
}; 