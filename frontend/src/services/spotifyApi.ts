import {
  FetchSpotifyOptions,
  TokenInfo,
} from "../types/types";
import { PlaylistTrack, Paging, AudioFeatures, Track, Playlist } from "spotify-types";
import { getTokenInfo } from "../utils/authUtils";

export interface TopFiveTracks {
  tracks: Track[];
}

export async function fetchSpotify<T>({
  url,
  init,
}: FetchSpotifyOptions): Promise<T> {
  const result = await fetch(url, init);
  return result.json() as Promise<T>;
}

// Get all user playlists
export const fetchPlaylists = async (
  limit: number,
  offset: number
): Promise<Paging<Playlist> | undefined> => {
  //Make service function to do this AND fetch
  let tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return undefined;
  }
  const { accessToken } = tokenInfo;

  let url = `https://api.spotify.com/v1/me/playlists/?$offset=${offset}&limit=${limit}`;
  let allPlaylists: Playlist[] = [];


  while (url) {
    const getPlaylistsResponse = await fetchSpotify<Paging<Playlist>>({
      url,
      init: {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    });

    allPlaylists.push(...getPlaylistsResponse.items);
    if (getPlaylistsResponse.next === null) {
      return {
        items: allPlaylists,
        total: getPlaylistsResponse.total,
        href: "null",
        limit: 0,
        next: "null",
        offset: 0,
        previous: "null",
      };
    } else {
      url = getPlaylistsResponse.next;
    }
  }

  return undefined;
};

// Get a single user playlist
export const fetchPlaylistTracks = async (
  playlist_id: string
): Promise<Paging<PlaylistTrack> | undefined> => {
  let tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return undefined;
  }
  const { accessToken } = tokenInfo;

  let url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks?fields=items(added_by%2Ctrack(id))%2Cnext%2Ctotal`;
  let allTracks: PlaylistTrack[] = [];

  while (url) {
    const getPlaylistResponse = await fetchSpotify<Paging<PlaylistTrack>>({
      url,
      init: {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    });

    allTracks.push(...getPlaylistResponse.items);
    if (getPlaylistResponse.next === null) {
      return {
        items: allTracks,
        total: getPlaylistResponse.total,
        href: "null",
        limit: 0,
        next: "null",
        offset: 0,
        previous: "null",
      };
    } else {
      url = getPlaylistResponse.next;
    }
  }

  return undefined;
};

export interface AudioFeaturesResponse {
  audio_features: AudioFeatures[];
}

// Get multiple tracks (Audio Features)
export const fetchTracks = async (
  track_id: string
): Promise<AudioFeaturesResponse | undefined> => {
  let tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return undefined;
  }
  const { accessToken } = tokenInfo;

  const getTracksResponse = await fetchSpotify<AudioFeaturesResponse>({
    url: `https://api.spotify.com/v1/audio-features?ids=${track_id}`,
    init: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  });

  return getTracksResponse;
};

// Get Several tracks (metadata)

export const fetchTracksMetadata = async (
  track_id: string
): Promise<TopFiveTracks | undefined> => {
  let tokenInfo = getTokenInfo();
  if (!tokenInfo) {
    return undefined;
  }
  const { accessToken } = tokenInfo;

  const getTracksResponse = await fetchSpotify<TopFiveTracks>({
    url: `https://api.spotify.com/v1/tracks?ids=${track_id}`,
    init: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  });
  return getTracksResponse;
};

export const getAccessToken = async () => {
  try {
    let tokenInfo = getTokenInfo();
    if (!tokenInfo) {
      return undefined;
    }
    const { accessToken, date } = tokenInfo;

    if (accessToken) {
      const res: TokenInfo = await { accessToken: accessToken, date };
      if (!res) {
        throw new Error("Error getting access token");
      }
      return res;
    }
  } catch (error) {
    console.error(error);
  }

  return undefined;
};

export const refreshToken = async () => {
  try {
    const loginResponse = await fetch(`/refresh`);
    return await loginResponse.json();
  } catch (error) {
    console.error(error);
  }
};
