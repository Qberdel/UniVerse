export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("Не задан VITE_API_BASE_URL");
  }
  return API_BASE_URL;
}

function apiPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.startsWith("/api/") ? normalized : `/api${normalized}`;
}

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type RegistrationOption = {
  id: number;
  name: string;
  university_id?: number;
};

export type RegistrationOptionsData = {
  universities: RegistrationOption[];
  specialities: RegistrationOption[];
};

export type RegisterPayload = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  university_id: number;
  speciality_id: number;
};

export type AuthUserPayload = {
  user_id?: number;
  name?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  university?: string;
  university_id?: number;
  speciality_name?: string;
  email?: string;
  avatar?: string;
  personal_points?: number;
};

export type LoginResponseData = {
  token: string;
  user: AuthUserPayload;
};

export type UserBasic = {
  user_id: number;
  firstname: string;
  lastname: string;
  avatar?: string;
  personal_points: number;
};

export type UserActivity = {
  activity_id: number;
  category_id: number;
  name: string;
  description?: string;
  status: number;
  status_text: string;
  points_awarded?: number;
  created_at?: string;
  report_time?: string;
  images?: string[];
};

export type MonthlyHistory = {
  month: string;
  points_received: number;
  activities_count: number;
};

export type UserProfile = {
  user_id: number;
  firstname: string;
  lastname: string;
  avatar?: string;
  personal_points: number;
  university_id?: number;
  university_name?: string;
  speciality_id?: number;
  speciality_name?: string;
  university_points?: number;
  university_rank?: number;
  university_students?: number;
  activities?: UserActivity[];
  monthly_history?: MonthlyHistory[];
};

export type RatingUniversity = {
  university_id: number;
  name: string;
  activity_points: number;
  region?: string;
  students_count?: number;
  avg_points?: number;
  points_change?: number;
  rank?: number;
  specialities?: { speciality_id: number; name: string }[];
};

export type RatingResponse = {
  page: number;
  limit: number;
  universities: RatingUniversity[];
};

export type SpecialityStats = {
  speciality_id: number;
  name: string;
  students_count?: number;
  total_points?: number;
  accepted_activities?: number;
};

export type MonthlyStats = {
  month: string;
  points_received: number;
  accepted_activities?: number;
};

export type UniversityDetails = {
  university_id: number;
  name: string;
  region?: string;
  activity_points: number;
  students_count?: number;
  avg_points?: number;
  avg_points_per_activity?: number;
  monthly_activities?: number;
  accepted_activities?: number;
  rejected_activities?: number;
  points_change?: number;
  specialities?: SpecialityStats[];
  monthly_dynamics?: MonthlyStats[];
};

export type StoreItem = {
  item_id: number;
  name: string;
  description?: string;
  value: number;
  stock?: number;
  image_url?: string;
  categories?: string[];
  university_id?: number;
  university_name?: string;
  created_at?: string;
};

export type AdminActivity = {
  activity_id: number;
  user_id: number;
  user_name: string;
  university_id: number;
  university_name: string;
  category_id: number;
  name: string;
  description?: string;
  status: number;
  status_text: string;
  points_awarded?: number;
  created_at?: string;
  report_time?: string;
  updated_at?: string;
  images?: string[];
};

type LoginPayload = {
  email: string;
  password: string;
};

