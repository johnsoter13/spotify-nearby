export type OverlapSession = {
  id: string;
  userId: string;
  trackName: string;
  artistName: string;
  spotifyId: string;
  genre?: string | null;
  energy?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  startedAt: string; // JSON from server
  endedAt: string;
  user?: { id: string; displayName?: string | null; avatarUrl?: string | null };
};