import { useState } from 'react';
import { Mail, Send, Users, Brain, BookOpen, Loader2, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function EmailsTab() {
  const [isLoadingReengagement, setIsLoadingReengagement] = useState(false);
  const [isLoadingNewsletter, setIsLoadingNewsletter] = useState(false);
  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');
  const [lastResults, setLastResults] = useState<any>(null);

  async function sendReengagementEmails(type: string) {
    setIsLoadingReengagement(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-reengagement-emails', {
        body: { type },
      });
      if (error) throw error;
      setLastResults(data);
      const totalSent = data.results?.reduce((acc: number, r: any) => acc + r.sent, 0) || 0;
      toast.success(`Se enviaron ${totalSent} email(s) de reenganche`);
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al enviar emails de reenganche');
    } finally {
      setIsLoadingReengagement(false);
    }
  }

  async function sendNewsletter(testMode: boolean) {
    if (!newsletterSubject.trim() || !newsletterContent.trim()) {
      toast.error('Rellena el asunto y el contenido');
      return;
    }
    setIsLoadingNewsletter(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subject: newsletterSubject,
          htmlContent: newsletterContent,
          testMode,
        },
      });
      if (error) throw error;
      toast.success(
        testMode
          ? `Email de prueba enviado a 1 suscriptor`
          : `Newsletter enviada a ${data.sent} suscriptor(es)`
      );
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Error al enviar la newsletter');
    } finally {
      setIsLoadingNewsletter(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Gestión de Emails
        </h2>
        <p className="text-sm text-muted-foreground">
          Envía emails de reenganche y newsletters a tus usuarios
        </p>
      </div>

      {/* Reengagement Emails */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Emails de Reenganche
          </CardTitle>
          <CardDescription>
            Envía recordatorios automáticos a usuarios con procesos pendientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => sendReengagementEmails('unfinished_screening')}
              disabled={isLoadingReengagement}
              className="gap-2 h-auto py-4 flex-col"
            >
              {isLoadingReengagement ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Brain className="w-5 h-5 text-primary" />
              )}
              <span className="text-sm font-medium">Tests incompletos</span>
              <span className="text-xs text-muted-foreground">Autodescubrimiento pendiente</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => sendReengagementEmails('resource_recommendations')}
              disabled={isLoadingReengagement}
              className="gap-2 h-auto py-4 flex-col"
            >
              {isLoadingReengagement ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <BookOpen className="w-5 h-5 text-primary" />
              )}
              <span className="text-sm font-medium">Recomendar recursos</span>
              <span className="text-xs text-muted-foreground">Basado en tests recientes</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => sendReengagementEmails('all')}
              disabled={isLoadingReengagement}
              className="gap-2 h-auto py-4 flex-col"
            >
              {isLoadingReengagement ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-primary" />
              )}
              <span className="text-sm font-medium">Enviar todos</span>
              <span className="text-xs text-muted-foreground">Todos los tipos a la vez</span>
            </Button>
          </div>

          {lastResults?.results && (
            <div className="flex flex-wrap gap-2 pt-2">
              {lastResults.results.map((r: any, i: number) => (
                <Badge key={i} variant={r.errors > 0 ? 'destructive' : 'secondary'}>
                  {r.type}: {r.sent} enviados{r.errors > 0 ? `, ${r.errors} errores` : ''}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Enviar Newsletter
          </CardTitle>
          <CardDescription>
            Envía un email personalizado a todos los suscriptores activos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Asunto</label>
            <Input
              placeholder="Ej: 🧠 Novedades de Neurodivergente.me"
              value={newsletterSubject}
              onChange={(e) => setNewsletterSubject(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Contenido (HTML)</label>
            <Textarea
              placeholder={'<h2 style="color: #6d28d9;">¡Hola! 👋</h2>\n<p>Tenemos novedades que compartir contigo...</p>'}
              value={newsletterContent}
              onChange={(e) => setNewsletterContent(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => sendNewsletter(true)}
              disabled={isLoadingNewsletter}
              className="gap-2"
            >
              {isLoadingNewsletter ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
              Enviar prueba
            </Button>
            <Button
              onClick={() => sendNewsletter(false)}
              disabled={isLoadingNewsletter}
              className="gap-2"
            >
              {isLoadingNewsletter ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar a todos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
