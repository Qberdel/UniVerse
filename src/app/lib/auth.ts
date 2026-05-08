const REGISTERED_KEY = "universe:isRegistered";

export function isRegistered(): boolean {
  try {
    return window.localStorage.getItem(REGISTERED_KEY) === "1";
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
}

