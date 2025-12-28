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
  category: string;
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

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let codeLanguage = '';

    lines.forEach((line, index) => {
      // Code block handling
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
              <code className="text-sm">{codeContent.join('\n')}</code>
            </pre>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-heading font-semibold mt-8 mb-4">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-heading font-bold mt-10 mb-4">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-heading font-bold mt-10 mb-6">
            {line.slice(2)}
          </h1>
        );
      }
      // Blockquote
      else if (line.startsWith('> ')) {
        elements.push(
          <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground">
            {line.slice(2)}
          </blockquote>
        );
      }
      // Unordered list
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={index} className="ml-6 list-disc">
            {renderInlineFormatting(line.slice(2))}
          </li>
        );
      }
      // Ordered list
      else if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        elements.push(
          <li key={index} className="ml-6 list-decimal">
            {renderInlineFormatting(content)}
          </li>
        );
      }
      // Horizontal rule
      else if (line === '---' || line === '***') {
        elements.push(<hr key={index} className="my-8 border-border" />);
      }
      // Empty line
      else if (line.trim() === '') {
        elements.push(<div key={index} className="h-4" />);
      }
      // Regular paragraph
      else {
        elements.push(
          <p key={index} className="text-foreground leading-relaxed mb-4">
            {renderInlineFormatting(line)}
          </p>
        );
      }
    });

    return elements;
  };

  const renderInlineFormatting = (text: string) => {
    // Bold
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code
    text = text.replace(/`(.+?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>');
    // Links
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary">
                <Tag className="w-3.5 h-3.5" />
                {article.category}
              </span>
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

            <p className="text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
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
