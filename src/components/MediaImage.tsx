import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { siraApi } from '@/api/sira-api';
import { cn } from '@/lib/utils';

interface MediaImageProps {
  readonly mediaPath: string | null | undefined;
  readonly alt: string;
  readonly className?: string;
  readonly fallbackClassName?: string;
}

function resolveMediaApiPath(mediaPath: string): string {
  if (mediaPath.startsWith('/api/')) {
    return mediaPath.slice(4);
  }

  return mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
}

export function MediaImage({
  mediaPath,
  alt,
  className,
  fallbackClassName,
}: MediaImageProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!mediaPath) {
      setObjectUrl(null);
      setHasError(false);
      setIsLoading(false);
      return;
    }

    const resolvedMediaPath = mediaPath;
    let isCancelled = false;
    let createdObjectUrl: string | null = null;

    async function loadMedia() {
      setIsLoading(true);
      setHasError(false);

      const apiPath = resolveMediaApiPath(resolvedMediaPath);

      try {
        const response = await siraApi.get<ArrayBuffer>(apiPath, {
          responseType: 'arraybuffer',
        });

        if (isCancelled) {
          return;
        }

        const contentType = response.headers['content-type'];
        const mimeType =
          typeof contentType === 'string' ? contentType : 'image/jpeg';
        const blob = new Blob([response.data], { type: mimeType });
        createdObjectUrl = URL.createObjectURL(blob);
        setObjectUrl(createdObjectUrl);
      } catch {
        if (!isCancelled) {
          setHasError(true);
          setObjectUrl(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadMedia();

    return () => {
      isCancelled = true;
      if (createdObjectUrl) {
        URL.revokeObjectURL(createdObjectUrl);
      }
    };
  }, [mediaPath]);

  if (!mediaPath) {
    return null;
  }

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-slate-100 text-slate-500',
          fallbackClassName ?? className,
        )}
      >
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  if (hasError || !objectUrl) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-slate-100 px-4 text-center text-sm text-slate-500',
          fallbackClassName ?? className,
        )}
      >
        No se pudo cargar la imagen
      </div>
    );
  }

  return <img src={objectUrl} alt={alt} className={className} />;
}
