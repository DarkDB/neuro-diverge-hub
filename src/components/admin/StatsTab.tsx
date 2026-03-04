import { useState, useEffect } from 'react';
import { BarChart3, ClipboardCheck, Download, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TestStat {
  test_id: string;
  test_name: string;
  count: number;
}

interface ResourceStat {
  id: string;
  title: string;
  download_count: number;
  is_paid: boolean;
}

type Period = '7d' | '30d' | '90d' | 'all';

export function StatsTab() {
  const [testStats, setTestStats] = useState<TestStat[]>([]);
  const [resourceStats, setResourceStats] = useState<ResourceStat[]>([]);
  const [totalTests, setTotalTests] = useState(0);
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [period, setPeriod] = useState<Period>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [period]);

  const getDateFilter = () => {
    if (period === 'all') return null;
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const dateFilter = getDateFilter();

      // Fetch test completions
      let testQuery = supabase.from('test_completions').select('test_id, test_name, completed_at');
      if (dateFilter) {
        testQuery = testQuery.gte('completed_at', dateFilter);
      }
      const { data: testData } = await testQuery;

      if (testData) {
        // Group by test_id
        const grouped: Record<string, TestStat> = {};
        testData.forEach((row: any) => {
          if (!grouped[row.test_id]) {
            grouped[row.test_id] = { test_id: row.test_id, test_name: row.test_name, count: 0 };
          }
          grouped[row.test_id].count++;
        });
        const stats = Object.values(grouped).sort((a, b) => b.count - a.count);
        setTestStats(stats);
        setTotalTests(testData.length);
      }

      // Fetch resource download counts (these are cumulative, no date filter)
      const { data: resourceData } = await supabase
        .from('downloadable_resources')
        .select('id, title, download_count, is_paid')
        .order('download_count', { ascending: false });

      if (resourceData) {
        setResourceStats(resourceData as ResourceStat[]);
        setTotalDownloads(resourceData.reduce((sum: number, r: any) => sum + (r.download_count || 0), 0));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const periodLabel = {
    '7d': 'Últimos 7 días',
    '30d': 'Últimos 30 días',
    '90d': 'Últimos 90 días',
    'all': 'Todo el tiempo',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Period filter */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Estadísticas
        </h2>
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-48">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
            <SelectItem value="all">Todo el tiempo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tests completados</p>
              <p className="text-2xl font-bold">{totalTests}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{periodLabel[period]}</p>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/50 flex items-center justify-center">
              <Download className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Descargas totales</p>
              <p className="text-2xl font-bold">{totalDownloads}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Acumulado total</p>
        </div>
      </div>

      {/* Test completions table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-4 bg-muted/30 border-b border-border">
          <h3 className="font-medium flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Tests completados por tipo
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead className="text-right">Completados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  Sin datos en este período
                </TableCell>
              </TableRow>
            ) : (
              testStats.map((stat) => (
                <TableRow key={stat.test_id}>
                  <TableCell className="font-medium">{stat.test_name}</TableCell>
                  <TableCell className="text-right">{stat.count}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resource downloads table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="p-4 bg-muted/30 border-b border-border">
          <h3 className="font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Descargas por recurso
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recurso</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Descargas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resourceStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Sin recursos
                </TableCell>
              </TableRow>
            ) : (
              resourceStats.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.is_paid ? 'bg-amber-500/10 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
                      {r.is_paid ? 'De pago' : 'Gratuito'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{r.download_count || 0}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
