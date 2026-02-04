import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string[];
  tags: string[] | null;
  featured_image_url: string | null;
  read_time: string;
  published_at: string | null;
  created_at: string;
  author_id: string;
}

export default function ArticleView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  async function fetchArticle() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setError('Artículo no encontrado');
        } else {
          throw error;
        }
        return;
      }

      setArticle(data);
    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Error al cargar el artículo');
    } finally {
      setIsLoading(false);
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Render HTML content from rich text editor
  const renderContent = (content: string) => {
    return (
      <div 
        className="prose prose-lg max-w-none
          prose-headings:font-heading prose-headings:text-foreground
          prose-h1:text-3xl prose-h1:font-bold prose-h1:mt-10 prose-h1:mb-6
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-4
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:italic
          prose-a:text-primary prose-a:underline hover:prose-a:no-underline
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
          prose-ul:list-disc prose-ul:ml-6
          prose-ol:list-decimal prose-ol:ml-6
          prose-li:text-foreground
          prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
          prose-hr:my-8 prose-hr:border-border
          prose-img:rounded-lg prose-img:max-w-full"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div className="container mx-auto py-20">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">{error || 'Artículo no encontrado'}</h1>
            <p className="text-muted-foreground mb-8">
              El artículo que buscas no existe o no está disponible.
            </p>
            <Button asChild>
              <Link to="/diario">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al diario
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero with featured image */}
      {article.featured_image_url && (
        <div className="w-full h-64 md:h-96 relative overflow-hidden">
          <img 
            src={article.featured_image_url} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <article className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-8"
            onClick={() => navigate('/diario')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al diario
          </Button>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <div className="flex flex-wrap gap-2">
                {article.category.map((cat) => (
                  <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
                    <Tag className="w-3.5 h-3.5" />
                    {cat}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at || article.created_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.read_time} de lectura
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight mb-6">
              {article.title}
            </h1>

          </header>

          {/* Article content */}
          <div className="prose-custom">
            {renderContent(article.content)}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground mr-2">Etiquetas:</span>
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </footer>
          )}

          {/* Back to blog */}
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link to="/diario">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Ver más artículos
              </Link>
            </Button>
          </div>
        </div>
      </article>
    </Layout>
  );
}
