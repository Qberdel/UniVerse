import type { AuthUserPayload } from "./api";
import { parseAuthUserPayload, profileRequest } from "./api";

export type UserProfile = {
  name: string;
  university: string;
  specialty?: string;
  email: string;
  avatarDataUrl?: string;
};

const PROFILE_KEY = "universe:profile";

const DEFAULT_PROFILE: UserProfile = {
  name: "Пользователь",
  university: "—",
  email: "user@example.com",
};

/** Объединяет данные API с уже сохранённым профилем */
export function applyAuthUserToProfile(
  partial: AuthUserPayload,
  fallbackEmail?: string,
): UserProfile {
  const existing = getProfile();
  const next: UserProfile = {
    name: partial.name?.trim() || existing?.name || DEFAULT_PROFILE.name,
    university:
      partial.university?.trim() || existing?.university || DEFAULT_PROFILE.university,
    email:
      partial.email?.trim() ||
      fallbackEmail?.trim() ||
      existing?.email ||
      DEFAULT_PROFILE.email,
    avatarDataUrl: existing?.avatarDataUrl,
  };
  setProfile(next);
  return next;
}

/** После login: поля из ответа login + GET /profile */
export async function loadProfileFromApi(
  token: string,
  loginUser?: AuthUserPayload,
  fallbackEmail?: string,
): Promise<UserProfile> {
  let fields: AuthUserPayload = { ...loginUser };

  const profileRes = await profileRequest(token);
  if (profileRes.ok) {
    const fromProfile = parseAuthUserPayload(profileRes.data);
    fields = {
      name: fromProfile.name ?? fields.name,
      university: fromProfile.university ?? fields.university,
      email: fromProfile.email ?? fields.email,
    };
  }

  return applyAuthUserToProfile(fields, fallbackEmail);
}

export function getProfile(): UserProfile | null {
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setProfile(profile: UserProfile) {
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearProfile() {
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    // ignore
  }
}

