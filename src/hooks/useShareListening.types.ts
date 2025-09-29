export interface ShareListeningInput {
  trackName: string;
  artistName: string;
  spotifyId: string;
  genre?: string;
  energy?: number;
  latitude?: number;
  longitude?: number;
  startedAt: string;
  endedAt: string;  
  clientAt?: string;
}