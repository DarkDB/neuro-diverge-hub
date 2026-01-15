import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Calendar, Clock } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const CATEGORIES = ['TDAH', 'Autismo', 'Sensorialidad', 'General', 'Altas Capacidades', 'Dislexia'];

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  featured_image_url: string;
  read_time: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduled_at: string;
}

const initialForm: ArticleForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'General',
  tags: '',
  featured_image_url: '',
  read_time: '5 min',
  status: 'draft',
  scheduled_at: '',
};

export default function ArticleEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const [form, setForm] = useState<ArticleForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth?redirect=/admin/articles');
      return;
    }
    
    if (!adminLoading && user && !isAdmin) {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/');
      return;
    }

    if (isEditing && isAdmin) {
      fetchArticle();
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate, id]);

  async function fetchArticle() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      setForm({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: (data.tags || []).join(', '),
        featured_image_url: data.featured_image_url || '',
        read_time: data.read_time,
        status: data.status as 'draft' | 'published' | 'scheduled',
        scheduled_at: data.scheduled_at 
          ? new Date(data.scheduled_at).toISOString().slice(0, 16) 
          : '',
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Error al cargar el artículo');
      navigate('/admin/articles');
    } finally {
      setIsLoading(false);
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  function handleTitleChange(title: string) {
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!form.title || !form.excerpt || !form.content) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (form.status === 'scheduled' && !form.scheduled_at) {
      toast.error('Selecciona una fecha de publicación para programar el artículo');
      return;
    }

    setIsSaving(true);
    try {
      const articleData = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        featured_image_url: form.featured_image_url || null,
        read_time: form.read_time,
        status: form.status,
        scheduled_at: form.status === 'scheduled' ? form.scheduled_at : null,
        published_at: form.status === 'published' ? new Date().toISOString() : null,
        author_id: user?.id,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Artículo actualizado correctamente');
      } else {
        const { error } = await supabase
          .from('articles')
          .insert(articleData);

        if (error) throw error;
        toast.success('Artículo creado correctamente');
      }

      navigate('/admin/articles');
    } catch (error: any) {
      console.error('Error saving article:', error);
      if (error.code === '23505') {
        toast.error('Ya existe un artículo con ese slug');
      } else {
        toast.error('Error al guardar el artículo');
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (authLoading || adminLoading || isLoading) {
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
      <div className="container mx-auto py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/admin/articles" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a artículos
          </Link>
          
          <h1 className="text-3xl font-heading font-bold">
            {isEditing ? 'Editar Artículo' : 'Nuevo Artículo'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="El título del artículo"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="el-titulo-del-articulo"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Extracto *</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Un breve resumen del artículo (aparece en las tarjetas)"
              rows={2}
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Contenido *</Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="El contenido completo del artículo (soporta Markdown)"
              rows={15}
              className="font-mono text-sm"
              required
            />
          </div>

          {/* Category, Read Time, Tags */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="read_time">Tiempo de lectura</Label>
              <Input
                id="read_time"
                value={form.read_time}
                onChange={(e) => setForm(prev => ({ ...prev, read_time: e.target.value }))}
                placeholder="5 min"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separados por coma)</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="neurodivergencia, TDAH, adultos"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label htmlFor="featured_image_url">URL de imagen destacada</Label>
            <Input
              id="featured_image_url"
              type="url"
              value={form.featured_image_url}
              onChange={(e) => setForm(prev => ({ ...prev, featured_image_url: e.target.value }))}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {/* Status & Scheduling */}
          <div className="p-6 rounded-xl bg-muted/50 border border-border space-y-4">
            <h3 className="font-semibold">Publicación</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={form.status}
                  onValueChange={(value: 'draft' | 'published' | 'scheduled') => 
                    setForm(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Borrador
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Publicado
                      </div>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Programado
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.status === 'scheduled' && (
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Fecha de publicación</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    value={form.scheduled_at}
                    onChange={(e) => setForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Artículo'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/articles')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
