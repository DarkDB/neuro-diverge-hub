import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { ArticlesTab } from '@/components/admin/ArticlesTab';
import { ResourcesTab } from '@/components/admin/ResourcesTab';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  
  const currentTab = searchParams.get('tab') || 'articles';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/admin');
      return;
    }
    
    if (!adminLoading && user && !isAdmin) {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/');
      return;
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
          
          <h1 className="text-3xl font-heading font-bold">Panel de Administración</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona el contenido de tu sitio web
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="articles" className="gap-2">
              <FileText className="w-4 h-4" />
              Artículos
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <Download className="w-4 h-4" />
              Recursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles">
            <ArticlesTab />
          </TabsContent>

          <TabsContent value="resources">
            <ResourcesTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
