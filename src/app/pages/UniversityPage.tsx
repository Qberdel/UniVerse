import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ActivityChart } from '../components/ActivityChart';
import { Coins, MapPin, Users, TrendingUp } from 'lucide-react';
import { fetchUniversityDetailsRequest, type UniversityDetails } from '../lib/api';

const MONTH_LABELS: Record<string, string> = {
  '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
  '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
  '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь',
};

function formatMonthLabel(month: string): string {
  const parts = month.split('-');
  if (parts.length === 2) {
    return MONTH_LABELS[parts[1]] ?? month;
  }
  return month;
}

export function UniversityPage() {
  const { id } = useParams();
  const universityId = Number(id);
  const [details, setDetails] = useState<UniversityDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(universityId)) {
      setError('Неверный ID университета');
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetchUniversityDetailsRequest(universityId).then((result) => {
      if (cancelled) return;
      if (!result.ok || !result.data) {
        setError(result.error ?? 'Не удалось загрузить данные университета');
        setDetails(null);
      } else {
        setDetails(result.data);
        setError(null);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [universityId]);

  const activityData = useMemo(() => {
    if (!details?.monthly_dynamics?.length) return [];
    return details.monthly_dynamics.map((item) => ({
      month: formatMonthLabel(item.month).slice(0, 3),
      rating: item.points_received,
      applications: item.accepted_activities ?? 0,
    }));
  }, [details]);

  const monthlyAKHistory = useMemo(() => {
    if (!details?.monthly_dynamics?.length) return [];
    return details.monthly_dynamics.map((item) => ({
      month: formatMonthLabel(item.month),
      ak: item.points_received,
      students: details.students_count ?? 0,
    }));
  }, [details]);

  const specialtyPopularityData = useMemo(() => {
    if (!details?.specialities?.length) return [];
    return details.specialities.map((s) => ({
      month: s.name,
      rating: s.total_points ?? 0,
      applications: s.accepted_activities ?? 0,
    }));
  }, [details]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-muted-foreground">
        Загрузка данных университета...
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? 'Университет не найден'}
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/dashboard">Вернуться к рейтингу</Link>
        </Button>
      </div>
    );
  }

  const trend = details.points_change ?? 0;
  const lastApplications = details.monthly_activities ?? activityData.at(-1)?.applications ?? 0;
  const avgAKPerApplication = Math.round(details.avg_points_per_activity ?? 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="mb-2 text-xl sm:text-2xl">{details.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
              {details.region && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {details.region}
                </div>
              )}
              {details.students_count != null && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {details.students_count.toLocaleString()} студентов
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(details.specialities ?? []).map((specialty) => (
                <Badge key={specialty.speciality_id} variant="secondary" className="text-xs">
                  {specialty.name}
                </Badge>
              ))}
            </div>
          </div>
          <Card className="p-4 sm:p-6 lg:ml-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                <span className="text-2xl sm:text-3xl lg:text-4xl">{details.activity_points.toLocaleString()}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Общий счет АК</p>
              <div className={`flex items-center justify-center gap-1 text-xs sm:text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-3 h-3 sm:w-4 sm:h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}% за месяц
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link to="/compare">Сравнить с другими</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="activity" className="mb-6 sm:mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-1">
          <TabsTrigger value="activity" className="text-xs sm:text-sm">Аналитика</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">История АК</TabsTrigger>
          <TabsTrigger value="info" className="text-xs sm:text-sm">Инфо</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Заявок за месяц</p>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">{lastApplications.toLocaleString()}</p>
            </Card>

            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Принято</p>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">{(details.accepted_activities ?? 0).toLocaleString()}</p>
            </Card>

            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Отклонено</p>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">{(details.rejected_activities ?? 0).toLocaleString()}</p>
            </Card>

            <Card className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Среднее АК/заявка</p>
              </div>
              <p className="text-2xl sm:text-3xl mt-2">{avgAKPerApplication.toLocaleString()}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {activityData.length > 0 ? (
              <ActivityChart data={activityData} title="Динамика АК и заявок" />
            ) : (
              <Card className="p-6 text-sm text-muted-foreground">Нет данных по динамике</Card>
            )}
            {specialtyPopularityData.length > 0 ? (
              <ActivityChart data={specialtyPopularityData} title="Статистика по специальностям" />
            ) : (
              <Card className="p-6 text-sm text-muted-foreground">Нет данных по специальностям</Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4 sm:mt-6">
          <Card className="p-4 sm:p-6">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">История АК по месяцам</h3>
            <div className="space-y-2 sm:space-y-3">
              {monthlyAKHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">История пока недоступна</p>
              ) : (
                monthlyAKHistory.map((item) => (
                  <div
                    key={item.month}
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
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4 mt-4 sm:mt-6">
          <Card className="p-4 sm:p-6">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg">Информация о ВУЗе</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1">Полное название</p>
                <p className="text-sm sm:text-base">{details.name}</p>
              </div>
              {details.region && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Регион</p>
                  <p className="text-sm sm:text-base">{details.region}</p>
                </div>
              )}
              {details.students_count != null && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Количество студентов</p>
                  <p className="text-sm sm:text-base">{details.students_count.toLocaleString()}</p>
                </div>
              )}
              {details.avg_points != null && (
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Средний АК на студента</p>
                  <p className="text-sm sm:text-base">{details.avg_points.toLocaleString()}</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
