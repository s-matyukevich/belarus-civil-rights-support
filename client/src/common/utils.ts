export function getYoutubeVideoId(videoUrl?: string): string | null {
  if (!videoUrl) {
    return null;
  }

  const url = new URL(videoUrl);
  return url.searchParams.get('v');
}
