export interface FetchSpotifyOptions {
  url: string;
  init: RequestInit;
}

export async function fetchSpotify<T>({
  url,
  init,
}: FetchSpotifyOptions): Promise<T> {
  const result = await fetch(url, init);
  return result.json() as Promise<T>;
}
