import { useState, useEffect } from 'react';
import { Users, Search, Mail, Calendar, Brain, ClipboardCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

interface ScreeningSession {
  id: string;
  user_id: string;
  status: string;
  destinatario: string;
  edad: string;
  genero: string;
  paid: boolean;
  created_at: string;
  completed_at: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  fase1: { label: 'Fase 1', color: 'bg-blue-500/20 text-blue-600' },
  teaser: { label: 'Teaser', color: 'bg-yellow-500/20 text-yellow-600' },
  fase2: { label: 'Fase 2', color: 'bg-orange-500/20 text-orange-600' },
  fase3: { label: 'Fase 3', color: 'bg-purple-500/20 text-purple-600' },
  completed: { label: 'Completado', color: 'bg-green-500/20 text-green-600' },
};

export function UsersTab() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [sessions, setSessions] = useState<ScreeningSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [profilesRes, sessionsRes] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('screening_sessions')
          .select('id, user_id, status, destinatario, edad, genero, paid, created_at, completed_at')
          .order('created_at', { ascending: false }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (sessionsRes.error) throw sessionsRes.error;

      setUsers(profilesRes.data || []);
      setSessions(sessionsRes.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.display_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserSessions = (userId: string) =>
    sessions.filter(s => s.user_id === userId);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Usuarios Registrados
          </h2>
          <p className="text-sm text-muted-foreground">
            {users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por email o nombre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users list */}
      <div className="rounded-xl border border-border bg-card">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">
              {searchQuery ? 'Sin resultados' : 'No hay usuarios'}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'No se encontraron usuarios con ese criterio' : 'Aún no se han registrado usuarios'}
            </p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredUsers.map((user) => {
              const userSessions = getUserSessions(user.id);
              return (
                <AccordionItem key={user.id} value={user.id} className="border-b border-border last:border-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                    <div className="flex items-center gap-4 flex-1 text-left">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {(user.display_name || user.email)[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.display_name || '—'}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground mr-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(user.created_at)}
                        </div>
                        {userSessions.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            <Brain className="w-3 h-3 mr-1" />
                            {userSessions.length} sesión{userSessions.length !== 1 ? 'es' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="ml-14 space-y-4">
                      {/* User info */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Nombre</p>
                          <p className="font-medium">{user.display_name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Registro</p>
                          <p className="font-medium">{formatDateTime(user.created_at)}</p>
                        </div>
                      </div>

                      {/* Screening sessions */}
                      {userSessions.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <ClipboardCheck className="w-4 h-4 text-primary" />
                            Sesiones de Autodescubrimiento
                          </h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Estado</TableHead>
                                <TableHead>Para</TableHead>
                                <TableHead>Edad</TableHead>
                                <TableHead>Género</TableHead>
                                <TableHead>Pagado</TableHead>
                                <TableHead>Fecha</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userSessions.map((session) => {
                                const statusInfo = STATUS_LABELS[session.status] || { label: session.status, color: 'bg-muted text-muted-foreground' };
                                return (
                                  <TableRow key={session.id}>
                                    <TableCell>
                                      <Badge className={statusInfo.color}>
                                        {statusInfo.label}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize">{session.destinatario}</TableCell>
                                    <TableCell>{session.edad}</TableCell>
                                    <TableCell className="capitalize">{session.genero}</TableCell>
                                    <TableCell>
                                      <Badge variant={session.paid ? 'default' : 'secondary'}>
                                        {session.paid ? 'Sí' : 'No'}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                      {formatDateTime(session.created_at)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          Este usuario no ha iniciado ningún cuestionario de autodescubrimiento.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
}
