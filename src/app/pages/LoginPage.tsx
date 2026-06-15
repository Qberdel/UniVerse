import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Mail, Lock } from 'lucide-react';
import { setAuthToken, setRegistered } from '../lib/auth';
import { loadProfileFromApi } from '../lib/profile';
import { AuthPageShell } from '../components/AuthPageShell';
import { loginRequest } from '../lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const response = await loginRequest({
      email: formData.email.trim(),
      password: formData.password,
    });
    setSubmitting(false);
    if (!response.ok || !response.data?.token) {
      setError(response.error ?? "Ошибка входа");
      return;
    }

    setAuthToken(response.data.token);
    setRegistered(true);
    await loadProfileFromApi(
      response.data.token,
      response.data.user,
      formData.email.trim(),
    );
    navigate('/profile');
  };

  return (
    <AuthPageShell title="Вход в систему" subtitle="Войдите в свой аккаунт UniVerse">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@university.ru"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Пароль</Label>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setForgotPasswordOpen(true)}
              >
                Забыли пароль?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Введите пароль"
                className="pl-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            Войти
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Нет аккаунта? </span>
          <Link to="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </div>

      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Восстановление пароля</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-1 text-left text-sm text-muted-foreground">
                <p>
                  Чтобы изменить пароль, напишите администратору на почту{' '}
                  <a
                    href="mailto:support@universe.ru"
                    className="text-primary hover:underline font-medium"
                  >
                    support@universe.ru
                  </a>
                  .
                </p>
                <p>
                  Письмо необходимо отправить с адреса электронной почты, на который вы
                  зарегистрированы в UniVerse — так мы сможем подтвердить вашу личность.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button type="button" onClick={() => setForgotPasswordOpen(false)}>
              Понятно
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AuthPageShell>
  );
}
