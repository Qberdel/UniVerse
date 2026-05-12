const STORAGE_KEY = "universe:studentClaims";
const UPDATED_EVENT = "universe-claims-updated";

export type ClaimSupplement = {
  text: string;
  photoDataUrl?: string;
  createdAt: string;
};

export type StudentClaim = {
  id: number;
  date: string;
  activity: string;
  coins: number;
  status: "На проверке" | "Принято" | "Дополнить" | "Отклонено";
  supplements: ClaimSupplement[];
};

const DEFAULT_CLAIMS: StudentClaim[] = [
  { id: 1, date: "2026-04-20", activity: "Участие в олимпиаде по физике", coins: 500, status: "На проверке", supplements: [] },
  { id: 2, date: "2026-04-15", activity: "Волонтерство на мероприятии", coins: 300, status: "Принято", supplements: [] },
  { id: 3, date: "2026-04-10", activity: "Публикация статьи", coins: 800, status: "Дополнить", supplements: [] },
  { id: 4, date: "2026-04-05", activity: "Участие в конференции", coins: 600, status: "Отклонено", supplements: [] },
  { id: 5, date: "2026-03-28", activity: "Спортивные соревнования", coins: 400, status: "Принято", supplements: [] },
];

function mergeWithDefaults(stored: StudentClaim[]): StudentClaim[] {
  const map = new Map(stored.map((c) => [c.id, c]));
  return DEFAULT_CLAIMS.map((def) => {
    const s = map.get(def.id);
    if (!s) return { ...def, supplements: [] };
    return {
      ...def,
      ...s,
      supplements: Array.isArray(s.supplements) ? s.supplements : [],
    };
  });
}

export function getStudentClaims(): StudentClaim[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CLAIMS.map((c) => ({ ...c, supplements: [...c.supplements] }));
    const parsed = JSON.parse(raw) as StudentClaim[];
    if (!Array.isArray(parsed)) return DEFAULT_CLAIMS.map((c) => ({ ...c, supplements: [...c.supplements] }));
    return mergeWithDefaults(parsed);
  } catch {
    return DEFAULT_CLAIMS.map((c) => ({ ...c, supplements: [...c.supplements] }));
  }
}

export function persistStudentClaims(claims: StudentClaim[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
  } catch {
    // ignore quota / privacy mode
  }
  window.dispatchEvent(new Event(UPDATED_EVENT));
}

export function subscribeStudentClaimsUpdated(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(UPDATED_EVENT, handler);
  return () => window.removeEventListener(UPDATED_EVENT, handler);
}

export function getClaimById(claims: StudentClaim[], id: number): StudentClaim | undefined {
  return claims.find((c) => c.id === id);
}
