export interface NowPlaying {
  isPlaying: boolean;
  track?: string;
  artist?: string;
  albumArt?: string;
  progressMs?: number;
  durationMs?: number;
  spotifyId?: string;
  startedAt: string;
  endedAt: string;
}