import { useState } from "react";
import { SelectedPlaylistSongs } from "./SelectedPlaylistSongs";
import { Playlist } from "spotify-types";

// Material UI imports-----------------------

import {
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  Box,
} from "@mui/material";

// -------------------------------------------

export function PlaylistDropDown({ playlists }: { playlists: Playlist[] }) {
  const [option, setOption] = useState<Playlist | undefined>();

  const handleChange = (event: SelectChangeEvent) => {
    const playlistName = event.target.value;
    setOption(playlists.find((playlist) => playlist.name === playlistName));
  };

  return (
    <Grid container spacing={2}>
      <Box display={"flex"} justifyContent="center" width={1}>
        <Grid item xs={12} sm={12} lg={12} md={12}>
          <FormControl
            fullWidth
            sx={{ paddingBottom: 1 }}
            style={{ background: "#00000" }}
          >
            <Select
              label="Select a Playlist"
              onChange={handleChange}
              labelId="Select a Playlist"
            >
              {playlists.map((elem, i) => (
                <MenuItem key={elem.name} value={elem.name}>
                  <Typography>{elem.name}</Typography>
                </MenuItem>
              ))}
            </Select>
            <InputLabel>Select a Playlist</InputLabel>
          </FormControl>
        </Grid>
      </Box>
      <SelectedPlaylistSongs playlistLink={option?.href || ""} />
    </Grid>
  );
}
