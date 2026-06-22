import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Mail, Lock, User, UserCircle } from 'lucide-react';
import { setRegistered } from '../lib/auth';
import { setProfile } from '../lib/profile';
import { AuthPageShell } from '../components/AuthPageShell';
import { registerRequest, type RegistrationOption } from '../lib/api';
import { loadRegistrationOptions } from '../lib/registration-options';
import { OnboardingDialog } from '../components/OnboardingDialog';
import { markOnboardingSeen } from '../lib/onboarding';
import { cn } from '../components/ui/utils';

const selectClassName = cn(
  'flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm',
  'transition-colors hover:border-ring/50',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none',
);

export function RegistrationPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [universities, setUniversities] = useState<RegistrationOption[]>([]);
  const [specialities, setSpecialities] = useState<RegistrationOption[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    universityId: '',
    specialityId: '',
  });

  useEffect(() => {
    let cancelled = false;

    loadRegistrationOptions().then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        setOptionsError(result.error);
        setUniversities([]);
        setSpecialities([]);
      } else {
        setUniversities(result.universities ?? []);
        setSpecialities(result.specialities ?? []);
        setOptionsError(null);
      }
      setOptionsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSpecialities = formData.universityId
    ? specialities.filter((s) => s.university_id === Number(formData.universityId))
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (optionsError) {
      setError(optionsError);
      return;
    }

    if (!formData.firstName.trim()) {
      setError('Введите имя');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Введите фамилию');
      return;
    }
    if (!formData.universityId) {
      setError('Выберите университет из списка');
      return;
    }
    if (!formData.specialityId) {
      setError('Выберите специальность из списка');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    const university = universities.find((item) => String(item.id) === formData.universityId);
    const speciality = specialities.find((item) => String(item.id) === formData.specialityId);

    setSubmitting(true);
    try {
      const response = await registerRequest({
        firstname: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        university_id: Number(formData.universityId),
        speciality_id: Number(formData.specialityId),
      });

      if (!response.ok) {
        setError(response.error ?? "Ошибка регистрации");
        return;
      }

      setProfile({
        name: `${formData.lastName.trim()} ${formData.firstName.trim()}`,
        university: university?.name ?? '',
        specialty: speciality?.name,
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
              <Label htmlFor="firstName">Имя</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Введите ваше имя"
                  className="pl-10 transition-colors hover:border-ring/50 group-hover:border-ring/50"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  disabled={optionsLoading}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <Label htmlFor="lastName">Фамилия</Label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Введите вашу фамилию"
                  className="pl-10 transition-colors hover:border-ring/50 group-hover:border-ring/50"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  disabled={optionsLoading}
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
                  disabled={optionsLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">Университет</Label>
              <select
                id="university"
                className={selectClassName}
                value={formData.universityId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    universityId: e.target.value,
                    specialityId: '',
                  })
                }
                disabled={optionsLoading || !!optionsError}
                required
              >
                <option value="">
                  {optionsLoading ? 'Загрузка...' : 'Выберите университет'}
                </option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialty">Специальность</Label>
              <select
                id="specialty"
                className={selectClassName}
                value={formData.specialityId}
                onChange={(e) => setFormData({ ...formData, specialityId: e.target.value })}
                disabled={
                  optionsLoading ||
                  !formData.universityId ||
                  filteredSpecialities.length === 0
                }
                required
              >
                <option value="">
                  {!formData.universityId
                    ? 'Сначала выберите университет'
                    : filteredSpecialities.length === 0
                      ? 'Нет специальностей для этого вуза'
                      : 'Выберите специальность'}
                </option>
                {filteredSpecialities.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
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
                  disabled={optionsLoading}
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
                  disabled={optionsLoading}
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
              Регистрируясь, вы соглашаетесь с{' '}
              <Link to="/terms" className="text-primary hover:underline">
                пользовательским соглашением
              </Link>{' '}
              и{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                политикой конфиденциальности
              </Link>
            </p>

            <Button type="submit" className="w-full" disabled={submitting || optionsLoading}>
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
