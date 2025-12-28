import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";

// Pages
import Index from "./pages/Index";
import QueEsNeurodivergencia from "./pages/QueEsNeurodivergencia";
import Autodescubrimiento from "./pages/Autodescubrimiento";
import Recursos from "./pages/Recursos";
import Tests from "./pages/Tests";
import Diario from "./pages/Diario";
import TDAHPage from "./pages/recursos/TDAH";
import Privacidad from "./pages/Privacidad";
import Cookies from "./pages/Cookies";
import AvisoLegal from "./pages/AvisoLegal";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ArticlesDashboard from "./pages/admin/ArticlesDashboard";
import ArticleEditor from "./pages/admin/ArticleEditor";
import ArticleView from "./pages/ArticleView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/que-es-neurodivergencia" element={<QueEsNeurodivergencia />} />
              <Route path="/autodescubrimiento" element={<Autodescubrimiento />} />
              <Route path="/recursos" element={<Recursos />} />
              <Route path="/recursos/tdah" element={<TDAHPage />} />
              <Route path="/tests" element={<Tests />} />
              <Route path="/diario" element={<Diario />} />
              <Route path="/diario/:slug" element={<ArticleView />} />
              <Route path="/admin/articulos" element={<ArticlesDashboard />} />
              <Route path="/admin/articulos/nuevo" element={<ArticleEditor />} />
              <Route path="/admin/articulos/:id" element={<ArticleEditor />} />
              <Route path="/privacidad" element={<Privacidad />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/aviso-legal" element={<AvisoLegal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
