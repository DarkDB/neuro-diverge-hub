import { useQuery } from '@tanstack/react-query';
import { Download, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { DownloadableResourceCard } from './DownloadableResourceCard';
import { Skeleton } from '@/components/ui/skeleton';

interface NeurodivergenceResourcesProps {
  neurodivergenceType: string;
  label: string;
}

export function NeurodivergenceResources({ neurodivergenceType, label }: NeurodivergenceResourcesProps) {
  const { data: resources, isLoading } = useQuery({
    queryKey: ['downloadable-resources', neurodivergenceType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('downloadable_resources')
        .select('*')
        .eq('is_active', true)
        .eq('neurodivergence_type', neurodivergenceType)
        .order('category')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section>
        <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Materiales sobre {label}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <section>
        <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Materiales sobre {label}
        </h2>
        <div className="text-center py-8 px-6 rounded-xl bg-muted/30 border border-border">
          <FolderOpen className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">
            Próximamente añadiremos materiales específicos sobre {label}.
          </p>
        </div>
      </section>
    );
  }

  const categoryLabels: Record<string, string> = {
    general: 'General',
    guias: 'Guías',
    plantillas: 'Plantillas',
    infografias: 'Infografías',
    audios: 'Audios',
    videos: 'Videos',
  };

  return (
    <section>
      <h2 className="font-heading font-semibold text-xl mb-4 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Materiales sobre {label}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource) => (
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
            purchasedSessionId={null}
          />
        ))}
      </div>
    </section>
  );
}
