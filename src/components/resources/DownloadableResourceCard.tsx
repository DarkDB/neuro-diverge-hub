import { useState, useEffect } from 'react';
import { Download, FileText, Image, Music, Video, File, Play, Pause, Volume2, ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DownloadableResourceCardProps {
  id: string;
  title: string;
  description?: string;
  fileType: string;
  fileUrl: string;
  downloadCount?: number;
  category: string;
  isPaid?: boolean;
  priceCents?: number;
  purchasedSessionId?: string | null;
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
  id,
  title,
  description,
  fileType,
  fileUrl,
  downloadCount,
  category,
  isPaid = false,
  priceCents,
  purchasedSessionId,
}: DownloadableResourceCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // If a purchasedSessionId is provided, verify and unlock the download
  useEffect(() => {
    if (purchasedSessionId && isPaid) {
      verifyPurchase(purchasedSessionId);
    }
  }, [purchasedSessionId, isPaid]);

  const verifyPurchase = async (sessionId: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('verify-resource-purchase', {
        body: { session_id: sessionId, resource_id: id },
      });

      if (error) throw error;
      if (data?.verified) {
        setIsPurchased(true);
        setDownloadUrl(data.file_url);
        toast.success('¡Compra verificada! Ya puedes descargar tu recurso.');
      }
    } catch (error) {
      console.error('Error verifying purchase:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async (url?: string) => {
    const downloadFrom = url || fileUrl;
    try {
      // Increment download counter
      supabase.rpc('increment_download_count', { resource_id: id }).then(() => {});

      const response = await fetch(downloadFrom);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const urlParts = downloadFrom.split('/');
      const originalFilename = urlParts[urlParts.length - 1];
      const extension = originalFilename.split('.').pop() || '';
      link.download = `${title}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(downloadFrom, '_blank');
    }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-resource-payment', {
        body: {
          resource_id: id,
          resource_title: title,
          price_cents: priceCents,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Error al procesar el pago. Inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
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
  const priceFormatted = priceCents ? (priceCents / 100).toFixed(2) : '0.00';

  return (
    <div className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all">
      {/* Price Badge for paid resources */}
      {isPaid && (
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-semibold">
            {priceFormatted}€
          </span>
          {isPurchased && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
              <Check className="w-3 h-3" />
              Comprado
            </span>
          )}
        </div>
      )}

      {/* Image Preview */}
      {showImagePreview && !isPaid && (
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

          {/* Audio Player (only for free or purchased) */}
          {showAudioPlayer && (!isPaid || isPurchased) && (
            <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <audio
                ref={setAudioRef}
                src={isPurchased ? downloadUrl || fileUrl : fileUrl}
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

        {/* Action button */}
        {isPaid && !isPurchased ? (
          <Button
            variant="default"
            size="sm"
            onClick={handlePurchase}
            disabled={isProcessing}
            className="shrink-0 gap-1.5"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            {isProcessing ? 'Procesando...' : `${priceFormatted}€`}
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDownload(isPurchased && downloadUrl ? downloadUrl : undefined)}
            disabled={isProcessing}
            className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
            aria-label={`Descargar ${title}`}
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
