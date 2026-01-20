import { useQuery } from '@tanstack/react-query';
import { Download, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { DownloadableResourceCard } from './DownloadableResourceCard';
import { Skeleton } from '@/components/ui/skeleton';

interface DownloadableResource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_type: string;
  file_url: string;
  download_count: number | null;
  neurodivergence_type: string | null;
}

export function DownloadableResourcesSection() {
  const { data: resources, isLoading } = useQuery({
    queryKey: ['downloadable-resources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('downloadable_resources')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DownloadableResource[];
    },
  });

  if (isLoading) {
    return (
      <section className="mb-16">
        <SectionTitle as="h2" subtitle="Guías, plantillas y materiales para descargar">
          <div className="flex items-center gap-2">
            <Download className="w-6 h-6" />
            Materiales Descargables
          </div>
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <section className="mb-16">
        <SectionTitle as="h2" subtitle="Guías, plantillas y materiales para descargar">
          <div className="flex items-center gap-2">
            <Download className="w-6 h-6" />
            Materiales Descargables
          </div>
        </SectionTitle>
        <div className="text-center py-12 px-6 rounded-xl bg-muted/30 border border-border">
          <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Próximamente añadiremos guías y plantillas descargables.
          </p>
        </div>
      </section>
    );
  }

  // Group resources by category
  const groupedResources = resources.reduce((acc, resource) => {
    const category = resource.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, DownloadableResource[]>);

  const categoryLabels: Record<string, string> = {
    general: 'General',
    guias: 'Guías',
    plantillas: 'Plantillas',
    infografias: 'Infografías',
    audios: 'Audios',
    videos: 'Videos',
  };

  return (
    <section className="mb-16">
      <SectionTitle as="h2" subtitle="Guías, plantillas y materiales para descargar">
        <div className="flex items-center gap-2">
          <Download className="w-6 h-6" />
          Materiales Descargables
        </div>
      </SectionTitle>

      {Object.entries(groupedResources).map(([category, categoryResources]) => (
        <div key={category} className="mb-8 last:mb-0">
          <h3 className="font-medium text-lg text-foreground mb-4">
            {categoryLabels[category] || category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryResources.map((resource) => (
              <DownloadableResourceCard
                key={resource.id}
                title={resource.title}
                description={resource.description || undefined}
                fileType={resource.file_type}
                fileUrl={resource.file_url}
                downloadCount={resource.download_count || undefined}
                category={categoryLabels[resource.category] || resource.category}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
