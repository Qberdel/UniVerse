import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Plus, Calendar as CalendarIcon, Upload, ShieldAlert, LogIn, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { isRegistered } from '../lib/auth';

function AddActivityUnauthorized() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 min-h-[calc(100vh-220px)] flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-destructive/20 blur-3xl animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-2xl p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto mb-5 w-16 h-16 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl mb-3">Доступ ограничен</h1>
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6 text-left">
          Чтобы составить заявку на активность, сначала зарегистрируйтесь в UniVerse и войдите в аккаунт.
        </div>
        <p className="text-sm sm:text-base text-muted-foreground mb-7">
          После регистрации вы сможете отправлять заявки на модерацию и получать АК за подтверждённые активности.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/register">
              <UserPlus className="w-4 h-4 mr-2" />
              Зарегистрироваться
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">
              <LogIn className="w-4 h-4 mr-2" />
              Войти
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function AddActivityPage() {
  const navigate = useNavigate();
  const registered = isRegistered();

  if (!registered) {
    return <AddActivityUnauthorized />;
  }
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    proofFile: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки заявки на модерацию
    alert('Заявка отправлена на модерацию!');
    navigate('/profile');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, proofFile: e.target.files[0] });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="mb-2 text-xl sm:text-2xl">Добавить активность</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Опишите вашу активность для получения АК. Заявка будет отправлена на модерацию.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">Форма добавления активности</h3>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Название активности *</Label>
              <Input
                id="title"
                type="text"
                placeholder="Например: Участие в олимпиаде по физике"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Категория *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Академическая деятельность</SelectItem>
                  <SelectItem value="sports">Спортивные достижения</SelectItem>
                  <SelectItem value="volunteer">Волонтерство</SelectItem>
                  <SelectItem value="research">Научная работа</SelectItem>
                  <SelectItem value="culture">Культурная деятельность</SelectItem>
                  <SelectItem value="leadership">Лидерство и управление</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Дата проведения *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: ru }) : <span>Выберите дату</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание активности *</Label>
              <Textarea
                id="description"
                placeholder="Подробно опишите вашу активность: что вы делали, какие результаты получили, какой вклад внесли..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Чем подробнее описание, тем быстрее пройдет модерация
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="proof">Подтверждающие документы</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  id="proof"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="proof" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    {formData.proofFile ? formData.proofFile.name : 'Нажмите для загрузки'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Сертификаты, дипломы, фотографии (до 10 МБ)
                  </p>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="flex-1 w-full">
                <Plus className="w-4 h-4 mr-2" />
                Отправить на модерацию
              </Button>
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => navigate('/profile')}>
                Отмена
              </Button>
            </div>
          </form>
        </Card>

        {/* Info Sidebar */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4">
          <Card className="p-4 sm:p-6">
            <h4 className="mb-3 sm:mb-4 text-sm sm:text-base">Как это работает?</h4>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">1</span>
                <span>Заполните форму с описанием вашей активности</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">2</span>
                <span>Приложите подтверждающие документы</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">3</span>
                <span>Модератор проверит заявку (1-3 дня)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">4</span>
                <span>АК будут начислены на ваш счет</span>
              </li>
            </ol>
          </Card>

          <Card className="p-6">
            <h4 className="mb-4">Примеры активностей</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Участие в олимпиадах и конкурсах</li>
              <li>• Публикация научных статей</li>
              <li>• Волонтерская деятельность</li>
              <li>• Спортивные достижения</li>
              <li>• Организация мероприятий</li>
              <li>• Культурные проекты</li>
            </ul>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h4 className="mb-2">Важно!</h4>
            <p className="text-sm text-muted-foreground">
              Все заявки проходят модерацию. Ложная информация может привести к блокировке аккаунта.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
