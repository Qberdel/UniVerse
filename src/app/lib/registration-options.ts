import {
  fetchUniversitiesRequest,
  fetchSpecialtiesRequest,
} from "./api";

export type RegistrationOptionsResult =
  | {
      ok: true;
      universities: string[];
      specialties: string[];
    }
  | {
      ok: false;
      error: string;
    };

export async function loadRegistrationOptions(): Promise<RegistrationOptionsResult> {
  const [universitiesRes, specialtiesRes] = await Promise.all([
    fetchUniversitiesRequest(),
    fetchSpecialtiesRequest(),
  ]);

  if (!universitiesRes.ok) {
    return {
      ok: false,
      error: universitiesRes.error ?? "Не удалось загрузить список университетов",
    };
  }

  if (!specialtiesRes.ok) {
    return {
      ok: false,
      error: specialtiesRes.error ?? "Не удалось загрузить список специальностей",
    };
  }

  return {
    ok: true,
    universities: universitiesRes.data!,
    specialties: specialtiesRes.data!,
  };
}
