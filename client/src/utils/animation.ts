import { keyframes } from '@emotion/react';

// 淡入效果
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// 淡出效果
export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

// 从下滑入
export const slideInFromBottom = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// 从上滑入
export const slideInFromTop = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// 从左滑入
export const slideInFromLeft = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// 从右滑入
export const slideInFromRight = keyframes`
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// 缩放进入
export const zoomIn = keyframes`
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

// 弹跳效果
export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

// 旋转效果
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 脉冲效果
export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// 摇晃效果
export const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

// 创建动画样式
export const createAnimation = (animation, duration = '0.3s', delay = '0s', timingFunction = 'ease') => ({
  animation: `${animation} ${duration} ${timingFunction} ${delay}`,
});

// 创建过渡效果
export const createTransition = (properties = ['all'], duration = '0.3s', timingFunction = 'ease') => ({
  transition: properties.map(prop => `${prop} ${duration} ${timingFunction}`).join(', '),
});

// 常用动画组合
export const animations = {
  fadeIn: createAnimation(fadeIn),
  fadeOut: createAnimation(fadeOut),
  slideInFromBottom: createAnimation(slideInFromBottom),
  slideInFromTop: createAnimation(slideInFromTop),
  slideInFromLeft: createAnimation(slideInFromLeft),
  slideInFromRight: createAnimation(slideInFromRight),
  zoomIn: createAnimation(zoomIn),
  bounce: createAnimation(bounce, '1s', '0s', 'ease-in-out'),
  rotate: createAnimation(rotate, '1s', '0s', 'linear'),
  pulse: createAnimation(pulse, '1s', '0s', 'ease-in-out'),
  shake: createAnimation(shake, '0.5s', '0s', 'ease-in-out'),
}; 