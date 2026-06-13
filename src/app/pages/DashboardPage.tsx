import { useMemo, useState } from 'react';
import { UniversityCard } from '../components/UniversityCard';
import { ActivityChart } from '../components/ActivityChart';
import { StatsCard } from '../components/StatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { GraduationCap, TrendingUp, Users, Coins, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ActivityBanner } from '../components/ActivityBanner';

type UniversityCategory = 'tech' | 'humanities' | 'medical';

type DashboardUniversity = {
  id: number;
  rank: number;
  name: string;
  activeCoins: number;
  location: string;
  students: number;
  avgAK: number;
  trend: number;
  specialties: string[];
  category: UniversityCategory;
};

const UNIVERSITIES: DashboardUniversity[] = [
  {
    id: 1,
    rank: 1,
    name: "Московский государственный университет",
    activeCoins: 985000,
    location: "Москва",
    students: 45000,
    avgAK: 21889,
    trend: 2.3,
    specialties: ["Физика", "Математика", "Биология", "Юриспруденция"],
    category: "humanities",
  },
  {
    id: 2,
    rank: 2,
    name: "Санкт-Петербургский государственный университет",
    activeCoins: 862000,
    location: "Санкт-Петербург",
    students: 32000,
    avgAK: 26938,
    trend: 1.8,
    specialties: ["Филология", "История", "Экономика", "Медицина"],
    category: "humanities",
  },
  {
    id: 3,
    rank: 3,
    name: "Новосибирский государственный университет",
    activeCoins: 748000,
    location: "Новосибирск",
    students: 28000,
    avgAK: 26714,
    trend: 3.2,
    specialties: ["ИТ", "Физика", "Химия", "Биотехнологии"],
    category: "tech",
  },
  {
    id: 4,
    rank: 4,
    name: "МФТИ",
    activeCoins: 637000,
    location: "Москва",
    students: 12000,
    avgAK: 53083,
    trend: 1.5,
    specialties: ["Физика", "Математика", "ИТ", "Аэрокосмика"],
    category: "tech",
  },
  {
    id: 5,
    rank: 5,
    name: "НИУ ВШЭ",
    activeCoins: 624000,
    location: "Москва",
    students: 38000,
    avgAK: 16421,
    trend: 2.7,
    specialties: ["Экономика", "Менеджмент", "ИТ", "Дизайн"],
    category: "humanities",
  },
  {
    id: 6,
    rank: 6,
    name: "Томский государственный университет",
    activeCoins: 501000,
    location: "Томск",
    students: 18000,
    avgAK: 27833,
    trend: -0.5,
    specialties: ["Информатика", "Химия", "Биология"],
    category: "medical",
  },
];

const CHART_DATA = [
  { month: 'Янв', rating: 850000, applications: 12000 },
  { month: 'Фев', rating: 870000, applications: 15000 },
  { month: 'Мар', rating: 900000, applications: 21000 },
  { month: 'Апр', rating: 920000, applications: 28000 },
  { month: 'Май', rating: 910000, applications: 25000 },
  { month: 'Июн', rating: 940000, applications: 32000 },
];

const POPULAR_SPECIALTIES_DATA = [
  { month: 'Янв', rating: 820000, applications: 11000 },
  { month: 'Фев', rating: 840000, applications: 14000 },
  { month: 'Мар', rating: 880000, applications: 19000 },
  { month: 'Апр', rating: 890000, applications: 23000 },
  { month: 'Май', rating: 900000, applications: 24000 },
  { month: 'Июн', rating: 930000, applications: 30000 },
];

export function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredUniversities = useMemo(() => {
    return UNIVERSITIES.filter((uni) => {
      const matchesSearch =
        uni.name.toLowerCase().includes(normalizedQuery) ||
        uni.location.toLowerCase().includes(normalizedQuery);
      const matchesCategory = selectedCategory === 'all' || uni.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [normalizedQuery, selectedCategory]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <ActivityBanner />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatsCard
          title="Всего ВУЗов"
          value="1,245"
          icon={GraduationCap}
          trend={{ value: 3.2, positive: true }}
        />
        <StatsCard
          title="Студентов"
          value="4.2M"
          icon={Users}
          description="По всей России"
        />
        <StatsCard
          title="Общий АК"
          value="45.8M"
          icon={Coins}
          trend={{ value: 1.8, positive: true }}
        />
        <StatsCard
          title="Рост активности"
          value="+12%"
          icon={TrendingUp}
          description="За последний год"
        />
      </div>

      <Tabs defaultValue="rating" className="mb-6 sm:mb-8">
        <TabsList className="grid w-full max-w-full sm:max-w-md grid-cols-2">
          <TabsTrigger value="rating" className="text-xs sm:text-sm">Рейтинг</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="rating" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск вуза по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все категории</SelectItem>
                  <SelectItem value="tech">Технические</SelectItem>
                  <SelectItem value="humanities">Гуманитарные</SelectItem>
                  <SelectItem value="medical">Медицинские</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* University List */}
          <div className="space-y-4">
            {filteredUniversities.map((uni) => (
              <UniversityCard key={uni.rank} {...uni} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Заявок за месяц</p>
                <Badge variant="secondary">+8.1%</Badge>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">32,000</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5 text-green-600" />
                Рост относительно прошлого месяца
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
              <p className="text-2xl sm:text-3xl mt-2">410</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
                Сезонный спад по некоторым категориям
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ActivityChart
              data={CHART_DATA}
              title="Динамика АК и заявок"
            />
            <ActivityChart
              data={POPULAR_SPECIALTIES_DATA}
              title="Популярность специальностей"
            />
          </div>

          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
              <div>
                <h3 className="text-base sm:text-lg">Сводка по топ ВУЗам</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Сравнение среднего АК на студента и динамики.
                </p>
              </div>
              <Badge variant="outline">Демо-данные</Badge>
            </div>
            <div className="overflow-x-auto border rounded-lg">
              <Table className="min-w-[480px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>ВУЗ</TableHead>
                    <TableHead className="text-right">Средний АК</TableHead>
                    <TableHead className="text-right">Студентов</TableHead>
                    <TableHead className="text-right">Тренд</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {UNIVERSITIES.slice(0, 5).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="whitespace-normal">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.location}</div>
                      </TableCell>
                      <TableCell className="text-right">{u.avgAK.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{u.students.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className={u.trend >= 0 ? "text-green-600" : "text-red-600"}>
                          {u.trend >= 0 ? "+" : ""}
                          {u.trend}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <StatsCard
              title="ИТ специальности"
              value="32,450"
              icon={TrendingUp}
              trend={{ value: 15.3, positive: true }}
              description="заявок в этом году"
            />
            <StatsCard
              title="Экономика"
              value="28,120"
              icon={TrendingUp}
              trend={{ value: 8.7, positive: true }}
              description="заявок в этом году"
            />
            <StatsCard
              title="Медицина"
              value="19,870"
              icon={TrendingUp}
              trend={{ value: 5.2, positive: true }}
              description="заявок в этом году"
            />
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </>
  );
}