function extractApiError(data: unknown, fallback: string): string {
  if (data == null) return fallback;
  if (typeof data === "string") return data || fallback;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    const msg = o.message ?? o.error ?? o.detail;
    if (typeof msg === "string" && msg.trim()) return msg;
    if (Array.isArray(o.errors) && o.errors.length > 0) {
      const first = o.errors[0];
      if (typeof first === "string") return first;
      if (first && typeof first === "object" && "message" in first) {
        const m = (first as { message?: string }).message;
        if (m) return m;
      }
    }
  }
  return fallback;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function apiRequest<T>(
  path: string,
  init?: RequestInit & { token?: string },
): Promise<ApiResult<T>> {
  if (!API_BASE_URL) {
    return { ok: false, error: "API не настроен" };
  }

  const { token, ...fetchInit } = init ?? {};
  const headers = new Headers(fetchInit.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}${apiPath(path)}`, {
      ...fetchInit,
      headers,
    });
    const data = await parseResponseBody(response);

    if (!response.ok) {
      return { ok: false, error: extractApiError(data, `Ошибка запроса (${response.status})`) };
    }

    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "Не удалось подключиться к API" };
  }
}

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return undefined;
}

function buildFullName(firstname?: string, lastname?: string): string | undefined {
  const parts = [lastname, firstname].map((p) => p?.trim()).filter(Boolean) as string[];
  return parts.length ? parts.join(" ") : undefined;
}

export function parseAuthUserPayload(data: unknown): AuthUserPayload {
  if (data == null || typeof data !== "object") return {};

  const root = data as Record<string, unknown>;
  const nested = [root.user, root.profile, root.data, root.student].find(
    (x) => x != null && typeof x === "object",
  ) as Record<string, unknown> | undefined;

  const sources: Record<string, unknown>[] = nested ? [nested, root] : [root];

  let name: string | undefined;
  let firstname: string | undefined;
  let lastname: string | undefined;
  let university: string | undefined;
  let email: string | undefined;
  let avatar: string | undefined;
  let user_id: number | undefined;
  let personal_points: number | undefined;
  let speciality_name: string | undefined;

  for (const src of sources) {
    firstname ??= pickString(src, ["firstname", "firstName", "first_name"]);
    lastname ??= pickString(src, ["lastname", "lastName", "last_name"]);
    name ??= pickString(src, [
      "name",
      "username",
      "userName",
      "user_name",
      "fullName",
      "full_name",
    ]);
    name ??= buildFullName(firstname, lastname);
    university ??= pickString(src, [
      "university",
      "universityName",
      "university_name",
      "uni",
      "vuz",
    ]);
    speciality_name ??= pickString(src, ["speciality_name", "specialty_name", "speciality"]);
    email ??= pickString(src, ["email", "mail"]);
    avatar ??= pickString(src, ["avatar", "avatar_url", "avatarUrl"]);
    user_id ??= pickNumber(src, ["user_id", "userId", "id"]);
    personal_points ??= pickNumber(src, ["personal_points", "personalPoints", "points"]);
  }

  return {
    user_id,
    name,
    username: name,
    firstname,
    lastname,
    university,
    speciality_name,
    email,
    avatar,
    personal_points,
    university_id: pickNumber(root, ["university_id", "universityId"]),
  };
}

function parseRegistrationOptionList(raw: unknown, idKeys: string[]): RegistrationOption[] {
  if (!Array.isArray(raw)) return [];

  const items: RegistrationOption[] = [];
  for (const item of raw) {
    if (item == null || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;

    let id: number | undefined;
    for (const key of idKeys) {
      const v = o[key];
      if (typeof v === "number" && Number.isFinite(v)) {
        id = v;
        break;
      }
    }

    const name = typeof o.name === "string" ? o.name.trim() : "";
    const university_id =
      typeof o.university_id === "number"
        ? o.university_id
        : typeof o.universityId === "number"
          ? o.universityId
          : undefined;

    if (typeof id === "number" && name) {
      const option: RegistrationOption = { id, name };
      if (university_id !== undefined) {
        option.university_id = university_id;
      }
      items.push(option);
    }
  }
  return items;
}

export function parseRegistrationOptions(data: unknown): RegistrationOptionsData | null {
  if (data == null || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const universities = parseRegistrationOptionList(root.universities, [
    "id",
    "university_id",
  ]);
  const specialities = parseRegistrationOptionList(
    root.specialities ?? root.specialties,
    ["id", "speciality_id", "specialty_id"],
  );

  if (!universities.length || !specialities.length) return null;
  return { universities, specialities };
}

export function resolveAvatarUrl(avatar?: string): string | undefined {
  if (!avatar?.trim()) return undefined;
  if (avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("data:")) {
    return avatar;
  }
  if (!API_BASE_URL) return avatar;
  return `${API_BASE_URL}${avatar.startsWith("/") ? avatar : `/${avatar}`}`;
}

export function mapActivityStatus(status: number, statusText?: string): string {
  if (statusText?.trim()) return statusText;
  switch (status) {
    case 1:
      return "Принято";
    case 2:
      return "Отклонено";
    case 3:
      return "Дополнить";
    default:
      return "На проверке";
  }
}

export async function fetchRegistrationOptionsRequest(): Promise<ApiResult<RegistrationOptionsData>> {
  const result = await apiRequest<unknown>("/register", { method: "GET" });
  if (!result.ok) {
    return { ok: false, error: result.error ?? "Не удалось загрузить данные для регистрации" };
  }

  const options = parseRegistrationOptions(result.data);
  if (!options) {
    return { ok: false, error: "Сервер вернул некорректные списки университетов и специальностей" };
  }

  return { ok: true, data: options };
}

export async function registerRequest(payload: RegisterPayload): Promise<ApiResult<void>> {
  const result = await apiRequest<unknown>("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return result.ok
    ? { ok: true }
    : { ok: false, error: result.error ?? "Ошибка регистрации" };
}

export async function loginRequest(payload: LoginPayload): Promise<ApiResult<LoginResponseData>> {
  const result = await apiRequest<Record<string, unknown>>("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!result.ok || !result.data) {
    return { ok: false, error: result.error ?? "Неверный email или пароль" };
  }

  const data = result.data;
  const token =
    (typeof data.token === "string" ? data.token : undefined) ??
    (typeof data.access_token === "string" ? data.access_token : undefined);
  if (!token) {
    return { ok: false, error: "Сервер не вернул JWT токен" };
  }

  const user = parseAuthUserPayload(data);
  if (!user.email) user.email = payload.email.trim();

  return { ok: true, data: { token, user } };
}

export async function profileRequest(token: string): Promise<ApiResult<unknown>> {
  return apiRequest("/profile", { method: "GET", token });
}

export async function fetchCurrentUserRequest(token: string): Promise<ApiResult<UserBasic>> {
  return apiRequest<UserBasic>("/user", { method: "GET", token });
}

export async function fetchUserProfileRequest(
  token: string,
  userId: number,
): Promise<ApiResult<UserProfile>> {
  return apiRequest<UserProfile>(`/profile/${userId}`, { method: "GET", token });
}

export async function fetchRatingRequest(
  page = 1,
  limit = 100,
): Promise<ApiResult<RatingResponse>> {
  const result = await apiRequest<Record<string, unknown>>(
    `/rating?page=${page}&limit=${limit}`,
    { method: "GET" },
  );
  if (!result.ok || !result.data) {
    return { ok: false, error: result.error ?? "Не удалось загрузить рейтинг" };
  }

  const raw = result.data;
  const universitiesRaw = raw.universities;
  const universities: RatingUniversity[] = Array.isArray(universitiesRaw)
    ? universitiesRaw
        .filter((u): u is Record<string, unknown> => u != null && typeof u === "object")
        .map((u, index) => ({
          university_id:
            pickNumber(u, ["university_id", "id"]) ?? index + 1,
          name: pickString(u, ["name"]) ?? "—",
          activity_points: pickNumber(u, ["activity_points", "activeCoins", "points"]) ?? 0,
          region: pickString(u, ["region", "location"]),
          students_count: pickNumber(u, ["students_count", "students"]),
          avg_points: pickNumber(u, ["avg_points", "avgAK"]),
          points_change: pickNumber(u, ["points_change", "trend"]),
          rank: pickNumber(u, ["rank"]) ?? index + 1,
          specialities: Array.isArray(u.specialities)
            ? u.specialities
                .filter((s): s is Record<string, unknown> => s != null && typeof s === "object")
                .map((s) => ({
                  speciality_id: pickNumber(s, ["speciality_id", "id"]) ?? 0,
                  name: pickString(s, ["name"]) ?? "",
                }))
                .filter((s) => s.name)
            : undefined,
        }))
    : [];

  return {
    ok: true,
    data: {
      page: pickNumber(raw, ["page"]) ?? page,
      limit: pickNumber(raw, ["limit"]) ?? limit,
      universities,
    },
  };
}

export async function fetchUniversityDetailsRequest(
  universityId: number,
): Promise<ApiResult<UniversityDetails>> {
  return apiRequest<UniversityDetails>(`/university/${universityId}`, { method: "GET" });
}

export async function fetchStoreItemsRequest(): Promise<ApiResult<StoreItem[]>> {
  const result = await apiRequest<Record<string, unknown>>("/store", { method: "GET" });
  if (!result.ok || !result.data) {
    return { ok: false, error: result.error ?? "Не удалось загрузить товары" };
  }

  const itemsRaw = result.data.items;
  const items: StoreItem[] = Array.isArray(itemsRaw)
    ? itemsRaw
        .filter((item): item is Record<string, unknown> => item != null && typeof item === "object")
        .map((item, index) => ({
          item_id: pickNumber(item, ["item_id", "id"]) ?? index + 1,
          name: pickString(item, ["name"]) ?? "Товар",
          description: pickString(item, ["description"]),
          value: pickNumber(item, ["value", "price"]) ?? 0,
          stock: pickNumber(item, ["stock"]),
          image_url: pickString(item, ["image_url", "imageUrl"]),
          categories: Array.isArray(item.categories)
            ? item.categories.filter((c): c is string => typeof c === "string")
            : undefined,
          university_id: pickNumber(item, ["university_id"]),
          university_name: pickString(item, ["university_name"]),
          created_at: pickString(item, ["created_at"]),
        }))
    : [];

  return { ok: true, data: items };
}

export async function fetchAdminActivitiesRequest(
  token: string,
  universityId?: number,
): Promise<ApiResult<AdminActivity[]>> {
  const query = universityId != null ? `?university_id=${universityId}` : "";
  const result = await apiRequest<Record<string, unknown>>(`/admin${query}`, {
    method: "GET",
    token,
  });
  if (!result.ok || !result.data) {
    return { ok: false, error: result.error ?? "Не удалось загрузить заявки" };
  }

  const activitiesRaw = result.data.activities;
  const activities: AdminActivity[] = Array.isArray(activitiesRaw)
    ? activitiesRaw
        .filter((a): a is Record<string, unknown> => a != null && typeof a === "object")
        .map((a, index) => ({
          activity_id: pickNumber(a, ["activity_id", "id"]) ?? index + 1,
          user_id: pickNumber(a, ["user_id"]) ?? 0,
          user_name: pickString(a, ["user_name", "userName"]) ?? "—",
          university_id: pickNumber(a, ["university_id"]) ?? 0,
          university_name: pickString(a, ["university_name"]) ?? "—",
          category_id: pickNumber(a, ["category_id"]) ?? 0,
          name: pickString(a, ["name"]) ?? "—",
          description: pickString(a, ["description"]),
          status: pickNumber(a, ["status"]) ?? 0,
          status_text: pickString(a, ["status_text"]) ?? mapActivityStatus(pickNumber(a, ["status"]) ?? 0),
          points_awarded: pickNumber(a, ["points_awarded", "points"]),
          created_at: pickString(a, ["created_at"]),
          report_time: pickString(a, ["report_time"]),
          updated_at: pickString(a, ["updated_at"]),
          images: Array.isArray(a.images)
            ? a.images.filter((img): img is string => typeof img === "string")
            : undefined,
        }))
    : [];

  return { ok: true, data: activities };
}

export async function updateActivityStatusRequest(
  token: string,
  activityId: number,
  payload: { status: number; points?: number; reason?: string },
): Promise<ApiResult<void>> {
  const result = await apiRequest<unknown>(`/admin/activities/${activityId}`, {
    method: "PATCH",
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function updateUserEmailRequest(
  token: string,
  email: string,
): Promise<ApiResult<void>> {
  const result = await apiRequest<unknown>("/user/email", {
    method: "PATCH",
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function updateUserAvatarRequest(
  token: string,
  file: File,
): Promise<ApiResult<{ url: string }>> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiRequest<Record<string, string>>("/user/avatar", {
    method: "PATCH",
    token,
    body: formData,
  });

  if (!result.ok || !result.data) {
    return { ok: false, error: result.error ?? "Не удалось обновить аватар" };
  }

  const url =
    result.data.url ??
    Object.values(result.data).find((v): v is string => typeof v === "string" && v.includes("/"));
  return url ? { ok: true, data: { url } } : { ok: false, error: "Сервер не вернул URL аватара" };
}

export async function updateUserNameRequest(
  token: string,
  firstname: string,
  lastname: string,
): Promise<ApiResult<void>> {
  const result = await apiRequest<unknown>("/user/name", {
    method: "PATCH",
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstname, lastname }),
  });
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function updateUserPasswordRequest(
  token: string,
  oldPassword: string,
  newPassword: string,
): Promise<ApiResult<void>> {
  const result = await apiRequest<unknown>("/user/password", {
    method: "PATCH",
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  });
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function updateUserUniversityRequest(
  token: string,
  universityId: number,
  specialityId: number,
): Promise<ApiResult<void>> {
  const result = await apiRequest<unknown>("/user/university", {
    method: "PATCH",
    token,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ university_id: universityId, speciality_id: specialityId }),
  });
  return result.ok ? { ok: true } : { ok: false, error: result.error };
}

export async function uploadImageRequest(
  token: string,
  file: File,
): Promise<ApiResult<{ url: string }>> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiRequest<Record<string, string>>("/upload", {
    method: "POST",
    token,
    body: formData,
  });

  if (!result.ok || !result.data) {
    return { ok: false, error: result.error ?? "Не удалось загрузить изображение" };
  }

  const url = result.data.url;
  return url ? { ok: true, data: { url } } : { ok: false, error: "Сервер не вернул URL файла" };
}
