declare const __API_BASE_URL__: string;

export const API_BASE_URL = __API_BASE_URL__.replace(/\/+$/, "");

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  /** Дополнительные поля — бэкенд может использовать или игнорировать */
  name?: string;
  university?: string;
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

export async function registerRequest(payload: RegisterPayload): Promise<ApiResult<unknown>> {
  try {
    const body: Record<string, string> = {
      email: payload.email,
      password: payload.password,
    };
    if (payload.name?.trim()) body.name = payload.name.trim();
    if (payload.university?.trim()) body.university = payload.university.trim();

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : undefined;
    } catch {
      data = text || undefined;
    }

    if (!response.ok) {
      return { ok: false, error: extractApiError(data, "Ошибка регистрации") };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Не удалось подключиться к API" };
  }
}

export async function loginRequest(payload: LoginPayload): Promise<ApiResult<{ token: string }>> {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => undefined)) as
      | { token?: string; access_token?: string; message?: string }
      | undefined;

    if (!response.ok) {
      return { ok: false, error: data?.message ?? "Неверный email или пароль" };
    }

    const token = data?.token ?? data?.access_token;
    if (!token) {
      return { ok: false, error: "Сервер не вернул JWT токен" };
    }

    return { ok: true, data: { token } };
  } catch {
    return { ok: false, error: "Не удалось подключиться к API" };
  }
}

export async function profileRequest(token: string): Promise<ApiResult<unknown>> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
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
