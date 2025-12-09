import { Link } from 'react-router-dom';
import { PenLine, Calendar, ArrowRight, Tag } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SectionTitle } from '@/components/ui/SectionTitle';

const posts = [
  {
    id: 1,
    slug: 'descubriendo-mi-tdah-a-los-35',
    title: 'Descubriendo mi TDAH a los 35',
    excerpt: 'Un viaje personal de autodescubrimiento que cambió mi forma de entenderme. Cómo reconocer las señales que siempre estuvieron ahí.',
    date: '2024-01-15',
    category: 'TDAH',
    readTime: '8 min',
  },
  {
    id: 2,
    slug: 'el-agotamiento-del-masking',
    title: 'El agotamiento del masking: cuando fingir tiene un precio',
    excerpt: 'Reflexiones sobre el coste emocional de camuflar nuestra neurodivergencia para encajar en un mundo neurotípico.',
    date: '2024-01-08',
    category: 'Autismo',
    readTime: '6 min',
  },
  {
    id: 3,
    slug: 'hiperfoco-superpoder-o-maldicion',
    title: 'Hiperfoco: ¿Superpoder o maldición?',
    excerpt: 'Explorando la dualidad del hiperfoco en el TDAH. Cuando la concentración intensa es una espada de doble filo.',
    date: '2024-01-01',
    category: 'TDAH',
    readTime: '5 min',
  },
  {
    id: 4,
    slug: 'sensibilidad-sensorial-vida-diaria',
    title: 'Navegando la sensibilidad sensorial en la vida diaria',
    excerpt: 'Estrategias prácticas para manejar la sobrecarga sensorial en entornos cotidianos como el trabajo y los espacios públicos.',
    date: '2023-12-20',
    category: 'Sensorialidad',
    readTime: '7 min',
  },
  {
    id: 5,
    slug: 'disfuncion-ejecutiva-no-es-pereza',
    title: 'Disfunción ejecutiva: no es pereza, es neurología',
    excerpt: 'Entendiendo por qué a veces no podemos hacer cosas que queremos hacer, y cómo dejar de culparnos por ello.',
    date: '2023-12-15',
    category: 'General',
    readTime: '6 min',
  },
];

const categories = ['Todos', 'TDAH', 'Autismo', 'Sensorialidad', 'General'];

export default function Diario() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="space-y-6">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </span>
                    <span>·</span>
                    <span>{post.readTime} de lectura</span>
                  </div>
                  
                  <Link 
                    to={`/diario/${post.slug}`}
                    className="focus-ring rounded-lg"
                  >
                    <h2 className="font-heading font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-muted-foreground mb-4">
                    {post.excerpt}
                  </p>
                  
                  <Link
                    to={`/diario/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all focus-ring rounded"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
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
                      className="px-3 py-1.5 rounded-full text-sm bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors focus-ring"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <h3 className="font-heading font-semibold mb-2">Mantente Informado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recibe nuevas publicaciones directamente en tu correo.
                </p>
                <p className="text-xs text-muted-foreground">
                  (Newsletter próximamente)
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Layout>
  );
}
