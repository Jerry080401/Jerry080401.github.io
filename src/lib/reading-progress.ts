interface ReadingProgressMetrics {
  scrollY: number;
  contentTop: number;
  contentHeight: number;
  viewportHeight: number;
}

export function calculateReadingProgress({
  scrollY,
  contentTop,
  contentHeight,
  viewportHeight,
}: ReadingProgressMetrics): number | null {
  const scrollableDistance = contentHeight - viewportHeight;
  if (scrollableDistance <= 0) return null;

  return Math.min(1, Math.max(0, (scrollY - contentTop) / scrollableDistance));
}
