
import { useEffect, useRef, useState } from "react";

export interface UseInViewResult<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  inView: boolean;
}

/**
 * Arranca en `true` (visible), igual al HTML que ya entrega el servidor, y
 * solo pasa a `false` si al montar se comprueba que el elemento está fuera de
 * pantalla — así el contenido nunca queda invisible si el JS falla o tarda en
 * hidratar, y no hay mismatch de hidratación entre servidor y cliente.
 */
export function useInView<T extends HTMLElement>(): UseInViewResult<T> {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) return;

    setInView(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
