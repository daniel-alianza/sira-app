const API_BASE_URL = import.meta.env.VITE_SIR_API_URL as string;

export function buildMediaResourceUrl(mediaPath: string | null | undefined): string | null {
  if (!mediaPath) {
    return null;
  }

  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }

  const normalizedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  const apiPrefix = normalizedPath.startsWith('/api/') ? '' : '/api';

  return `${API_BASE_URL}${apiPrefix}${normalizedPath}`;
}
