import { Children } from 'react';
import AnimatedWrapper from './AnimatedWrapper';

const AnimatedList = ({
  children,
  animation = 'fadeIn',
  stagger = 0.1,
  duration = '0.3s',
  baseDelay = '0s',
  timingFunction = 'ease',
  ...props
}) => {
  return Children.map(children, (child, index) => {
    if (!child) return null;

    const delay = `${parseFloat(baseDelay) + index * stagger}s`;

    return (
      <AnimatedWrapper
        animation={animation}
        duration={duration}
        delay={delay}
        timingFunction={timingFunction}
        {...props}
      >
        {child}
      </AnimatedWrapper>
    );
  });
};

export default AnimatedList; 