import { useState } from "react";
import {
  BarChart3,
  Coins,
  FilePlus,
  GraduationCap,
  LayoutDashboard,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "./ui/utils";

const STEPS = [
  {
    icon: GraduationCap,
    title: "Добро пожаловать в UniVerse",
    description:
      "UniVerse — платформа учёта студенческой активности. Здесь вы можете зарабатывать активные коины (АК), следить за рейтингом своего вуза и обменивать баллы на товары.",
  },
  {
    icon: FilePlus,
    title: "Добавление заявок",
    description:
      "В разделе «Добавить заявку» отправляйте подтверждения своих достижений: олимпиады, конференции, волонтёрство и другое. Заявки проходят модерацию — статус виден в профиле.",
  },
  {
    icon: LayoutDashboard,
    title: "Рейтинг и аналитика",
    description:
      "На главной странице — рейтинг университетов, поиск по вузам и аналитика активности. Сравнивайте показатели и следите за динамикой своего университета.",
  },
  {
    icon: User,
    title: "Личный профиль",
    description:
      "В профиле — баланс АК, история заявок и график начислений. Если модератор запросил дополнение, вы можете приложить комментарий или фото прямо из профиля.",
  },
  {
    icon: ShoppingBag,
    title: "Товары и корзина",
    description:
      "В каталоге товаров тратьте накопленные АК на мерч и предложения партнёров. Добавляйте позиции в корзину и оформляйте «покупку» за активные коины.",
  },
  {
    icon: Coins,
    title: "Как начисляются АК",
    description:
      "После одобрения заявки модератором на ваш счёт зачисляются АК. Чем больше подтверждённой активности — тем выше ваш рейтинг внутри вуза и больше возможностей в витрине.",
  },
  {
    icon: BarChart3,
    title: "Готовы начать?",
    description:
      "Войдите в профиль, подайте первую заявку и следите за её статусом. Кнопка «Обучение» в профиле всегда доступна, если захотите повторить этот тур.",
  },
];

type OnboardingDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
};

export function OnboardingDialog({ open, onOpenChange, onComplete }: OnboardingDialogProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setStep(0);
      onComplete?.();
    }
    onOpenChange(next);
  };

  const handleNext = () => {
    if (isLast) {
      setStep(0);
      onOpenChange(false);
      onComplete?.();
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <DialogTitle>{current.title}</DialogTitle>
          </div>
          <DialogDescription className="text-left leading-relaxed pt-1">
            {current.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center gap-1.5 py-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:justify-between">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 0}
              className="flex-1 sm:flex-none"
            >
              Назад
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Пропустить
            </Button>
          </div>
          <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
            {isLast ? "Начать работу" : "Далее"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
