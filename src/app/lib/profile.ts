import type { AuthUserPayload, UserProfile as ApiUserProfile } from "./api";
import {
  fetchCurrentUserRequest,
  fetchUserProfileRequest,
  parseAuthUserPayload,
  profileRequest,
  resolveAvatarUrl,
} from "./api";

export type UserProfile = {
  userId?: number;
  name: string;
  university: string;
  specialty?: string;
  email: string;
  avatarDataUrl?: string;
  personalPoints?: number;
  universityRank?: number;
  universityStudents?: number;
};

const PROFILE_KEY = "universe:profile";
const PROFILE_UPDATED_EVENT = "universe-profile-updated";

const DEFAULT_PROFILE: UserProfile = {
  name: "Пользователь",
  university: "—",
  email: "user@example.com",
};

function apiProfileToLocal(profile: ApiUserProfile, email?: string): UserProfile {
  const name =
    [profile.lastname, profile.firstname].filter(Boolean).join(" ").trim() ||
    DEFAULT_PROFILE.name;

  return {
    userId: profile.user_id,
    name,
    university: profile.university_name?.trim() || DEFAULT_PROFILE.university,
    specialty: profile.speciality_name?.trim(),
    email: email?.trim() || DEFAULT_PROFILE.email,
    avatarDataUrl: resolveAvatarUrl(profile.avatar),
    personalPoints: profile.personal_points,
    universityRank: profile.university_rank,
    universityStudents: profile.university_students,
  };
}

/** Объединяет данные API с уже сохранённым профилем */
export function applyAuthUserToProfile(
  partial: AuthUserPayload,
  fallbackEmail?: string,
): UserProfile {
  const existing = getProfile();
  const name =
    partial.name?.trim() ||
    [partial.lastname, partial.firstname].filter(Boolean).join(" ").trim() ||
    existing?.name ||
    DEFAULT_PROFILE.name;

  const next: UserProfile = {
    userId: partial.user_id ?? existing?.userId,
    name,
    university:
      partial.university?.trim() || existing?.university || DEFAULT_PROFILE.university,
    specialty: partial.speciality_name?.trim() || existing?.specialty,
    email:
      partial.email?.trim() ||
      fallbackEmail?.trim() ||
      existing?.email ||
      DEFAULT_PROFILE.email,
    avatarDataUrl:
      resolveAvatarUrl(partial.avatar) || existing?.avatarDataUrl,
    personalPoints: partial.personal_points ?? existing?.personalPoints,
    universityRank: existing?.universityRank,
    universityStudents: existing?.universityStudents,
  };
  setProfile(next);
  return next;
}

/** После login: поля из ответа login + GET /profile и /user */
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
      user_id: fromProfile.user_id ?? fields.user_id,
      name: fromProfile.name ?? fields.name,
      firstname: fromProfile.firstname ?? fields.firstname,
      lastname: fromProfile.lastname ?? fields.lastname,
      university: fromProfile.university ?? fields.university,
      speciality_name: fromProfile.speciality_name ?? fields.speciality_name,
      email: fromProfile.email ?? fields.email,
      avatar: fromProfile.avatar ?? fields.avatar,
      personal_points: fromProfile.personal_points ?? fields.personal_points,
    };
  }

  const userRes = await fetchCurrentUserRequest(token);
  if (userRes.ok && userRes.data) {
    const user = userRes.data;
    fields = {
      ...fields,
      user_id: user.user_id,
      firstname: user.firstname,
      lastname: user.lastname,
      name: [user.lastname, user.firstname].filter(Boolean).join(" "),
      avatar: user.avatar ?? fields.avatar,
      personal_points: user.personal_points,
    };
  }

  const base = applyAuthUserToProfile(fields, fallbackEmail);

  if (base.userId != null) {
    const fullProfileRes = await fetchUserProfileRequest(token, base.userId);
    if (fullProfileRes.ok && fullProfileRes.data) {
      const full = apiProfileToLocal(fullProfileRes.data, base.email);
      setProfile(full);
      return full;
    }
  }

  return base;
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
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

export function getPersonalPoints(): number {
  return getProfile()?.personalPoints ?? 0;
}

export function deductPersonalPoints(amount: number): boolean {
  if (amount <= 0) return true;
  const profile = getProfile();
  const current = profile?.personalPoints ?? 0;
  if (!profile || current < amount) return false;

  setProfile({ ...profile, personalPoints: current - amount });
  return true;
}

export function subscribeProfileUpdated(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(PROFILE_UPDATED_EVENT, handler);
  return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handler);
}

export function clearProfile() {
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    // ignore
  }
}
