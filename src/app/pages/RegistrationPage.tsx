import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Mail, Lock, User } from 'lucide-react';
import { setRegistered } from '../lib/auth';
import { setProfile } from '../lib/profile';
import { AuthPageShell } from '../components/AuthPageShell';
import { registerRequest } from '../lib/api';
import { SearchableSelect } from '../components/SearchableSelect';
import { loadRegistrationOptions } from '../lib/registration-options';
import { OnboardingDialog } from '../components/OnboardingDialog';
import { markOnboardingSeen } from '../lib/onboarding';

export function RegistrationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [universities, setUniversities] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    specialty: '',
  });

  useEffect(() => {
    let cancelled = false;

    loadRegistrationOptions().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setOptionsError(result.error);
        setUniversities([]);
        setSpecialties([]);
      } else {
        setUniversities(result.universities);
        setSpecialties(result.specialties);
        setOptionsError(null);
      }
      setOptionsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const listsUnavailable = Boolean(optionsError) || optionsLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (optionsError) {
      setError(optionsError);
      return;
    }

    if (!formData.university) {
      setError('Выберите университет из списка');
      return;
    }
    if (!formData.specialty) {
      setError('Выберите специальность из списка');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setSubmitting(true);
    try {
      const response = await registerRequest({
        email: formData.email.trim(),
        password: formData.password,
        username: formData.name.trim(),
        university: formData.university.trim(),
      });

      if (!response.ok) {
        setError(response.error ?? "Ошибка регистрации");
        return;
      }

      setProfile({
        name: formData.name,
        university: formData.university,
        specialty: formData.specialty,
        email: formData.email.trim(),
      });
      setRegistered(false);
      setOnboardingOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const onOnboardingComplete = () => {
    markOnboardingSeen();
    navigate("/login");
  };

  return (
    <>
      <AuthPageShell title="Регистрация" subtitle="Создайте аккаунт в системе UniVerse">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {optionsError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {optionsError}
              </div>
            )}
            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2 group">
              <Label htmlFor="name">Имя пользователя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Введите ваше имя"
                  className="pl-10 transition-colors hover:border-ring/50 group-hover:border-ring/50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={listsUnavailable}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@university.ru"
                  className="pl-10 transition-colors hover:border-ring/50 group-hover:border-ring/50"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={listsUnavailable}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="university">Университет</Label>
              <SearchableSelect
                id="university"
                options={universities}
                value={formData.university}
                onValueChange={(university) => setFormData({ ...formData, university })}
                placeholder="Выберите университет"
                searchPlaceholder="Поиск университета..."
                emptyText="Университет не найден"
                required
                loading={optionsLoading}
                disabled={listsUnavailable || universities.length === 0}
                className="group-hover:border-ring/50"
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="specialty">Специальность</Label>
              <SearchableSelect
                id="specialty"
                options={specialties}
                value={formData.specialty}
                onValueChange={(specialty) => setFormData({ ...formData, specialty })}
                placeholder="Выберите специальность"
                searchPlaceholder="Поиск специальности..."
                emptyText="Специальность не найдена"
                required
                loading={optionsLoading}
                disabled={listsUnavailable || specialties.length === 0}
                className="group-hover:border-ring/50"
              />
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 8 символов"
                  className="pl-10 transition-colors hover:border-ring/50 group-hover:border-ring/50"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={listsUnavailable}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Повторите пароль"
                  className="pl-10 transition-colors hover:border-ring/50 group-hover:border-ring/50"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={listsUnavailable}
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
              Регистрируясь, вы соглашаетеся с{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                политикой конфиденциальности
              </Link>
            </p>

            <Button type="submit" className="w-full" disabled={submitting || listsUnavailable}>
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Уже есть аккаунт? </span>
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </div>
      </AuthPageShell>

      <OnboardingDialog
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onComplete={onOnboardingComplete}
      />
    </>
  );
}
