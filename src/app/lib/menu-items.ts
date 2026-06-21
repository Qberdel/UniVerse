export type MenuItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  categoryLabel: string;
  university: string;
  image: string;
  tags: string[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Сертификат на экскурсию в лабораторию",
    price: 500,
    category: "education",
    categoryLabel: "Образование",
    university: "МГУ",
    image: "🔬",
    tags: ["наука", "лаборатория"],
  },
  {
    id: 2,
    name: "Футболка университета",
    price: 300,
    category: "merch",
    categoryLabel: "Мерч",
    university: "МГУ",
    image: "👕",
    tags: ["одежда", "мерч"],
  },
  {
    id: 3,
    name: "Скидка 20% в студенческой столовой",
    price: 150,
    category: "food",
    categoryLabel: "Питание",
    university: "МГУ",
    image: "🍽️",
    tags: ["еда", "скидка"],
  },
  {
    id: 4,
    name: "Доступ к онлайн-курсу",
    price: 800,
    category: "education",
    categoryLabel: "Образование",
    university: "МГУ",
    image: "💻",
    tags: ["обучение", "курс"],
  },
  {
    id: 5,
    name: "Билет на университетское мероприятие",
    price: 200,
    category: "entertainment",
    categoryLabel: "Развлечения",
    university: "МГУ",
    image: "🎭",
    tags: ["мероприятие", "культура"],
  },
  {
    id: 6,
    name: "Книга из университетской библиотеки",
    price: 400,
    category: "education",
    categoryLabel: "Образование",
    university: "МГУ",
    image: "📚",
    tags: ["книга", "библиотека"],
  },
  {
    id: 7,
    name: "Абонемент в спортзал",
    price: 600,
    category: "sports",
    categoryLabel: "Спорт",
    university: "МГУ",
    image: "🏋️",
    tags: ["спорт", "фитнес"],
  },
  {
    id: 8,
    name: "Кружка с логотипом",
    price: 250,
    category: "merch",
    categoryLabel: "Мерч",
    university: "МГУ",
    image: "☕",
    tags: ["мерч", "посуда"],
  },
  {
    id: 9,
    name: "Участие в научной конференции",
    price: 1000,
    category: "education",
    categoryLabel: "Образование",
    university: "МГУ",
    image: "🎓",
    tags: ["наука", "конференция"],
  },
];

export const MENU_CATEGORIES = [
  { id: "all", name: "Все", icon: "🎯" },
  { id: "education", name: "Образование", icon: "📚" },
  { id: "merch", name: "Мерч", icon: "👕" },
  { id: "food", name: "Питание", icon: "🍽️" },
  { id: "entertainment", name: "Развлечения", icon: "🎭" },
  { id: "sports", name: "Спорт", icon: "⚽" },
];

export function getMenuItemById(id: number): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.id === id);
}
