import { useEffect, useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CheckCircle2, FileText, HelpCircle, Search, Shield, XCircle } from "lucide-react";

type ModerationStatus = "pending" | "accepted" | "rejected" | "need_info";

type ModerationRequest = {
  id: string;
  createdAt: string; // ISO
  studentName: string;
  university: string;
  category: string;
  title: string;
  requestedAK?: number;
  status: ModerationStatus;
};

function statusBadge(status: ModerationStatus) {
  switch (status) {
    case "pending":
      return <Badge variant="default">На модерации</Badge>;
    case "accepted":
      return <Badge variant="secondary">Принято</Badge>;
    case "need_info":
      return <Badge variant="outline">Нужны данные</Badge>;
    case "rejected":
      return <Badge variant="destructive">Отклонено</Badge>;
  }
}

export function ModeratorPage() {
  const [query, setQuery] = useState("");
  const [universityFilter, setUniversityFilter] = useState<string>("all");
  const [hintOpen, setHintOpen] = useState(false);

  useEffect(() => {
    // Подсказка должна показываться при каждом заходе на страницу.
    setHintOpen(true);
  }, []);

  const [requests, setRequests] = useState<ModerationRequest[]>([
    {
      id: "REQ-1024",
      createdAt: "2026-04-28T10:45:00.000Z",
      studentName: "Иван Петров",
      university: "МГУ",
      category: "Академическая деятельность",
      title: "Участие в олимпиаде по физике (призёр)",
      requestedAK: 500,
      status: "pending",
    },
    {
      id: "REQ-1025",
      createdAt: "2026-04-27T15:10:00.000Z",
      studentName: "Мария Смирнова",
      university: "СПбГУ",
      category: "Волонтерство",
      title: "Волонтерство на городском фестивале",
      requestedAK: 300,
      status: "need_info",
    },
    {
      id: "REQ-1026",
      createdAt: "2026-04-26T09:20:00.000Z",
      studentName: "Алексей Иванов",
      university: "НИУ ВШЭ",
      category: "Научная работа",
      title: "Публикация статьи в сборнике конференции",
      requestedAK: 800,
      status: "accepted",
    },
    {
      id: "REQ-1027",
      createdAt: "2026-04-24T18:05:00.000Z",
      studentName: "Екатерина Орлова",
      university: "НГУ",
      category: "Спортивные достижения",
      title: "Победа в студенческих соревнованиях",
      requestedAK: 600,
      status: "rejected",
    },
  ]);

  const universities = useMemo(() => {
    const unique = Array.from(new Set(requests.map((r) => r.university)));
    return unique.sort((a, b) => a.localeCompare(b, "ru"));
  }, [requests]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      const matchesUniversity = universityFilter === "all" ? true : r.university === universityFilter;
      const matchesQuery =
        q.length === 0
          ? true
          : [
              r.id,
              r.studentName,
              r.university,
              r.category,
              r.title,
            ].some((v) => v.toLowerCase().includes(q));
      return matchesUniversity && matchesQuery;
    });
  }, [query, requests, universityFilter]);

  const byStatus = useMemo(() => {
    const group: Record<ModerationStatus, ModerationRequest[]> = {
      pending: [],
      accepted: [],
      rejected: [],
      need_info: [],
    };
    for (const r of filtered) group[r.status].push(r);
    return group;
  }, [filtered]);

  const updateStatus = (id: string, next: ModerationStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
  };

  const renderTable = (items: ModerationRequest[]) => (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Заявка</TableHead>
            <TableHead>Студент</TableHead>
            <TableHead>ВУЗ</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>АК</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((r) => (
            <TableRow key={r.id} className="!align-top">
              <TableCell className="!whitespace-normal !align-top">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{r.id}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground whitespace-normal break-words">
                    {r.title}
                  </div>
                </div>
              </TableCell>
              <TableCell className="!whitespace-normal !align-top break-words">{r.studentName}</TableCell>
              <TableCell className="!align-top">{r.university}</TableCell>
              <TableCell className="!whitespace-normal !align-top break-words">{r.category}</TableCell>
              <TableCell className="!align-top">{typeof r.requestedAK === "number" ? `${r.requestedAK}` : "—"}</TableCell>
              <TableCell className="!align-top">{statusBadge(r.status)}</TableCell>
              <TableCell className="text-right !align-top">
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    size="sm"
                    className="sm:w-auto"
                    onClick={() => updateStatus(r.id, "accepted")}
                    disabled={r.status === "accepted"}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Принять
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(r.id, "need_info")}
                    disabled={r.status === "need_info"}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Запросить
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(r.id, "rejected")}
                    disabled={r.status === "rejected"}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Отклонить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground whitespace-normal">
                Ничего не найдено по текущим фильтрам.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl sm:text-2xl">Страница модератора</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Проверка заявок на добавление активности и изменение их статуса.
            </p>
          </div>
          <Dialog open={hintOpen} onOpenChange={setHintOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Подсказка</DialogTitle>
                <DialogDescription>
                  В первой версии это демонстрационная модерация: статусы меняются локально.
                  Позже можно подключить API и хранение файлов доказательств.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по заявкам..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={universityFilter} onValueChange={setUniversityFilter}>
              <SelectTrigger className="w-full sm:w-56">
                <SelectValue placeholder="ВУЗ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все ВУЗы</SelectItem>
                {universities.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="pending">
            <TabsList className="grid w-full max-w-full sm:max-w-xl grid-cols-4">
              <TabsTrigger value="pending" className="text-xs sm:text-sm">
                На модерации ({byStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="need_info" className="text-xs sm:text-sm">
                Запрос ({byStatus.need_info.length})
              </TabsTrigger>
              <TabsTrigger value="accepted" className="text-xs sm:text-sm">
                Принято ({byStatus.accepted.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                Отклонено ({byStatus.rejected.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4 sm:mt-6">
              {renderTable(byStatus.pending)}
            </TabsContent>
            <TabsContent value="need_info" className="mt-4 sm:mt-6">
              {renderTable(byStatus.need_info)}
            </TabsContent>
            <TabsContent value="accepted" className="mt-4 sm:mt-6">
              {renderTable(byStatus.accepted)}
            </TabsContent>
            <TabsContent value="rejected" className="mt-4 sm:mt-6">
              {renderTable(byStatus.rejected)}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

