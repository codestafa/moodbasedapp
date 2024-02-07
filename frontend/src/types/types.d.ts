import { Playlist } from "spotify-types";

// Spotify types

export type GetPlaylistsResponse = {
  items: Playlist[];
};

// Fetch functions types
export interface FetchSpotifyOptions {
  url: string;
  init: RequestInit;
}

export interface PassportResponse {
  accessToken: string;
}

export interface TokenInfo extends PassportResponse {
  date: number;
}
