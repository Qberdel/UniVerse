import { useMemo, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ActivityChart } from "../components/ActivityChart";
import { ArrowLeftRight, GraduationCap, Info } from "lucide-react";

export function CompareUniversitiesPage() {
  const [universityA, setUniversityA] = useState<string>("МГУ");
  const [universityB, setUniversityB] = useState<string>("СПбГУ");

  // Заглушка без полного функционала: используем демо-данные для выбранных ВУЗов.
  const activityData = useMemo(
    () => [
      { month: "Янв", rating: 920000, applications: 1200 },
      { month: "Фев", rating: 935000, applications: 1400 },
      { month: "Мар", rating: 950000, applications: 1800 },
      { month: "Апр", rating: 970000, applications: 2100 },
      { month: "Май", rating: 975000, applications: 2000 },
      { month: "Июн", rating: 985000, applications: 2300 },
    ],
    [],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="mb-2 text-xl sm:text-2xl">Сравнение университетов</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Пока демонстрация без полного функционала: данные и графики — пример.
            </p>
          </div>

          <Card className="p-4 sm:p-6 lg:ml-6 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
              <span className="text-sm sm:text-base font-medium">Два ВУЗа</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{universityA}</Badge>
              <Badge variant="outline">{universityB}</Badge>
            </div>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="compare" className="mb-6 sm:mb-8">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-1">
          <TabsTrigger value="compare" className="text-xs sm:text-sm">
            Сравнение
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">
            Аналитика
          </TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">
            О демо
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-base sm:text-lg">Университет A</h3>
              </div>

              <Select value={universityA} onValueChange={setUniversityA}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ВУЗ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="МГУ">МГУ</SelectItem>
                  <SelectItem value="СПбГУ">СПбГУ</SelectItem>
                  <SelectItem value="НГУ">НГУ</SelectItem>
                  <SelectItem value="МФТИ">МФТИ</SelectItem>
                  <SelectItem value="НИУ ВШЭ">НИУ ВШЭ</SelectItem>
                  <SelectItem value="ТГУ">ТГУ</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Поиск (демо)</p>
                <Input value={universityA} onChange={(e) => setUniversityA(e.target.value)} />
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-base sm:text-lg">Университет B</h3>
              </div>

              <Select value={universityB} onValueChange={setUniversityB}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ВУЗ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="МГУ">МГУ</SelectItem>
                  <SelectItem value="СПбГУ">СПбГУ</SelectItem>
                  <SelectItem value="НГУ">НГУ</SelectItem>
                  <SelectItem value="МФТИ">МФТИ</SelectItem>
                  <SelectItem value="НИУ ВШЭ">НИУ ВШЭ</SelectItem>
                  <SelectItem value="ТГУ">ТГУ</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Поиск (демо)</p>
                <Input value={universityB} onChange={(e) => setUniversityB(e.target.value)} />
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <ActivityChart data={activityData} title={`Динамика — ${universityA}`} />
            <ActivityChart data={activityData} title={`Динамика — ${universityB}`} />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4 sm:mt-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Метрики A</span>
                <Badge variant="secondary">{universityA}</Badge>
              </div>
              <div className="text-sm">
                <p>Средний АК/заявка: демо</p>
                <p>Рост активности: демо</p>
                <p>Доля принятых: демо</p>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Метрики B</span>
                <Badge variant="outline">{universityB}</Badge>
              </div>
              <div className="text-sm">
                <p>Средний АК/заявка: демо</p>
                <p>Рост активности: демо</p>
                <p>Доля принятых: демо</p>
              </div>
            </Card>
          </div>
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-base sm:text-lg">Подсказка</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              В этой версии сравнение не подключает API и не строит реальные различия.
              Следующим шагом можно добавить загрузку данных для двух ВУЗов.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-4 sm:mt-6">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg mb-2">О демо-странице</h3>
            <p className="text-sm text-muted-foreground">
              Страница создана как UI-заглушка. Выбор ВУЗов работает, но аналитика основана на демо-данных.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setUniversityA("МГУ");
                  setUniversityB("СПбГУ");
                }}
              >
                Сбросить демо
              </Button>
              <Button
                onClick={() => {
                  // намеренно пусто: без полного функционала
                }}
              >
                Показать результат
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

