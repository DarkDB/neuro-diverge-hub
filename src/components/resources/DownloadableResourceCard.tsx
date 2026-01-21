import { useState } from 'react';
import { Download, FileText, Image, Music, Video, File, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadableResourceCardProps {
  title: string;
  description?: string;
  fileType: string;
  fileUrl: string;
  downloadCount?: number;
  category: string;
}

const isImageType = (fileType: string) => {
  const type = fileType.toLowerCase();
  return type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg') || type.includes('webp') || type.includes('gif');
};

const isAudioType = (fileType: string) => {
  const type = fileType.toLowerCase();
  return type.includes('audio') || type.includes('mp3') || type.includes('wav') || type.includes('ogg') || type.includes('m4a');
};

const getFileIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  if (type.includes('pdf') || type.includes('doc') || type.includes('txt')) {
    return <FileText className="w-6 h-6" />;
  }
  if (isImageType(type)) {
    return <Image className="w-6 h-6" />;
  }
  if (isAudioType(type)) {
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
  if (isImageType(type)) return 'bg-green-500/10 text-green-600 dark:text-green-400';
  if (isAudioType(type)) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [imageError, setImageError] = useState(false);

  const handleDownload = () => {
    window.open(fileUrl, '_blank');
  };

  const toggleAudio = () => {
    if (!audioRef) return;
    
    if (isPlaying) {
      audioRef.pause();
    } else {
      audioRef.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const showImagePreview = isImageType(fileType) && !imageError;
  const showAudioPlayer = isAudioType(fileType);

  return (
    <div className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all">
      {/* Image Preview */}
      {showImagePreview && (
        <div className="mb-4 rounded-lg overflow-hidden bg-muted aspect-video relative">
          <img
            src={fileUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

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

          {/* Audio Player */}
          {showAudioPlayer && (
            <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <audio
                ref={setAudioRef}
                src={fileUrl}
                onEnded={handleAudioEnded}
                preload="metadata"
              />
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full shrink-0"
                onClick={toggleAudio}
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </Button>
              <div className="flex-1 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {isPlaying ? 'Reproduciendo...' : 'Haz clic para escuchar'}
                </span>
              </div>
            </div>
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