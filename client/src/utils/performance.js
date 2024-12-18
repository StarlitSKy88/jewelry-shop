export const measurePerformance = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 100) {
      console.warn(`${componentName} took ${duration}ms to render`);
    }
  };
}; 