import {
  fetchRegistrationOptionsRequest,
  type RegistrationOption,
} from "./api";

export type RegistrationOptionsResult =
  | {
      ok: true;
      universities: RegistrationOption[];
      specialities: RegistrationOption[];
    }
  | {
      ok: false;
      error: string;
    };

export async function loadRegistrationOptions(): Promise<RegistrationOptionsResult> {
  const result = await fetchRegistrationOptionsRequest();

  if (!result.ok) {
    return {
      ok: false,
      error: result.error ?? "Не удалось загрузить данные для регистрации",
    };
  }

  return {
    ok: true,
    universities: result.data!.universities,
    specialities: result.data!.specialities,
  };
}
