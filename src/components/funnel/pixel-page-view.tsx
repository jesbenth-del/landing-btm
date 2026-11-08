import { useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { trackPixelEvent } from "@/lib/pixel";

/**
 * El base code del pixel dispara el PageView de la primera carga y nada más:
 * las navegaciones del embudo son del lado del cliente, así que sin esto Meta
 * solo vería una vista por sesión y /procesando y /registro quedarían
 * invisibles.
 */
export function PixelPageView() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // El primer render ya lo cubrió el base code; no hay que duplicarlo.
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    trackPixelEvent("PageView");
  }, [pathname]);

  return null;
}
