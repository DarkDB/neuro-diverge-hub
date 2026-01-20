import { Download, FileText, Image, Music, Video, File } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadableResourceCardProps {
  title: string;
  description?: string;
  fileType: string;
  fileUrl: string;
  downloadCount?: number;
  category: string;
}

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf') || type.includes('doc') || type.includes('txt')) {
    return <FileText className="w-6 h-6" />;
  }
  if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg') || type.includes('webp')) {
    return <Image className="w-6 h-6" />;
  }
  if (type.includes('audio') || type.includes('mp3') || type.includes('wav')) {
    return <Music className="w-6 h-6" />;
  }
  if (type.includes('video') || type.includes('mp4') || type.includes('webm')) {
    return <Video className="w-6 h-6" />;
  }
  return <File className="w-6 h-6" />;
};

const getFileTypeColor = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return 'bg-red-500/10 text-red-600 dark:text-red-400';
  if (type.includes('doc')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
  if (type.includes('image') || type.includes('png') || type.includes('jpg')) return 'bg-green-500/10 text-green-600 dark:text-green-400';
  if (type.includes('audio') || type.includes('mp3')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
  if (type.includes('video')) return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
  return 'bg-muted text-muted-foreground';
};

const formatFileType = (fileType: string) => {
  return fileType.toUpperCase().replace('APPLICATION/', '').replace('IMAGE/', '').replace('AUDIO/', '').replace('VIDEO/', '');
};

export function DownloadableResourceCard({
  title,
  description,
  fileType,
  fileUrl,
  downloadCount,
  category,
}: DownloadableResourceCardProps) {
  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${getFileTypeColor(fileType)} flex items-center justify-center shrink-0`}>
          {getFileIcon(fileType)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {formatFileType(fileType)}
            </span>
            <span className="text-xs text-muted-foreground">{category}</span>
          </div>
          <h4 className="font-medium text-foreground truncate">{title}</h4>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          )}
          {typeof downloadCount === 'number' && (
            <p className="text-xs text-muted-foreground mt-2">
              {downloadCount} {downloadCount === 1 ? 'descarga' : 'descargas'}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDownload}
          className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
          aria-label={`Descargar ${title}`}
        >
          <Download className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
