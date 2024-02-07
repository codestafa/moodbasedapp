import { useEffect, useState } from "react";
import { PlaylistDropDown } from "./PlaylistDropDown";
import { Playlist } from "spotify-types";
import { fetchPlaylists, getAccessToken } from "../services/spotifyApi";
import { logout, retrieveAccessToken } from "../utils/authUtils";
import Cookies from "js-cookie";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Login } from "./Login";

export function Userinfo() {
  const [spotifyPlaylists, setPlaylists] = useState<Playlist[] | undefined>([]);
  const [isTokenSet, setTokenStatus] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [logOutUser, setLogOutUser] = useState<boolean>(false);

  const getPlaylists = async (limit: number, offset: number) => {
    try {
      const playlistResponse = await fetchPlaylists(offset, limit);
      if (playlistResponse) return playlistResponse.items;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const accessTokenCookie = Cookies.get("accessToken");
    if (accessTokenCookie) setAccessToken(accessTokenCookie);

    const getAndPersistAccessToken = async () => {
      const accessToken = await retrieveAccessToken();
      if (accessToken) {
        setTokenStatus(true);
      }

      if (!accessToken) {
        const authResponse = await getAccessToken();
        if (!authResponse) {
          return undefined;
        }
        setTokenStatus(true);
      }
    };

    const retrievePlaylists = async () => {
      setPlaylists(await getPlaylists(5, 50));
    };

    getAndPersistAccessToken();
    retrievePlaylists();
  }, [isTokenSet, accessToken, logOutUser]);

  return (
    <>
      {spotifyPlaylists ? (
        <Grid container>
          {spotifyPlaylists && (
            <PlaylistDropDown playlists={spotifyPlaylists} />
          )}
          <Grid item xs={1} sm={1} lg={1} md={1}>
            <Box marginY={3}>
              <Button
                size="small"
                sx={{ backgroundColor: "white" }}
                variant="contained"
                onClick={() => {
                  logout();
                  setLogOutUser(true);
                }}
              >
                <Typography variant="button" color={"black"}>
                  Logout
                </Typography>
              </Button>
            </Box>
          </Grid>
          <Grid item xs={11} sm={11} lg={11} md={11}>
            <Box marginY={3} textAlign={"right"}>
              <Button
                size="small"
                sx={{ backgroundColor: "white", marginRight: 2 }}
                variant="contained"
              >
                <a
                  href="/privacy"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <Typography variant="button" color={"black"}>
                    Privacy
                  </Typography>
                </a>
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Login></Login>
      )}
    </>
  );
}
