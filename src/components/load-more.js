import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

// Mecanismo de despliegue a demanda compartido por todas las secciones.
// Cada sección decide cuántos items se ven al inicio (initial) y cuántos
// agrega cada clic (step). Si total <= initial, el botón no se renderiza:
// el mecanismo es un no-op para listas cortas. Para mostrar más, las
// secciones solo ajustan initial/step en su llamada a useLoadMore.
export const INITIAL_VISIBLE_COUNT = 4;
export const LOAD_MORE_STEP = 6;

export const useLoadMore = ({
  total = 0,
  initial = INITIAL_VISIBLE_COUNT,
  step = LOAD_MORE_STEP,
  resetKey,
}) => {
  const [visibleCount, setVisibleCount] = useState(initial);

  // Al cambiar los datos (fetch, caché) la vista vuelve a los primeros `initial`.
  useEffect(() => {
    setVisibleCount(initial);
  }, [resetKey, initial]);

  const remaining = Math.max(0, total - visibleCount);
  return {
    visibleCount,
    remaining,
    canLoadMore: remaining > 0,
    loadMore: () => setVisibleCount(count => Math.min(count + step, total)),
  };
};

export const LoadMoreButton = ({ remaining, onLoadMore, step = LOAD_MORE_STEP, shown, total }) => (
  <div className="mt-6 flex flex-col items-center gap-2">
    <button
      onClick={onLoadMore}
      className="text-xs font-mono font-bold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2 border border-primary/40 hover:border-primary px-4 py-2 hover:bg-primary/10"
    >
      <FontAwesomeIcon icon={faChevronDown} size="xs" />
      Cargar_Más (+{Math.min(step, remaining)})
    </button>
    <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
      Mostrando {shown} de {total}
    </p>
  </div>
);
