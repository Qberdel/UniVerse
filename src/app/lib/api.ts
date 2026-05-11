declare const __API_BASE_URL__: string;

export const API_BASE_URL = __API_BASE_URL__.replace(/\/+$/, "");

export type ApiResult<T> = {
  ok: boolean;
  data?: T;
  error?: string;
};

type RegisterPayload = {
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

export async function registerRequest(payload: RegisterPayload): Promise<ApiResult<unknown>> {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => undefined);
    if (!response.ok) {
      return { ok: false, error: (data as { message?: string } | undefined)?.message ?? "Ошибка регистрации" };
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
