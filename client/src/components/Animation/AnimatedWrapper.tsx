import { Box } from '@mui/material';
import { animations } from '../../utils/animation';

const AnimatedWrapper = ({
  children,
  animation = 'fadeIn',
  duration,
  delay,
  timingFunction,
  sx = {},
  ...props
}) => {
  // 获取动画样式
  const getAnimationStyle = () => {
    if (typeof animation === 'string' && animations[animation]) {
      return animations[animation];
    }
    if (typeof animation === 'object') {
      return animation;
    }
    return animations.fadeIn;
  };

  return (
    <Box
      sx={{
        ...getAnimationStyle(),
        ...(duration && { animationDuration: duration }),
        ...(delay && { animationDelay: delay }),
        ...(timingFunction && { animationTimingFunction: timingFunction }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AnimatedWrapper; 