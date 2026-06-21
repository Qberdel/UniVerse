export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("Не задан VITE_API_BASE_URL");
  }
  return API_BASE_URL;
}

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

// Добавлено опциональное поле university_id для специальностей
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

type LoginPayload = {
  email: string;
  password: string;
};

/** Поля пользователя из ответа login / profile */
export type AuthUserPayload = {
  username?: string;
  university?: string;
  email?: string;
};

export type LoginResponseData = {
  token: string;
  user: AuthUserPayload;
};

function pickString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

/** username, university и др. из тела ответа API */
export function parseAuthUserPayload(data: unknown): AuthUserPayload {
  if (data == null || typeof data !== "object") return {};

  const root = data as Record<string, unknown>;
  const nested = [root.user, root.profile, root.data, root.student].find(
    (x) => x != null && typeof x === "object",
  ) as Record<string, unknown> | undefined;

  const sources: Record<string, unknown>[] = nested ? [nested, root] : [root];

  let name: string | undefined;
  let university: string | undefined;
  let email: string | undefined;

  for (const src of sources) {
    name ??= pickString(src, [
      "username",
      "userName",
      "user_name",
      "name",
      "fullName",
      "full_name",
    ]);
    university ??= pickString(src, [
      "university",
      "universityName",
      "university_name",
      "uni",
      "vuz",
    ]);
    email ??= pickString(src, ["email", "mail"]);
  }

  return { username: name, university, email };
}

function parseRegistrationOptionList(raw: unknown): RegistrationOption[] {
  if (!Array.isArray(raw)) return [];

  const items: RegistrationOption[] = [];
  for (const item of raw) {
    if (item == null || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    
    const id = o.id;
    const name = typeof o.name === "string" ? o.name.trim() : "";
    // Парсим university_id, если он есть в объекте (для специальностей)
    const university_id = typeof o.university_id === "number" ? o.university_id : undefined;

    if (typeof id === "number" && Number.isFinite(id) && name) {
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
  const universities = parseRegistrationOptionList(root.universities);
  const specialities = parseRegistrationOptionList(root.specialities ?? root.specialties);

  if (!universities.length || !specialities.length) return null;
  return { universities, specialities };
}

export async function fetchRegistrationOptionsRequest(): Promise<ApiResult<RegistrationOptionsData>> {
  if (!API_BASE_URL) {
    return { ok: false, error: "API не настроен" };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/register`);
    const text = await response.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text || undefined;
    }

    if (!response.ok) {
      return { ok: false, error: extractApiError(data, "Не удалось загрузить данные для регистрации") };
    }

    const options = parseRegistrationOptions(data);
    if (!options) {
      return { ok: false, error: "Сервер вернул некорректные списки университетов и специальностей" };
    }

    return { ok: true, data: options };
  } catch {
    return { ok: false, error: "Не удалось подключиться к API" };
  }
}

export async function registerRequest(payload: RegisterPayload): Promise<ApiResult<void>> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { ok: true };
    }

    const text = await response.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text || undefined;
    }

    return { ok: false, error: extractApiError(data, "Ошибка регистрации") };
  } catch {
    return { ok: false, error: "Не удалось подключиться к API" };
  }
}

export async function loginRequest(payload: LoginPayload): Promise<ApiResult<LoginResponseData>> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => undefined)) as Record<string, unknown> | undefined;

    if (!response.ok) {
      const msg = typeof data?.message === "string" ? data.message : undefined;
      return { ok: false, error: msg ?? "Неверный email или пароль" };
    }

    const token =
      (typeof data?.token === "string" ? data.token : undefined) ??
      (typeof data?.access_token === "string" ? data.access_token : undefined);
    if (!token) {
      return { ok: false, error: "Сервер не вернул JWT токен" };
    }

    const user = parseAuthUserPayload(data);
    if (!user.email) user.email = payload.email.trim();

    return { ok: true, data: { token, user } };
  } catch {
    return { ok: false, error: "Не удалось подключиться к API" };
  }
}

export async function profileRequest(token: string): Promise<ApiResult<unknown>> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      return { ok: false, error: (data as { message?: string } | undefined)?.message ?? "Нет доступа к профилю" };
    }

    return { ok: true, data };
  } catch {
    return { ok: false, error: "Не удалось подключиться к API" };
  }
}