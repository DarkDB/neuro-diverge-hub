import { Link } from 'react-router-dom';
import { Brain, Heart, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" aria-hidden="true" />
              <span className="font-heading font-semibold">Espacio NeuroDivergente</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Un espacio seguro para explorar, comprender y celebrar la neurodiversidad.
            </p>
            <div className="flex items-center gap-2">
              <a 
                href="https://instagram.com/espacioneurodivergente_oficial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors focus-ring rounded p-1"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm">@espacioneurodivergente_oficial</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Explora</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/que-es-neurodivergencia" className="text-sm text-muted-foreground hover:text-primary transition-colors focus-ring rounded">
                  ¿Qué es la Neurodivergencia?
                </Link>
              </li>
              <li>
                <Link to="/autodescubrimiento" className="text-sm text-muted-foreground hover:text-primary transition-colors focus-ring rounded">
                  Mi Viaje de Autodescubrimiento
                </Link>
              </li>
              <li>
                <Link to="/recursos" className="text-sm text-muted-foreground hover:text-primary transition-colors focus-ring rounded">
                  Recursos y Herramientas
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-sm text-muted-foreground hover:text-primary transition-colors focus-ring rounded">
                  Tests de Autoevaluación
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors focus-ring rounded">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors focus-ring rounded">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/aviso-legal" className="text-sm text-muted-foreground hover:text-primary transition-colors focus-ring rounded">
                  Aviso Legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Espacio NeuroDivergente. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-destructive" aria-label="amor" /> para mentes diversas
          </p>
        </div>
      </div>
    </footer>
  );
}
