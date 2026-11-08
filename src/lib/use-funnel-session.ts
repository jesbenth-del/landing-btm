
import { useMemo, useSyncExternalStore } from "react";

import {
  FUNNEL_SESSION_KEY,
  parseFunnelSession,
  subscribeToFunnelSession,
  type FunnelSession,
} from "./funnel-session";

const getRawSnapshot = () => {
  try {
    return window.sessionStorage.getItem(FUNNEL_SESSION_KEY);
  } catch {
    return null;
  }
};
const getServerSnapshot = () => null;

const subscribeToHydration = () => () => undefined;

export interface UseFunnelSessionResult {
  session: FunnelSession | null;
  /** En el primer render (servidor e hidratación) todavía no se puede leer sessionStorage. */
  isReady: boolean;
}

export function useFunnelSession(): UseFunnelSessionResult {
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const raw = useSyncExternalStore(
    subscribeToFunnelSession,
    getRawSnapshot,
    getServerSnapshot,
  );

  const session = useMemo(() => parseFunnelSession(raw), [raw]);

  return { session, isReady };
}
