import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ActivityChart } from "../components/ActivityChart";
import { Coins, Calendar, Activity, LayoutGrid, LogOut, PanelLeft, Pencil, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { clearAuth, getAuthToken } from "../lib/auth";
import {
  applyAuthUserToProfile,
  clearProfile,
  getProfile,
  setProfile,
  type UserProfile,
} from "../lib/profile";
import { useNavigate } from "react-router";
import { parseAuthUserPayload, profileRequest } from "../lib/api";
import {
  getStudentClaims,
  persistStudentClaims,
  subscribeStudentClaimsUpdated,
  type StudentClaim,
} from "../lib/claims";
import { OnboardingDialog } from "../components/OnboardingDialog";
import { markOnboardingSeen } from "../lib/onboarding";

function getStatusBadgeVariant(status: StudentClaim["status"]): "default" | "secondary" | "outline" {
  if (status === "Принято") return "secondary";
  if (status === "Дополнить" || status === "Отклонено") return "outline";
  return "default";
}

function ProfileVariantCabinet({
  userData,
  activityHistory,
  chartData,
  onEdit,
  onOpenSupplement,
}: {
  userData: {
    name: string;
    email: string;
    university: string;
    specialty?: string;
    avatarDataUrl?: string;
    activeCoins: number;
    rank: number;
    totalStudents: number;
  };
  activityHistory: StudentClaim[];
  chartData: { month: string; rating: number; applications: number }[];
  onEdit: () => void;
  onOpenSupplement: (item: StudentClaim) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card className="lg:col-span-1 p-4 sm:p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mb-3 sm:mb-4">
            {userData.avatarDataUrl && <AvatarImage src={userData.avatarDataUrl} alt={userData.name} />}
            <AvatarFallback className="text-xl sm:text-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h2 className="mb-1 text-lg sm:text-xl">{userData.name}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 truncate w-full px-4">
            {userData.email}
          </p>
          <Badge variant="secondary" className="mb-3 sm:mb-4">
            {userData.university}
          </Badge>
          {userData.specialty && (
            <Badge variant="outline" className="mb-3 sm:mb-4 max-w-full truncate">
              {userData.specialty}
            </Badge>
          )}

          <div className="w-full space-y-3 sm:space-y-4 mt-3 sm:mt-4">
            <div className="p-3 sm:p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-2xl sm:text-3xl">
                  {userData.activeCoins.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Актив Коины (АК)</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-muted rounded-lg text-center">
                <p className="text-xl sm:text-2xl mb-1">#{userData.rank}</p>
                <p className="text-xs text-muted-foreground">Ранг в ВУЗе</p>
              </div>
              <div className="p-2 sm:p-3 bg-muted rounded-lg text-center">
                <p className="text-xl sm:text-2xl mb-1">
                  {userData.totalStudents.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Студентов</p>
              </div>
            </div>
          </div>

          <Button className="w-full mt-4 sm:mt-6" onClick={onEdit}>
            <Pencil className="w-4 h-4 mr-2" />
            Редактировать профиль
          </Button>
        </div>
      </Card>

      <Card className="lg:col-span-2 p-4 sm:p-6">
        <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">История АК пользователя</h3>
        <ActivityChart data={chartData} title="Рост АК за последние 6 месяцев" />
      </Card>

      <Card className="lg:col-span-3 p-4 sm:p-6">
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg shrink-0">История активности</h3>
            <div className="overflow-x-auto -mx-1 px-1 max-w-full">
            <TabsList className="inline-flex h-auto flex-nowrap w-max min-w-0">
              <TabsTrigger value="all" className="shrink-0 text-xs sm:text-sm px-2.5 sm:px-3">
                Все
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="shrink-0 text-xs sm:text-sm px-2.5 sm:px-3"
              >
                На проверке
              </TabsTrigger>
                <TabsTrigger value="accepted" className="shrink-0 text-xs sm:text-sm px-2.5 sm:px-3">
                Принято
              </TabsTrigger>
              <TabsTrigger value="rejected" className="shrink-0 text-xs sm:text-sm px-2.5 sm:px-3">
                Отклонено
              </TabsTrigger>
              <TabsTrigger value="supplement" className="shrink-0 text-xs sm:text-sm px-2.5 sm:px-3">
                Дополнить
              </TabsTrigger>
            </TabsList>
            </div>
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
                    <h4 className="mb-1 text-sm sm:text-base line-clamp-2">
                      {item.activity}
                    </h4>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate">
                          {new Date(item.date).toLocaleDateString("ru-RU")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>+{item.coins} АК</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {item.status === "Дополнить" && (
                    <Button size="sm" variant="outline" onClick={() => onOpenSupplement(item)}>
                      Дополнить
                    </Button>
                  )}
                  <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-3">
            {activityHistory
              .filter((item) => item.status === "На проверке")
              .map((item) => (
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
                          {new Date(item.date).toLocaleDateString("ru-RU")}
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

          <TabsContent value="accepted" className="space-y-3">
            {activityHistory
              .filter((item) => item.status === "Принято")
              .map((item) => (
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
                          {new Date(item.date).toLocaleDateString("ru-RU")}
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

          <TabsContent value="rejected" className="space-y-3">
            {activityHistory
              .filter((item) => item.status === "Отклонено")
              .map((item) => (
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
                          {new Date(item.date).toLocaleDateString("ru-RU")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          +{item.coins} АК
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="supplement" className="space-y-3">
            {activityHistory
              .filter((item) => item.status === "Дополнить")
              .map((item) => (
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
                          {new Date(item.date).toLocaleDateString("ru-RU")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4" />
                          +{item.coins} АК
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => onOpenSupplement(item)}>
                      Дополнить
                    </Button>
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                  </div>
                </div>
              ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

function ProfileVariantCompact({
  userData,
  activityHistory,
  onEdit,
  onOpenSupplement,
}: {
  userData: {
    name: string;
    email: string;
    university: string;
    specialty?: string;
    avatarDataUrl?: string;
    activeCoins: number;
    rank: number;
  };
  activityHistory: StudentClaim[];
  onEdit: () => void;
  onOpenSupplement: (item: StudentClaim) => void;
}) {
  const topActivities = useMemo(() => {
    return [...activityHistory].sort((a, b) => b.coins - a.coins).slice(0, 5);
  }, [activityHistory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card className="p-4 sm:p-6 lg:col-span-1">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14">
            {userData.avatarDataUrl && <AvatarImage src={userData.avatarDataUrl} alt={userData.name} />}
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg truncate">{userData.name}</h2>
              <Badge variant="secondary">{userData.university}</Badge>
              {userData.specialty && (
                <Badge variant="outline" className="max-w-[200px] truncate">
                  {userData.specialty}
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{userData.email}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Баланс</p>
            <p className="text-lg sm:text-xl mt-1 flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-500" />
              {userData.activeCoins.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">Ранг</p>
            <p className="text-lg sm:text-xl mt-1">#{userData.rank}</p>
          </div>
        </div>

        <Button className="w-full mt-4" variant="outline" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-2" />
          Редактировать
        </Button>
      </Card>

      <Card className="p-4 sm:p-6 lg:col-span-2">
        <h3 className="mb-4 sm:mb-6 text-base sm:text-lg">Топ активностей</h3>
        <div className="space-y-3">
          {topActivities.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm line-clamp-2">{item.activity}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(item.date).toLocaleDateString("ru-RU")}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                {item.status === "Дополнить" && (
                  <Button size="sm" variant="outline" onClick={() => onOpenSupplement(item)}>
                    Дополнить
                  </Button>
                )}
                <Badge variant={getStatusBadgeVariant(item.status)}>
                  {item.status}
                </Badge>
                <div className="flex items-center gap-1 text-sm">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium">+{item.coins}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const [variant, setVariant] = useState<"cabinet" | "compact">("cabinet");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const supplementFileRef = useRef<HTMLInputElement | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [supplementOpen, setSupplementOpen] = useState(false);
  const [supplementText, setSupplementText] = useState("");
  const [supplementPhotoDataUrl, setSupplementPhotoDataUrl] = useState<string | undefined>(undefined);
  const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
  const [apiAuthStatus, setApiAuthStatus] = useState<"loading" | "ok" | "error">("loading");

  const [profile, setProfileState] = useState<UserProfile>(() => {
    const stored = getProfile();
    return (
      stored ?? {
        name: "Пользователь",
        university: "—",
        email: "user@example.com",
      }
    );
  });

  useEffect(() => {
    const stored = getProfile();
    if (stored) setProfileState(stored);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setApiAuthStatus("error");
      return;
    }

    let cancelled = false;
    profileRequest(token).then((result) => {
      if (cancelled) return;
      setApiAuthStatus(result.ok ? "ok" : "error");
      if (result.ok) {
        const next = applyAuthUserToProfile(parseAuthUserPayload(result.data));
        setProfileState(next);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return subscribeStudentClaimsUpdated(() => {
      setActivityHistory(getStudentClaims());
    });
  }, []);

  const [editEmail, setEditEmail] = useState(profile.email);
  const [editAvatarDataUrl, setEditAvatarDataUrl] = useState<string | undefined>(profile.avatarDataUrl);

  useEffect(() => {
    if (!editOpen) return;
    setEditEmail(profile.email);
    setEditAvatarDataUrl(profile.avatarDataUrl);
  }, [editOpen, profile.avatarDataUrl, profile.email]);

  const [activityHistory, setActivityHistory] = useState<StudentClaim[]>(() => getStudentClaims());

  const chartData = [
    { month: "Янв", rating: 18000, applications: 0 },
    { month: "Фев", rating: 19500, applications: 0 },
    { month: "Мар", rating: 21200, applications: 0 },
    { month: "Апр", rating: 23800, applications: 0 },
    { month: "Май", rating: 24500, applications: 0 },
    { month: "Июн", rating: 25430, applications: 0 },
  ];

  const userData = {
    name: profile.name,
    email: profile.email,
    university: profile.university,
    specialty: profile.specialty,
    avatarDataUrl: profile.avatarDataUrl,
    activeCoins: 25430,
    rank: 142,
    totalStudents: 45000,
  };

  const onLogout = () => {
    clearAuth();
    clearProfile();
    navigate("/login");
  };

  const onOpenEdit = () => setEditOpen(true);

  const onPickAvatar = () => fileInputRef.current?.click();

  const onAvatarSelected = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : undefined;
      setEditAvatarDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onSaveProfile = () => {
    const next: UserProfile = {
      ...profile,
      email: editEmail.trim(),
      avatarDataUrl: editAvatarDataUrl,
    };
    setProfile(next);
    setProfileState(next);
    setEditOpen(false);
  };

  const selectedActivity = activityHistory.find((item) => item.id === selectedActivityId) ?? null;

  const onOpenSupplement = (item: StudentClaim) => {
    setSelectedActivityId(item.id);
    setSupplementText("");
    setSupplementPhotoDataUrl(undefined);
    setSupplementOpen(true);
  };

  const onSupplementPhotoSelected = (file: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : undefined;
      setSupplementPhotoDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const onSubmitSupplement = () => {
    const text = supplementText.trim();
    const hasPhoto = Boolean(supplementPhotoDataUrl);
    if (!selectedActivityId || (!text && !hasPhoto)) return;

    const entry = {
      text: text || (hasPhoto ? "Прикреплено фото-доказательство" : ""),
      photoDataUrl: supplementPhotoDataUrl,
      createdAt: new Date().toISOString(),
    };

    setActivityHistory((prev) => {
      const next = prev.map((item) =>
        item.id === selectedActivityId
          ? {
              ...item,
              status: "На проверке" as const,
              supplements: [...item.supplements, entry],
            }
          : item,
      );
      persistStudentClaims(next);
      return next;
    });

    setSupplementOpen(false);
    setSupplementText("");
    setSupplementPhotoDataUrl(undefined);
    setSelectedActivityId(null);
    if (supplementFileRef.current) supplementFileRef.current.value = "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl mb-2">Профиль</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Ваш аккаунт и история начислений АК.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            API профиль:{" "}
            {apiAuthStatus === "loading"
              ? "проверка..."
              : apiAuthStatus === "ok"
                ? "доступ подтвержден"
                : "ошибка авторизации"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={variant === "cabinet" ? "default" : "outline"}
            onClick={() => setVariant("cabinet")}
          >
            <PanelLeft className="w-4 h-4 mr-2" />
            Кабинет
          </Button>
          <Button
            size="sm"
            variant={variant === "compact" ? "default" : "outline"}
            onClick={() => setVariant("compact")}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Компактный
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setOnboardingOpen(true)}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Обучение
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы сможете войти снова. Имя и университет изменяются только при создании нового аккаунта.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={onLogout}>Выйти</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {variant === "cabinet" ? (
        <ProfileVariantCabinet
          userData={userData}
          activityHistory={activityHistory}
          chartData={chartData}
          onEdit={onOpenEdit}
          onOpenSupplement={onOpenSupplement}
        />
      ) : (
        <ProfileVariantCompact
          userData={{
            name: userData.name,
            email: userData.email,
            university: userData.university,
            specialty: userData.specialty,
            avatarDataUrl: userData.avatarDataUrl,
            activeCoins: userData.activeCoins,
            rank: userData.rank,
          }}
          activityHistory={activityHistory}
          onEdit={onOpenEdit}
          onOpenSupplement={onOpenSupplement}
        />
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование профиля</DialogTitle>
            <DialogDescription>
              Можно изменить аватар и почту. Имя и университет меняются только при пересоздании аккаунта.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-5">
            <div>
              <Label>Аватар</Label>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                <Avatar className="w-16 h-16">
                  {editAvatarDataUrl && <AvatarImage src={editAvatarDataUrl} alt={profile.name} />}
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onAvatarSelected(e.target.files?.[0] ?? null)}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={onPickAvatar} className="w-full sm:w-auto">
                    Выбрать фото
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditAvatarDataUrl(undefined)}
                    disabled={!editAvatarDataUrl}
                    className="w-full sm:w-auto"
                  >
                    Убрать
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Имя</Label>
                <Input id="profile-name" value={profile.name} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-university">Университет</Label>
                <Input id="profile-university" value={profile.university} disabled />
              </div>
              {profile.specialty && (
                <div className="space-y-2">
                  <Label htmlFor="profile-specialty">Специальность</Label>
                  <Input id="profile-specialty" value={profile.specialty} disabled />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="profile-email">Почта</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="example@university.ru"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
              Отмена
            </Button>
            <Button type="button" onClick={onSaveProfile} disabled={editEmail.trim().length === 0}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={supplementOpen}
        onOpenChange={(open) => {
          setSupplementOpen(open);
          if (!open) {
            setSupplementText("");
            setSupplementPhotoDataUrl(undefined);
            setSelectedActivityId(null);
            if (supplementFileRef.current) supplementFileRef.current.value = "";
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Дополнение заявки</DialogTitle>
            <DialogDescription>
              Добавьте комментарий и/или фото-доказательство. Нужно хотя бы одно: текст или изображение. После отправки заявка вернётся в статус «На проверке».
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">
              {selectedActivity ? `Заявка: ${selectedActivity.activity}` : "Заявка не выбрана"}
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplement-text">Комментарий / дополнение</Label>
              <Textarea
                id="supplement-text"
                value={supplementText}
                onChange={(e) => setSupplementText(e.target.value)}
                placeholder="Опишите, что добавлено к заявке (необязательно, если прикрепляете только фото)..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Фото-доказательство</Label>
              <input
                ref={supplementFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onSupplementPhotoSelected(e.target.files?.[0] ?? null)}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => supplementFileRef.current?.click()}>
                  Выбрать фото
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSupplementPhotoDataUrl(undefined);
                    if (supplementFileRef.current) supplementFileRef.current.value = "";
                  }}
                  disabled={!supplementPhotoDataUrl}
                >
                  Убрать фото
                </Button>
              </div>
              {supplementPhotoDataUrl && (
                <div className="rounded-lg border overflow-hidden bg-muted/30 max-w-full">
                  <img
                    src={supplementPhotoDataUrl}
                    alt="Предпросмотр"
                    className="max-h-48 w-auto object-contain mx-auto block"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSupplementOpen(false)}>
              Отмена
            </Button>
            <Button
              type="button"
              onClick={onSubmitSupplement}
              disabled={!supplementText.trim() && !supplementPhotoDataUrl}
            >
              Отправить дополнение
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OnboardingDialog
        open={onboardingOpen}
        onOpenChange={setOnboardingOpen}
        onComplete={() => markOnboardingSeen()}
      />
    </div>
  );
}

