import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Calendar, ArrowRight, Tag, Settings } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { NewsletterSubscribe } from '@/components/NewsletterSubscribe';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  published_at: string | null;
  created_at: string;
  category: string[];
  read_time: string;
}

const categories = ['Todos', 'TDAH', 'Autismo', 'Sensorialidad', 'General', 'Altas Capacidades', 'Dislexia', 'Doble Excepcionalidad', 'Masking'];

export default function Diario() {
  const { isAdmin } = useAdmin();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, slug, title, excerpt, published_at, created_at, category, read_time')
        .eq('status', 'published')
       .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
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

  const filteredArticles = selectedCategory === 'Todos'
    ? articles
    : articles.filter(article => article.category.includes(selectedCategory));

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <PenLine className="w-4 h-4" />
              <span>Blog Personal</span>
            </div>
            <SectionTitle
              as="h1"
              align="center"
              subtitle="Reflexiones, experiencias y conocimiento sobre el camino neurodivergente."
            >
              El Diario del Autodescubrimiento
            </SectionTitle>
            
            {isAdmin && (
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to="/admin/articles">
                    <Settings className="w-4 h-4 mr-2" />
                    Gestionar Artículos
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <PenLine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No hay artículos disponibles</h3>
                <p className="text-muted-foreground">
                  {selectedCategory !== 'Todos' 
                    ? 'No hay artículos en esta categoría' 
                    : 'Pronto publicaremos nuevos contenidos'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredArticles.map((article, index) => (
                  <article
                    key={article.id}
                    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                      <span className="inline-flex items-center gap-1 flex-wrap">
                        <Tag className="w-3 h-3" />
                        {article.category.join(', ')}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.published_at || article.created_at)}
                      </span>
                      <span>·</span>
                      <span>{article.read_time} de lectura</span>
                    </div>
                    
                    <Link 
                      to={`/diario/${article.slug}`}
                      className="focus-ring rounded-lg"
                    >
                      <h2 className="font-heading font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h2>
                    </Link>
                    
                    <p className="text-muted-foreground mb-4">
                      {article.excerpt}
                    </p>
                    
                    <Link
                      to={`/diario/${article.slug}`}
                      className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all focus-ring rounded"
                    >
                      Leer más
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-heading font-semibold mb-4">Categorías</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors focus-ring ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <NewsletterSubscribe variant="card" />
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
