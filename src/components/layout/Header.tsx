import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Brain, Settings, LogIn, LogOut, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
const navItems = [
  { href: '/que-es-neurodivergencia', label: '¿Qué es la Neurodivergencia?' },
  { href: '/autodescubrimiento', label: 'Mi Viaje de Autodescubrimiento' },
  { href: '/recursos', label: 'Recursos y Herramientas' },
  { href: '/diario', label: 'El Diario' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-[4.5rem]">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors focus-ring rounded-lg px-2 py-1"
            aria-label="Espacio NeuroDivergente - Inicio"
          >
            <Brain className="w-8 h-8 text-primary" aria-hidden="true" />
            <span className="font-heading font-semibold text-lg hidden sm:block">
              Espacio NeuroDivergente
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-ring",
                  location.pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* User Auth */}
            {user ? (
              <>
                {/* Admin Link */}
                {isAdmin && (
                  <Link to="/admin/articles">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="focus-ring"
                      aria-label="Panel de administración"
                    >
                      <Settings className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </Link>
                )}
                <Link to="/auth">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="focus-ring"
                    aria-label="Mi cuenta"
                  >
                    <User className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="focus-ring gap-2"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Entrar</span>
                </Button>
              </Link>
            )}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="focus-ring"
              aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Sun className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden focus-ring"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav 
            id="mobile-menu"
            className="lg:hidden py-4 border-t border-border animate-fade-in"
            aria-label="Navegación móvil"
          >
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-base font-medium transition-colors focus-ring",
                      location.pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
