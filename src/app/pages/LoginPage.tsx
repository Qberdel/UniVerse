import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Mail, Lock } from 'lucide-react';
import { setRegistered } from '../lib/auth';
import { getProfile, setProfile } from '../lib/profile';
import { AuthPageShell } from '../components/AuthPageShell';

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика входа
    setRegistered(true);
    const existing = getProfile();
    if (!existing) {
      setProfile({
        name: "Пользователь",
        university: "—",
        email: formData.email,
      });
    } else if (existing.email !== formData.email) {
      setProfile({ ...existing, email: formData.email });
    }
    navigate('/profile');
  };

  return (
    <AuthPageShell title="Вход в систему" subtitle="Войдите в свой аккаунт UniVerse">
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
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Пароль</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Забыли пароль?
              </Link>
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

          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Нет аккаунта? </span>
          <Link to="/register" className="text-primary hover:underline">
            Зарегистрироваться
          </Link>
        </div>
    </AuthPageShell>
  );
}
