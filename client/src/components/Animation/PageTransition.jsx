import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { animations } from '../../utils/animation';

const PageTransition = ({
  children,
  enterAnimation = 'fadeIn',
  exitAnimation = 'fadeOut',
  duration = '0.3s',
  timingFunction = 'ease',
}) => {
  const location = useLocation();
  const [isExiting, setIsExiting] = useState(false);
  const [currentChildren, setCurrentChildren] = useState(children);

  useEffect(() => {
    if (children !== currentChildren) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setCurrentChildren(children);
        setIsExiting(false);
      }, parseFloat(duration) * 1000);
      return () => clearTimeout(timer);
    }
  }, [children, currentChildren, duration]);

  const getAnimationStyle = () => {
    const animation = isExiting ? exitAnimation : enterAnimation;
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
        animationDuration: duration,
        animationTimingFunction: timingFunction,
        minHeight: '100vh',
      }}
    >
      {currentChildren}
    </Box>
  );
};

export default PageTransition; 