import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Download,
  Upload,
  FolderOpen,
  Search,
  FileText,
  Image,
  Music,
  Video,
  File,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DownloadableResource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_type: string;
  file_url: string;
  file_size_bytes: number | null;
  download_count: number | null;
  is_active: boolean;
  neurodivergence_type: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'guias', label: 'Guías' },
  { value: 'plantillas', label: 'Plantillas' },
  { value: 'infografias', label: 'Infografías' },
  { value: 'audios', label: 'Audios' },
  { value: 'videos', label: 'Videos' },
];

const NEURODIVERGENCE_TYPES = [
  { value: '', label: 'Ninguno (General)' },
  { value: 'TDAH', label: 'TDAH' },
  { value: 'TEA', label: 'TEA' },
  { value: 'AACC', label: 'AACC' },
  { value: 'Dislexia', label: 'Dislexia' },
  { value: 'Discalculia', label: 'Discalculia' },
  { value: 'Dispraxia', label: 'Dispraxia' },
];

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf') || type.includes('doc') || type.includes('txt')) {
    return <FileText className="w-4 h-4" />;
  }
  if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg') || type.includes('webp')) {
    return <Image className="w-4 h-4" />;
  }
  if (type.includes('audio') || type.includes('mp3') || type.includes('wav')) {
    return <Music className="w-4 h-4" />;
  }
  if (type.includes('video') || type.includes('mp4') || type.includes('webm')) {
    return <Video className="w-4 h-4" />;
  }
  return <File className="w-4 h-4" />;
};

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ResourcesTab() {
  const [resources, setResources] = useState<DownloadableResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'general',
    neurodivergence_type: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('downloadable_resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Error al cargar los recursos');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    
    if (!form.title || !form.file) {
      toast.error('Por favor completa el título y selecciona un archivo');
      return;
    }

    setIsUploading(true);
    try {
      // Generate unique file name
      const fileExt = form.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${form.category}/${fileName}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('recursos')
        .upload(filePath, form.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('recursos')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('downloadable_resources')
        .insert({
          title: form.title,
          description: form.description || null,
          category: form.category,
          file_type: form.file.type || fileExt,
          file_url: urlData.publicUrl,
          file_size_bytes: form.file.size,
          neurodivergence_type: form.neurodivergence_type || null,
          is_active: true,
        });

      if (dbError) throw dbError;

      toast.success('Recurso subido correctamente');
      setIsDialogOpen(false);
      setForm({
        title: '',
        description: '',
        category: 'general',
        neurodivergence_type: '',
        file: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchResources();
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast.error('Error al subir el recurso');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDelete(resource: DownloadableResource) {
    try {
      // Extract file path from URL
      const url = new URL(resource.file_url);
      const pathParts = url.pathname.split('/recursos/');
      const filePath = pathParts[pathParts.length - 1];

      // Delete from storage
      if (filePath) {
        await supabase.storage
          .from('recursos')
          .remove([decodeURIComponent(filePath)]);
      }

      // Delete from database
      const { error } = await supabase
        .from('downloadable_resources')
        .delete()
        .eq('id', resource.id);

      if (error) throw error;
      
      toast.success('Recurso eliminado correctamente');
      setResources(resources.filter(r => r.id !== resource.id));
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Error al eliminar el recurso');
    }
  }

  async function toggleActive(resource: DownloadableResource) {
    try {
      const { error } = await supabase
        .from('downloadable_resources')
        .update({ is_active: !resource.is_active })
        .eq('id', resource.id);

      if (error) throw error;
      
      setResources(resources.map(r => 
        r.id === resource.id ? { ...r, is_active: !r.is_active } : r
      ));
      toast.success(resource.is_active ? 'Recurso desactivado' : 'Recurso activado');
    } catch (error) {
      console.error('Error toggling resource:', error);
      toast.error('Error al actualizar el recurso');
    }
  }

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Materiales Descargables</h2>
          <p className="text-sm text-muted-foreground">
            {resources.length} recurso{resources.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Subir Recurso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Subir Nuevo Recurso</DialogTitle>
              <DialogDescription>
                Sube un archivo para que los usuarios puedan descargarlo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nombre del recurso"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Breve descripción del recurso"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Neurodivergencia</Label>
                  <Select
                    value={form.neurodivergence_type}
                    onValueChange={(value) => setForm(prev => ({ ...prev, neurodivergence_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Opcional" />
                    </SelectTrigger>
                    <SelectContent>
                      {NEURODIVERGENCE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Archivo *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="file"
                    ref={fileInputRef}
                    type="file"
                    onChange={(e) => setForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="flex-1"
                    required
                  />
                  {form.file && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setForm(prev => ({ ...prev, file: null }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {form.file && (
                  <p className="text-xs text-muted-foreground">
                    {form.file.name} ({formatFileSize(form.file.size)})
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isUploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Subiendo...' : 'Subir'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar recursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Resources Table */}
      <div className="rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">No hay recursos</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No se encontraron recursos con ese criterio' : 'Comienza subiendo tu primer recurso'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Subir Recurso
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recurso</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Descargas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        {getFileIcon(resource.file_type)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[200px]">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(resource.created_at)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {CATEGORIES.find(c => c.value === resource.category)?.label || resource.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatFileSize(resource.file_size_bytes)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {resource.download_count || 0}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={resource.is_active 
                        ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30 cursor-pointer' 
                        : 'bg-muted text-muted-foreground cursor-pointer'
                      }
                      onClick={() => toggleActive(resource)}
                    >
                      {resource.is_active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(resource.file_url, '_blank')}
                        title="Descargar"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar recurso?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. El archivo será eliminado permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(resource)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
