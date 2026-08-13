import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-sm border border-primary/50 bg-[#0d0d14]/90 backdrop-blur-md text-primary shadow-[0_0_15px_rgba(0,255,65,0.25)] hover:bg-primary hover:text-[#0d0d14] hover:-translate-y-0.5 active:scale-95 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
        visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-2'
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      <FontAwesomeIcon icon={faArrowUp} size="sm" aria-hidden="true" />
    </button>
  );
};
