import { useEffect, useState } from "react";
import { fetchPlaylistTracks } from "../services/spotifyApi";
import { SelectedPlaylistSongsAnalysis } from "./SelectedPlaylistSongsAnalysis";

interface Props {
  playlistLink: string;
}

export const SelectedPlaylistSongs = ({ playlistLink }: Props): JSX.Element => {

  const [songs, setSongs] = useState<string>("");

  const getTracks = async (playlist_id: string) => {
    try {
      const tracks = await fetchPlaylistTracks(playlist_id);
      return tracks;
    } catch (error) {
      return undefined;
    }
  };

  const PLAYLIST_LINK = playlistLink.split("/").pop() as string;
  useEffect(() => {
    const songIdList = async () => {
      try {
        if (PLAYLIST_LINK) {
          const tracks = await getTracks(PLAYLIST_LINK);
          if (!tracks) {
            //TODO -- Error state
            return;
          }
          const trackIds = tracks?.items
            .map((playlistTrack) => playlistTrack.track?.id)
            .filter((id) => id !== undefined);

          let uniqueTracks = [...new Set(trackIds)].join("%2c");

          setSongs(uniqueTracks);
        }
      } catch (error) {
        console.log(error);
      }
    };
    songIdList();
  }, [PLAYLIST_LINK, songs]);

  return (
    <>
      <SelectedPlaylistSongsAnalysis trackIds={songs} />
    </>
  );
};
