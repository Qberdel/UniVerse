import { Link } from 'react-router';
import {
  GraduationCap,
  TrendingUp,
  Coins,
  ShieldCheck,
  Users,
  ArrowRight,
  BarChart3,
  ShoppingBag,
  FilePlus,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Рейтинг университетов',
    description:
      'Сравнивайте ВУЗы по активности студентов, динамике АК и популярности специальностей в единой системе.',
  },
  {
    icon: FilePlus,
    title: 'Заявки на активность',
    description:
      'Подавайте заявки на учёт достижений — от научных публикаций до волонтёрства. Модерация обеспечивает прозрачность.',
  },
  {
    icon: Coins,
    title: 'Активные коины (АК)',
    description:
      'За подтверждённую активность начисляются АК — внутренняя валюта, которую можно тратить в витрине товаров.',
  },
  {
    icon: ShoppingBag,
    title: 'Витрина товаров',
    description:
      'Обменивайте накопленные АК на мерч, скидки и другие предложения партнёров прямо в личном кабинете.',
  },
  {
    icon: ShieldCheck,
    title: 'Модерация заявок',
    description:
      'Каждая заявка проходит проверку: принято, отклонено или запрос на дополнение — всё отслеживается в профиле.',
  },
  {
    icon: Users,
    title: 'Личный кабинет',
    description:
      'История заявок, график начислений АК, редактирование профиля — всё в одном месте после регистрации.',
  },
];

const STATS = [
  { value: '1 245', label: 'университетов в системе' },
  { value: '4.2M', label: 'студентов по России' },
  { value: '45.8M', label: 'АК начислено всего' },
  { value: '+12%', label: 'рост активности за год' },
];

export function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-muted/40 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-28 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 sm:mb-6">
              Система активности университетов
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mb-4 sm:mb-6">
              UniVerse — платформа учёта студенческой активности
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 sm:mb-10 leading-relaxed">
              Мы объединяем рейтинги вузов, заявки на активность и витрину товаров за активные коины.
              Прозрачная система мотивации для студентов и аналитика для университетов.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Начать работу
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Войти в аккаунт
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                  Смотреть рейтинг
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-medium">{value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl">О проекте</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              UniVerse создан для того, чтобы студенческая активность была видимой и измеримой.
              Участие в олимпиадах, научных конференциях, спортивных соревнованиях и общественных
              инициативах превращается в цифры рейтинга и реальные бонусы.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Университеты получают аналитику по динамике АК и заявок, студенты — понятный путь
              от достижения до награды, а модераторы — инструменты для честной проверки каждой заявки.
            </p>
          </div>
          <Card className="p-6 sm:p-8 bg-muted/30 border-dashed">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Как это работает</h3>
                <p className="text-sm text-muted-foreground">
                  Три простых шага для участия в экосистеме UniVerse
                </p>
              </div>
            </div>
            <ol className="space-y-4">
              {[
                'Зарегистрируйтесь и укажите свой университет',
                'Подайте заявку на активность с подтверждающими материалами',
                'Получите АК после модерации и тратьте их в витрине',
              ].map((step, i) => (
                <li key={step} className="flex gap-3 text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-muted/20 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-xl sm:text-2xl mb-3">Возможности платформы</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Всё необходимое для учёта активности, мотивации студентов и анализа рейтингов вузов
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="p-5 sm:p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <Card className="p-8 sm:p-12 text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
          <h2 className="text-xl sm:text-2xl mb-3 text-primary-foreground">
            Присоединяйтесь к UniVerse
          </h2>
          <p className="text-primary-foreground/80 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Создайте аккаунт за минуту и начните отслеживать активность, подавать заявки
            и участвовать в рейтинге вашего университета.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Зарегистрироваться
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Перейти к рейтингу
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
