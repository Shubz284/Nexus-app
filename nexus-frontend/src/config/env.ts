export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ??
  (import.meta.env.DEV ? "http://localhost:3000" : "");

export const APP_URL =
  import.meta.env.VITE_APP_URL ?? window.location.origin;
