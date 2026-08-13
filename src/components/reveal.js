import React, { useEffect, useRef, useState } from 'react';

const Reveal = ({ children, className = '', delay = 0, as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
