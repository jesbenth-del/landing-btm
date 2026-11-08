import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

/** IP y User-Agent de quien hace la petición, para la Conversions API. */
export const requestContext = () => ({
  ipAddress: getRequestIP({ xForwardedFor: true }) ?? undefined,
  userAgent: getRequestHeader("user-agent") ?? undefined,
});
