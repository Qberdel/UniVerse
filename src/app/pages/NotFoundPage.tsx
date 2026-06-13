import { Link } from "react-router";
import { Compass } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function NotFoundPage() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 min-h-[calc(100vh-220px)] flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-12 -left-12 w-56 h-56 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-secondary/30 blur-3xl animate-pulse" />
      </div>

      <Card className="relative z-10 w-full max-w-2xl p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="mx-auto mb-5 w-16 h-16 rounded-xl bg-primary/10 text-primary flex items-center justify-center animate-bounce">
          <Compass className="w-8 h-8" />
        </div>
        <p className="text-5xl sm:text-6xl font-semibold tracking-tight mb-2">404</p>
        <h1 className="text-xl sm:text-2xl mb-3">Страница не найдена</h1>
        <p className="text-sm sm:text-base text-muted-foreground mb-7">
          Похоже, ссылка устарела или страница была перемещена.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/dashboard">На главную</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
