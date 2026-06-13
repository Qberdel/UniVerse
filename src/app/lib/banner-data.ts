export const BANNER_INTERVAL_MS = 10_000;

export type BannerSlide = {
  id: string;
  university: string;
  title: string;
  description: string;
  imageSrc: string;
};

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "mgu-olympiad",
    university: "МГУ",
    title: "Олимпиада по физике — сезон 2026",
    description: "Подайте заявку на участие и получите до 500 АК за призовое место.",
    imageSrc: "/banners/banner-1.svg",
  },
  {
    id: "spbgu-science",
    university: "СПбГУ",
    title: "Научная конференция студентов",
    description: "Доклады, публикации и нетворкинг — активность с повышенным начислением АК.",
    imageSrc: "/banners/banner-2.svg",
  },
  {
    id: "hse-hackathon",
    university: "НИУ ВШЭ",
    title: "Хакатон UniVerse × ВШЭ",
    description: "Командные IT-проекты: регистрация открыта до конца месяца.",
    imageSrc: "/banners/banner-3.svg",
  },
  {
    id: "ngu-volunteer",
    university: "НГУ",
    title: "Волонтёрская программа весны",
    description: "Социальные инициативы кампуса — зафиксируйте активность в системе.",
    imageSrc: "/banners/banner-4.svg",
  },
];
