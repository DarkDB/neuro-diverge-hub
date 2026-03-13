import { useQuery } from '@tanstack/react-query';
import { Download, FolderOpen } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
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
  is_paid: boolean;
  price_cents: number | null;
}

export function DownloadableResourcesSection() {
  const [searchParams] = useSearchParams();
  const purchaseSuccess = searchParams.get('purchase_success') === 'true';
  const purchasedResourceId = searchParams.get('resource_id');
  const purchaseSessionId = searchParams.get('session_id');

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

  // Group resources by category, then by neurodivergence type within each category
  const groupedResources = resources.reduce((acc, resource) => {
    const category = resource.category || 'general';
    if (!acc[category]) {
      acc[category] = {};
    }
    const ndType = resource.neurodivergence_type || 'none';
    if (!acc[category][ndType]) {
      acc[category][ndType] = [];
    }
    acc[category][ndType].push(resource);
    return acc;
  }, {} as Record<string, Record<string, DownloadableResource[]>>);

  const categoryLabels: Record<string, string> = {
    general: 'General',
    guias: 'Guías',
    plantillas: 'Plantillas',
    infografias: 'Infografías',
    audios: 'Audios',
    videos: 'Videos',
  };

  const ndLabels: Record<string, string> = {
    none: 'General',
    tdah: 'TDAH',
    tea: 'TEA',
    aacc: 'Altas Capacidades',
    dislexia: 'Dislexia',
    discalculia: 'Discalculia',
    dispraxia: 'Dispraxia',
  };

  // Order for neurodivergence types
  const ndOrder = ['tdah', 'tea', 'aacc', 'dislexia', 'discalculia', 'dispraxia', 'none'];

  const sortNdTypes = (types: string[]) =>
    types.sort((a, b) => {
      const ia = ndOrder.indexOf(a);
      const ib = ndOrder.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  return (
    <section className="mb-16">
      <SectionTitle as="h2" subtitle="Guías, plantillas y materiales para descargar">
        <div className="flex items-center gap-2">
          <Download className="w-6 h-6" />
          Materiales Descargables
        </div>
      </SectionTitle>

      {Object.entries(groupedResources).map(([category, ndGroups]) => (
        <div key={category} className="mb-10 last:mb-0">
          <h3 className="font-heading font-semibold text-xl text-foreground mb-5 pb-2 border-b border-border">
            {categoryLabels[category] || category}
          </h3>
          {sortNdTypes(Object.keys(ndGroups)).map((ndType) => (
            <div key={ndType} className="mb-6 last:mb-0">
              {Object.keys(ndGroups).length > 1 && (
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 ml-1">
                  {ndLabels[ndType] || ndType}
                </h4>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ndGroups[ndType].map((resource) => (
                  <DownloadableResourceCard
                    key={resource.id}
                    id={resource.id}
                    title={resource.title}
                    description={resource.description || undefined}
                    fileType={resource.file_type}
                    fileUrl={resource.file_url}
                    downloadCount={resource.download_count || undefined}
                    category={categoryLabels[resource.category] || resource.category}
                    neurodivergenceType={resource.neurodivergence_type}
                    isPaid={resource.is_paid}
                    priceCents={resource.price_cents || undefined}
                    purchasedSessionId={
                      purchaseSuccess && purchasedResourceId === resource.id
                        ? purchaseSessionId
                        : null
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
