const ONBOARDING_SEEN_KEY = "universe:onboardingSeen";

export function hasSeenOnboarding(): boolean {
  try {
    return window.localStorage.getItem(ONBOARDING_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOnboardingSeen(): void {
  try {
    window.localStorage.setItem(ONBOARDING_SEEN_KEY, "1");
  } catch {
    // ignore
  }
}

export function clearOnboardingSeen(): void {
  try {
    window.localStorage.removeItem(ONBOARDING_SEEN_KEY);
  } catch {
    // ignore
  }
}
