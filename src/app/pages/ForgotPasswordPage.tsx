import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Mail } from "lucide-react";
import { AuthPageShell } from "../components/AuthPageShell";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  const isValidEmail = useMemo(() => {
    const value = email.trim();
    if (value.length === 0) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }, [email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;
    // Демонстрационный флоу: в реальном приложении здесь будет запрос к API.
    setStatus("sent");
  };

  return (
    <AuthPageShell
      title="Восстановление пароля"
      subtitle="Укажите email — мы отправим ссылку для сброса пароля."
    >
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@university.ru"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!isValidEmail || status === "sent"}>
            Отправить ссылку
          </Button>

          {status === "sent" && (
            <div className="text-sm rounded-lg bg-muted px-4 py-3 text-muted-foreground">
              Если такой email зарегистрирован, письмо отправлено. Проверьте входящие и «Спам».
            </div>
          )}
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-primary hover:underline">
            Вернуться ко входу
          </Link>
        </div>
    </AuthPageShell>
  );
}

