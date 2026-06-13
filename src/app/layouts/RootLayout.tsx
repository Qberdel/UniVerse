import { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router";
import { GraduationCap, Home, Menu as MenuIcon, User, Plus, ShieldCheck, Info } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

const NAV_LINKS = [
  { path: '/', icon: Info, label: 'О нас' },
  { path: '/dashboard', icon: Home, label: 'Главная' },
  { path: '/menu', icon: MenuIcon, label: 'Товары' },
  { path: '/add-activity', icon: Plus, label: 'Добавить заявку' },
  { path: '/profile', icon: User, label: 'Профиль' },
  { path: '/moderator', icon: ShieldCheck, label: 'Модерация' },
];

export function RootLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' || path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl">UniVerse</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Система АК университетов</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg">UniVerse</h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex gap-2">
              {NAV_LINKS.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path}>
                  <Button variant={isActive(path) ? 'default' : 'ghost'} size="sm">
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Tablet Navigation */}
            <nav className="hidden md:flex lg:hidden gap-1">
              {NAV_LINKS.map(({ path, icon: Icon, label }) => (
                <Link key={path} to={path}>
                  <Button variant={isActive(path) ? 'default' : 'ghost'} size="sm">
                    <Icon className="w-4 h-4" />
                    <span className="sr-only">{label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <MenuIcon className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {NAV_LINKS.map(({ path, icon: Icon, label }) => (
                    <Link key={path} to={path} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant={isActive(path) ? 'default' : 'ghost'}
                        className="w-full justify-start"
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-8 sm:mt-16 pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6 sm:pb-8">
          <p>© 2026 UniVerse - Система активности университетов</p>
          <p className="mt-2">
            <Link to="/privacy" className="text-primary hover:underline">
              Политика конфиденциальности
            </Link>
          </p>
          <p className="mt-2">Обновлено: Апрель 2026</p>
        </div>
      </footer>
    </div>
  );
}
