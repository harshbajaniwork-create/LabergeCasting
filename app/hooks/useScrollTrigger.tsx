import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollTriggerOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseScrollProgressOptions {
  startElement?: string; // CSS selector for start element
  endElement?: string;   // CSS selector for end element
}

export function useScrollTrigger(options: UseScrollTriggerOptions = {}) {
  const {
    threshold = 0,
    rootMargin = '0px',
    triggerOnce = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        
        if (isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isVisible };
}

export function useScrollProgress(options: UseScrollProgressOptions = {}) {
  const { startElement = '#about', endElement = 'body' } = options;
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const throttle = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    return (...args: any[]) => {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      const startEl = document.querySelector(startElement) as HTMLElement;
      const endEl = document.querySelector(endElement) as HTMLElement;
      
      if (!startEl || !endEl) return;

      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      
      // Start animation when about section reaches the top of viewport
      const startTrigger = startRect.top <= 0;
      
      if (!startTrigger) {
        setScrollProgress(0);
        setIsActive(false);
        return;
      }

      setIsActive(true);

      // Calculate total scrollable distance from start to end of page
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = documentHeight - viewportHeight;
      
      // Current scroll position
      const currentScroll = window.scrollY;
      
      // Start measuring from when about section hits top
      const aboutOffsetTop = startEl.offsetTop;
      const scrollFromStart = Math.max(0, currentScroll - aboutOffsetTop);
      const remainingScroll = maxScroll - aboutOffsetTop;
      
      // Calculate progress (0 to 1)
      const progress = Math.min(1, Math.max(0, scrollFromStart / remainingScroll));
      
      setScrollProgress(progress);
    };

    const throttledCalculateProgress = throttle(calculateProgress, 16); // ~60fps

    window.addEventListener('scroll', throttledCalculateProgress, { passive: true });
    window.addEventListener('resize', throttledCalculateProgress, { passive: true });
    
    // Initial calculation
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', throttledCalculateProgress);
      window.removeEventListener('resize', throttledCalculateProgress);
    };
  }, [startElement, endElement, throttle]);

  return { scrollProgress, isActive };
}
