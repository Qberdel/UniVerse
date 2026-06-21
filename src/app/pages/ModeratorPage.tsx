import { useEffect, useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { CheckCircle2, FileText, HelpCircle, Image as ImageIcon, Search, Shield, XCircle } from "lucide-react";
import { getClaimById, getStudentClaims, subscribeStudentClaimsUpdated } from "../lib/claims";
import { fetchAdminActivitiesRequest, updateActivityStatusRequest, type AdminActivity } from "../lib/api";
import { getAuthToken } from "../lib/auth";

type ModerationStatus = "pending" | "accepted" | "rejected" | "need_info";

type ModerationRequest = {
  id: string;
  activityId: number;
  createdAt: string;
  studentName: string;
  university: string;
  category: string;
  title: string;
  requestedAK?: number;
  status: ModerationStatus;
  linkClaimId?: number;
  images?: string[];
};

function mapAdminStatus(status: number, statusText?: string): ModerationStatus {
  const text = (statusText ?? "").toLowerCase();
  if (text.includes("прин") || status === 1) return "accepted";
  if (text.includes("откл") || status === 2) return "rejected";
  if (text.includes("дополн") || status === 3) return "need_info";
  return "pending";
}

function mapAdminActivity(activity: AdminActivity): ModerationRequest {
  return {
    id: `REQ-${activity.activity_id}`,
    activityId: activity.activity_id,
    createdAt: activity.created_at ?? activity.report_time ?? new Date().toISOString(),
    studentName: activity.user_name,
    university: activity.university_name,
    category: `Категория #${activity.category_id}`,
    title: activity.name,
    requestedAK: activity.points_awarded,
    status: mapAdminStatus(activity.status, activity.status_text),
    images: activity.images,
  };
}

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
  const [claimsTick, setClaimsTick] = useState(0);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [evidenceRequest, setEvidenceRequest] = useState<ModerationRequest | null>(null);

  const claims = useMemo(() => getStudentClaims(), [claimsTick]);

  useEffect(() => {
    return subscribeStudentClaimsUpdated(() => setClaimsTick((t) => t + 1));
  }, []);

  useEffect(() => {
    // Подсказка должна показываться при каждом заходе на страницу.
    setHintOpen(true);
  }, []);

  const [requests, setRequests] = useState<ModerationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoadError("Требуется авторизация администратора");
      setLoading(false);
      return;
    }

    let cancelled = false;
    fetchAdminActivitiesRequest(token).then((result) => {
      if (cancelled) return;
      if (!result.ok || !result.data) {
        setLoadError(result.error ?? "Не удалось загрузить заявки");
        setRequests([]);
      } else {
        setRequests(result.data.map(mapAdminActivity));
        setLoadError(null);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

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

  const updateStatus = async (request: ModerationRequest, next: ModerationStatus) => {
    const token = getAuthToken();
    if (!token) return;

    const statusMap: Record<ModerationStatus, number> = {
      pending: 0,
      accepted: 1,
      rejected: 2,
      need_info: 3,
    };

    const result = await updateActivityStatusRequest(token, request.activityId, {
      status: statusMap[next],
      points: request.requestedAK,
    });

    if (!result.ok) {
      setActionError(result.error ?? "Не удалось обновить статус");
      return;
    }

    setActionError(null);
    setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: next } : r)));
  };

  const openEvidence = (r: ModerationRequest) => {
    setEvidenceRequest(r);
    setEvidenceOpen(true);
  };

  const linkedClaim = evidenceRequest?.linkClaimId != null ? getClaimById(claims, evidenceRequest.linkClaimId) : undefined;

  const renderTable = (items: ModerationRequest[]) => (
    <div className="overflow-x-auto border rounded-lg">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead>Заявка</TableHead>
            <TableHead>Студент</TableHead>
            <TableHead>ВУЗ</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>АК</TableHead>
            <TableHead>Доказательства</TableHead>
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
              <TableCell className="!align-top">
                {r.images?.length ? (
                  <Button size="sm" variant="outline" className="whitespace-nowrap" onClick={() => openEvidence(r)}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Смотреть
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="!align-top">{statusBadge(r.status)}</TableCell>
              <TableCell className="text-right !align-top">
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button
                    size="sm"
                    className="sm:w-auto"
                    onClick={() => updateStatus(r, "accepted")}
                    disabled={r.status === "accepted"}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Принять
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(r, "need_info")}
                    disabled={r.status === "need_info"}
                  >
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Запросить
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(r, "rejected")}
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
              <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground whitespace-normal">
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
                  Заявки загружаются из API /admin. Статусы обновляются через PATCH /admin/activities/:id.
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

          {loadError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4">
              {loadError}
            </div>
          )}
          {actionError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-4">
              {actionError}
            </div>
          )}

          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Загрузка заявок...</p>
          ) : (
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1">
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
          )}
        </Card>
      </div>

      <Dialog open={evidenceOpen} onOpenChange={setEvidenceOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Доказательства по заявке</DialogTitle>
            <DialogDescription>
              {evidenceRequest ? `${evidenceRequest.id} — ${evidenceRequest.title}` : ""}
            </DialogDescription>
          </DialogHeader>
          {evidenceRequest?.images?.length ? (
            <div className="space-y-4">
              {evidenceRequest.images.map((url, idx) => (
                <div key={`${url}-${idx}`} className="rounded-lg border p-3">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={url}
                      alt={`Доказательство ${idx + 1}`}
                      className="max-h-64 w-full rounded-md object-contain bg-muted/50 border"
                    />
                  </a>
                </div>
              ))}
            </div>
          ) : linkedClaim && linkedClaim.supplements.length > 0 ? (
            <div className="space-y-4">
              {linkedClaim.supplements.map((s, idx) => (
                <div key={`${s.createdAt}-${idx}`} className="rounded-lg border p-3 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.createdAt).toLocaleString("ru-RU")}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{s.text}</p>
                  {s.photoDataUrl && (
                    <a href={s.photoDataUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <img
                        src={s.photoDataUrl}
                        alt={`Доказательство ${idx + 1}`}
                        className="max-h-64 w-full rounded-md object-contain bg-muted/50 border"
                      />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Нет загруженных дополнений для этой заявки.</p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEvidenceOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

