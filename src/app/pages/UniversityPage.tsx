import { Link, useParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ActivityChart } from '../components/ActivityChart';
import { Coins, MapPin, Users, TrendingUp, Award, ExternalLink } from 'lucide-react';

export function UniversityPage() {
  const { id } = useParams();

  const universityData = {
    id: 1,
    name: "Московский государственный университет",
    shortName: "МГУ",
    location: "Москва",
    activeCoins: 985000,
    students: 45000,
    avgAK: 21889,
    trend: 2.3,
    description: "Ведущий классический университет России, один из старейших и крупнейших университетов страны.",
    website: "https://www.msu.ru",
    specialties: ["Физика", "Математика", "Биология", "Юриспруденция", "Химия", "Филология"],
    founded: 1755
  };

  const monthlyAKHistory = [
    { month: 'Январь', ak: 920000, students: 44800 },
    { month: 'Февраль', ak: 935000, students: 44900 },
    { month: 'Март', ak: 950000, students: 45000 },
    { month: 'Апрель', ak: 970000, students: 45000 },
    { month: 'Май', ak: 975000, students: 45000 },
    { month: 'Июнь', ak: 985000, students: 45000 },
  ];

  const activityData = [
    { month: 'Янв', rating: 920000, applications: 1200 },
    { month: 'Фев', rating: 935000, applications: 1400 },
    { month: 'Мар', rating: 950000, applications: 1800 },
    { month: 'Апр', rating: 970000, applications: 2100 },
    { month: 'Май', rating: 975000, applications: 2000 },
    { month: 'Июн', rating: 985000, applications: 2300 },
  ];

  // Витрина "аналитики" для конкретного ВУЗа: показываем динамику и популярность специальностей.
  const specialtyPopularityData = universityData.specialties.map((s, idx) => ({
    month: s,
    rating: Math.round(universityData.activeCoins * (0.85 - idx * 0.05)),
    applications: Math.round(800 + idx * 220),
  }));

  const lastApplications = activityData[activityData.length - 1]?.applications ?? 0;
  const avgAKPerApplication = Math.round(universityData.avgAK / 50);

  const topStudents = [
    { rank: 1, name: "Алексей Смирнов", ak: 48500, specialty: "Физика" },
    { rank: 2, name: "Мария Иванова", ak: 46200, specialty: "Математика" },
    { rank: 3, name: "Дмитрий Петров", ak: 44800, specialty: "Информатика" },
    { rank: 4, name: "Анна Козлова", ak: 42100, specialty: "Биология" },
    { rank: 5, name: "Сергей Волков", ak: 40500, specialty: "Химия" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="mb-2 text-xl sm:text-2xl">{universityData.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {universityData.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {universityData.students.toLocaleString()} студентов
              </div>
              <div className="flex items-center gap-1">
                Основан в {universityData.founded}
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">{universityData.description}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {universityData.specialties.map((specialty, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          <Card className="p-4 sm:p-6 lg:ml-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="text-2xl sm:text-3xl lg:text-4xl">{universityData.activeCoins.toLocaleString()}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Общий счет АК</p>
              <div className={`flex items-center justify-center gap-1 text-xs sm:text-sm ${universityData.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${universityData.trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(universityData.trend)}% за месяц
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button className="w-full sm:w-auto">
            <ExternalLink className="w-4 h-4 mr-2" />
            Официальный сайт
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link to="/compare">Сравнить с другими</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="activity" className="mb-6 sm:mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          <TabsTrigger value="activity" className="text-xs sm:text-sm">Аналитика</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">История АК</TabsTrigger>
          <TabsTrigger value="students" className="text-xs sm:text-sm">Топ студентов</TabsTrigger>
          <TabsTrigger value="info" className="text-xs sm:text-sm">Инфо</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Блок аналитики аналогичен главной странице: карточки метрик + два графика */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Заявок за месяц</p>
                <Badge variant="secondary">+{Math.max(0, universityData.trend * 3).toFixed(1)}%</Badge>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">{lastApplications.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                Рост активности за период
              </p>
            </Card>

            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Принято модерацией</p>
                <Badge variant="secondary">74%</Badge>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">23,680</p>
              <p className="text-xs text-muted-foreground mt-1">
                Доля принятых от всех заявок
              </p>
            </Card>

            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Отклонено</p>
                <Badge variant="outline">12%</Badge>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">3,840</p>
              <p className="text-xs text-muted-foreground mt-1">
                Требуют корректировки/доказательств
              </p>
            </Card>

            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Среднее АК/заявка</p>
                <Badge variant="secondary">+1.4%</Badge>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">{avgAKPerApplication.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5 text-red-600" />
                Сезонные колебания
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ActivityChart data={activityData} title="Динамика АК и заявок" />
            <ActivityChart
              data={specialtyPopularityData}
              title="Популярность специальностей"
            />
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4 sm:mt-6">
          <Card className="p-4 sm:p-6">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">История АК по месяцам</h3>
            <div className="space-y-2 sm:space-y-3">
              {monthlyAKHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="min-w-0">
                    <p className="mb-1 text-sm sm:text-base truncate">{item.month}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {item.students.toLocaleString()} студентов
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      <span className="text-lg sm:text-2xl">{item.ak.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">АК</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4 mt-4 sm:mt-6">
          <Card className="p-4 sm:p-6">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">Топ студентов по АК</h3>
            <div className="space-y-2 sm:space-y-3">
              {topStudents.map((student) => (
                <div
                  key={student.rank}
                  className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground flex-shrink-0">
                      <span className="text-sm sm:text-base">#{student.rank}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="mb-1 text-sm sm:text-base truncate">{student.name}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{student.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      <span className="text-base sm:text-xl">{student.ak.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">АК</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4 mt-4 sm:mt-6">
          <Card className="p-4 sm:p-6">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">Информация о ВУЗе</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Полное название</p>
                <p className="text-sm sm:text-base">{universityData.name}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Сокращение</p>
                <p className="text-sm sm:text-base">{universityData.shortName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Расположение</p>
                <p className="text-sm sm:text-base">{universityData.location}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Год основания</p>
                <p className="text-sm sm:text-base">{universityData.founded}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Количество студентов</p>
                <p className="text-sm sm:text-base">{universityData.students.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Официальный сайт</p>
                <a href={universityData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm sm:text-base break-all">
                  {universityData.website}
                </a>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Описание</p>
                <p className="text-sm sm:text-base">{universityData.description}</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
