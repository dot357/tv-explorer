const SPECIALS: Record<string, string> = {
  'Science-Fiction': 'science-fiction'
};

export function genreColorClass(genre?: string) {
  if (!genre) return 'text-muted';
  const key = SPECIALS[genre] ?? genre.toLowerCase();
  return `text-genre-${key}`;
}
export function genreBgClass(genre?: string, alpha = 10) {
  const key = SPECIALS[genre ?? ''] ?? (genre ?? '').toLowerCase();
  return key ? `bg-genre-${key}/${alpha}` : 'bg-muted/10';
}

