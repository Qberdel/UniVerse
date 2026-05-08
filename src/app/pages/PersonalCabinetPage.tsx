import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Coins, TrendingUp, Award, Calendar, Activity } from 'lucide-react';
import { ActivityChart } from '../components/ActivityChart';

export function PersonalCabinetPage() {
  const userData = {
    name: "Иван Петров",
    email: "ivan.petrov@msu.ru",
    university: "МГУ",
    activeCoins: 25430,
    rank: 142,
    totalStudents: 45000
  };

  const activityHistory = [
    { id: 1, date: "2026-04-20", activity: "Участие в олимпиаде по физике", coins: 500, status: "Оплатить" },
    { id: 2, date: "2026-04-15", activity: "Волонтерство на мероприятии", coins: 300, status: "Оплатить" },
    { id: 3, date: "2026-04-10", activity: "Публикация статьи", coins: 800, status: "Добавленных" },
    { id: 4, date: "2026-04-05", activity: "Участие в конференции", coins: 600, status: "Добавленных" },
    { id: 5, date: "2026-03-28", activity: "Спортивные соревнования", coins: 400, status: "Добавленных" },
  ];

  const chartData = [
    { month: 'Янв', rating: 18000, applications: 0 },
    { month: 'Фев', rating: 19500, applications: 0 },
    { month: 'Мар', rating: 21200, applications: 0 },
    { month: 'Апр', rating: 23800, applications: 0 },
    { month: 'Май', rating: 24500, applications: 0 },
    { month: 'Июн', rating: 25430, applications: 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* User Info Card */}
        <Card className="lg:col-span-1 p-4 sm:p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4">
              <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="mb-1 text-lg sm:text-xl">{userData.name}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 truncate w-full px-4">{userData.email}</p>
            <Badge variant="secondary" className="mb-3 sm:mb-4">{userData.university}</Badge>

            <div className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              <div className="p-3 sm:p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                  <span className="text-2xl sm:text-3xl">{userData.activeCoins.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Актив Коины (АК)</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-muted rounded-lg text-center">
                  <p className="text-xl sm:text-2xl mb-1">#{userData.rank}</p>
                  <p className="text-xs text-muted-foreground">Ранг в ВУЗе</p>
                </div>
                <div className="p-2 sm:p-3 bg-muted rounded-lg text-center">
                  <p className="text-xl sm:text-2xl mb-1">{userData.totalStudents.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Студентов</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4 sm:mt-6">Редактировать профиль</Button>
          </div>
        </Card>

        {/* Stats and Chart */}
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">История АК пользователя</h3>
          <ActivityChart
            data={chartData}
            title="Рост АК за последние 6 месяцев"
          />
        </Card>
      </div>

      {/* Activity History */}
      <Card className="p-4 sm:p-6">
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg">История активности</h3>
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all" className="flex-1 sm:flex-none text-xs sm:text-sm">Все</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1 sm:flex-none text-xs sm:text-sm">К оплате</TabsTrigger>
              <TabsTrigger value="added" className="flex-1 sm:flex-none text-xs sm:text-sm">Добавлено</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-3">
            {activityHistory.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-3"
              >
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="mb-1 text-sm sm:text-base line-clamp-2">{item.activity}</h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>+{item.coins} АК</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant={item.status === "Оплатить" ? "default" : "secondary"} className="self-start sm:self-center text-xs">
                  {item.status}
                </Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {activityHistory.filter(item => item.status === "Оплатить").map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{item.activity}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        +{item.coins} АК
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="default">{item.status}</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="added" className="space-y-3">
            {activityHistory.filter(item => item.status === "Добавленных").map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{item.activity}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4" />
                        +{item.coins} АК
                      </div>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">{item.status}</Badge>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
