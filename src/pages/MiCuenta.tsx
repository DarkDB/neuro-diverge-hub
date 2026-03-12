import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  ClipboardCheck,
  Download,
  FileText,
  Loader2,
  LogOut,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface TestCompletion {
  id: string;
  test_name: string;
  puntuacion: number | null;
  max_puntuacion: number | null;
  banda: string | null;
  completed_at: string;
}

interface ScreeningSession {
  id: string;
  status: string;
  destinatario: string;
  edad: string;
  paid: boolean;
  created_at: string;
  completed_at: string | null;
}

interface ResourcePurchase {
  id: string;
  purchased_at: string;
  resource: {
    title: string;
    file_type: string;
    file_url: string;
  } | null;
}

const SCREENING_STEPS = [
  { key: "fase1", label: "Cuestionario inicial", pct: 25 },
  { key: "teaser", label: "Avance personalizado", pct: 40 },
  { key: "fase2", label: "Análisis profundo", pct: 65 },
  { key: "fase3", label: "Fase final", pct: 85 },
  { key: "completed", label: "Informe completo", pct: 100 },
  { key: "complete", label: "Informe completo", pct: 100 },
];

const BANDA_COLORS: Record<string, string> = {
  baja: "bg-green-500/15 text-green-700 dark:text-green-400",
  media: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  alta: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  "muy alta": "bg-red-500/15 text-red-700 dark:text-red-400",
};

export default function MiCuenta() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tests, setTests] = useState<TestCompletion[]>([]);
  const [sessions, setSessions] = useState<ScreeningSession[]>([]);
  const [purchases, setPurchases] = useState<ResourcePurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/mi-cuenta");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [testsRes, sessionsRes, purchasesRes] = await Promise.all([
          supabase
            .from("test_completions")
            .select("id, test_name, puntuacion, max_puntuacion, banda, completed_at")
            .eq("user_id", user!.id)
            .order("completed_at", { ascending: false }),
          supabase
            .from("screening_sessions")
            .select("id, status, destinatario, edad, paid, created_at, completed_at")
            .order("created_at", { ascending: false }),
          supabase
            .from("resource_purchases")
            .select("id, purchased_at, resource_id, downloadable_resources(title, file_type, file_url)")
            .order("purchased_at", { ascending: false }),
        ]);

        setTests(testsRes.data || []);
        setSessions(sessionsRes.data || []);
        setPurchases(
          (purchasesRes.data || []).map((p: any) => ({
            id: p.id,
            purchased_at: p.purchased_at,
            resource: p.downloadable_resources || null,
          }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar tus datos");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getScreeningProgress = (status: string) => {
    const step = SCREENING_STEPS.find((s) => s.key === status);
    return step || { key: status, label: status, pct: 10 };
  };

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const displayName =
    user.user_metadata?.display_name || user.email?.split("@")[0] || "Usuario";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {displayName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                Hola, {displayName}
              </h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 self-start">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Screening Sessions */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Mi Viaje de Autodescubrimiento
              </h2>

              {sessions.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      Aún no has iniciado ningún cuestionario de autodescubrimiento.
                    </p>
                    <Button
                      className="mt-4"
                      onClick={() => navigate("/autodescubrimiento")}
                    >
                      Comenzar ahora
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {sessions.map((s) => {
                    const progress = getScreeningProgress(s.status);
                    const isComplete = progress.pct === 100;
                    return (
                      <Card key={s.id}>
                        <CardContent className="py-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="capitalize font-medium">
                                Para: {s.destinatario}
                              </span>
                              <span className="text-muted-foreground">
                                · {s.edad} años
                              </span>
                            </div>
                            <Badge
                              variant={isComplete ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {isComplete ? "Completado" : progress.label}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{progress.label}</span>
                              <span>{progress.pct}%</span>
                            </div>
                            <Progress value={progress.pct} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Iniciado: {formatDate(s.created_at)}</span>
                            {!isComplete && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate("/autodescubrimiento")}
                                className="text-xs h-7"
                              >
                                Continuar
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Tests */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-primary" />
                Tests Realizados
              </h2>

              {tests.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <ClipboardCheck className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No has completado ningún test todavía.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate("/tests")}
                    >
                      Explorar tests
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {tests.map((t) => {
                    const bandaClass =
                      BANDA_COLORS[t.banda?.toLowerCase() || ""] ||
                      "bg-muted text-muted-foreground";
                    return (
                      <Card key={t.id}>
                        <CardContent className="py-4 space-y-2">
                          <p className="font-medium text-sm">{t.test_name}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {t.puntuacion !== null && (
                              <span className="text-xs text-muted-foreground">
                                {t.puntuacion}/{t.max_puntuacion} puntos
                              </span>
                            )}
                            {t.banda && (
                              <Badge className={`${bandaClass} text-xs`}>
                                {t.banda}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(t.completed_at)}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Resource Purchases */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Mis Descargas y Compras
              </h2>

              {purchases.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">
                      No tienes compras de recursos todavía.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => navigate("/recursos")}
                    >
                      Ver recursos
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3">
                  {purchases.map((p) => (
                    <Card key={p.id}>
                      <CardContent className="py-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {p.resource?.title || "Recurso"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(p.purchased_at)}
                          </p>
                        </div>
                        {p.resource?.file_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="gap-1 text-xs"
                          >
                            <a
                              href={p.resource.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="w-3 h-3" />
                              Descargar
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
