const REGISTERED_KEY = "universe:isRegistered";
const TOKEN_COOKIE_KEY = "universe_token";
const TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((p) => p.trim());
  const match = parts.find((p) => p.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

export function isRegistered(): boolean {
  try {
    return window.localStorage.getItem(REGISTERED_KEY) === "1" || !!getAuthToken();
  } catch {
    return false;
  }
}

export function setRegistered(value: boolean) {
  try {
    window.localStorage.setItem(REGISTERED_KEY, value ? "1" : "0");
  } catch {
    // ignore
  }
}

export function clearAuth() {
  setRegistered(false);
  clearAuthToken();
}

export function setAuthToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE_KEY}=${encodeURIComponent(token)}; Max-Age=${TOKEN_MAX_AGE_SECONDS}; Path=/; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  return readCookie(TOKEN_COOKIE_KEY);
}

export function clearAuthToken() {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE_KEY}=; Max-Age=0; Path=/; SameSite=Lax`;
}

