import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="text-8xl font-heading font-bold text-primary/20 mb-4">404</div>
          
          <h1 className="font-heading text-2xl md:text-3xl font-semibold mb-4">
            Página no encontrada
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Puede que el enlace esté roto o que la dirección se haya escrito incorrectamente.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Ir al Inicio
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link to="/recursos">
                <Search className="w-4 h-4" />
                Explorar Recursos
              </Link>
            </Button>
          </div>

          <div className="mt-12 p-6 rounded-xl bg-accent/50 text-left">
            <h2 className="font-heading font-semibold mb-3">¿Buscabas algo específico?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/que-es-neurodivergencia" className="text-primary hover:underline">
                  → ¿Qué es la Neurodivergencia?
                </Link>
              </li>
              <li>
                <Link to="/autodescubrimiento" className="text-primary hover:underline">
                  → Mi Viaje de Autodescubrimiento
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-primary hover:underline">
                  → Tests de Autoevaluación
                </Link>
              </li>
              <li>
                <Link to="/diario" className="text-primary hover:underline">
                  → El Diario del Autodescubrimiento
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
