import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

// Fade up element when it enters viewport
export function FadeIn({ children, className = '', delay = 0, duration = 0.6, y = 30 }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(ref.current); } },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children appearing one after another
export function StaggerContainer({ children, className = '', stagger = 0.1, delay = 0 }) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(ref.current); } },
      { threshold: 0.05 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

// Stagger child item
export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale up on hover
export function HoverScale({ children, className = '', scale = 1.03 }) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

// Animated counter
export function AnimatedCounter({ value, duration = 1.5, className = '' }) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(ref.current); } },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, '')) : value;
    if (isNaN(numericValue)) { setCount(value); return; }

    let start = 0;
    const step = Math.ceil(numericValue / (duration * 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= numericValue) { setCount(numericValue); clearInterval(timer); }
      else { setCount(start); }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [inView, value, duration]);

  const suffix = typeof value === 'string' ? value.replace(/[0-9,]/g, '') : '';

  return (
    <span ref={ref} className={className}>
      {typeof count === 'number' ? count.toLocaleString() + suffix : count}
    </span>
  );
}

// Smooth slide from left/right
export function SlideIn({ children, className = '', direction = 'left', delay = 0 }) {
  const x = direction === 'left' ? -60 : 60;
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(ref.current); } },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
