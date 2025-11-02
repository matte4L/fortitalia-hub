import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
  className?: string;
}

const ScrollReveal = ({ 
  children, 
  delay = 0, 
  direction = 'up',
  className = '' 
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollAnimation({ 
    threshold: 0.15,
    delay,
    rootMargin: '0px 0px -80px 0px'
  });

  const getDirectionClass = () => {
    switch (direction) {
      case 'left':
        return isVisible ? 'scroll-visible-left' : 'scroll-hidden-left';
      case 'right':
        return isVisible ? 'scroll-visible-right' : 'scroll-hidden-right';
      case 'scale':
        return isVisible ? 'scroll-visible-scale' : 'scroll-hidden-scale';
      case 'up':
      default:
        return isVisible ? 'scroll-visible' : 'scroll-hidden';
    }
  };

  return (
    <div ref={ref} className={`${getDirectionClass()} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal;
