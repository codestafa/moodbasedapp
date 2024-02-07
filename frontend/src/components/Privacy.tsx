import { Box, Button, Grid, Paper, Typography } from "@mui/material";

export function Privacy() {
  return (
    <Grid container>
      <Grid item xs={12} sx={{ marginX: 1 }}>
        <Paper
          sx={{
            borderRadius: 2,
            background: "linear-gradient(45deg, #1DB954, #21fa90ff, #1DB954)",
            width: "100%",
          }}
        >
          <Typography variant="h5" textAlign={"center"} color="#191414">
            Privacy
          </Typography>
          <Grid
            container
            sx={{
              background: "#191414",
              border: "1px solid #1DB954",
              maxWidth: "100%",
            }}
          >
            <Box
              sx={{
                background: "#191414",
                margin: 2,
                borderRadius: 2.5,
                padding: 2,
              }}
            >
              <Typography
                variant="body1"
                width={"100%"}
                sx={{ textDecoration: "underline" }}
                marginBottom={2}
              >
                General Information
              </Typography>
              <Typography variant="body1" width={"100%"} marginBottom={2}>
                When you use this app, you agree to let it access your Spotify
                account username and data for your playlists. Moodbased doesn't
                store or collect any of the data it uses, and it doesn't share
                it with third parties. The app only displays information about
                your chosen playlist. You can be sure that your data isn't being
                stored or used maliciously, but if you want to remove
                Moodbased's access, you can go to your{" "}
                <a
                  style={{ textDecoration: "none", color: "#1DB954" }}
                  href="https://www.spotify.com/us/account/apps/"
                >
                  apps page{" "}
                </a>
                and click "Remove Access" on Moodbased.
              </Typography>

              <Typography
                variant="body1"
                width={"100%"}
                sx={{ textDecoration: "underline" }}
                marginBottom={2}
              >
                Cookies
              </Typography>
              <Typography variant="body1" width={"100%"} marginBottom={2}>
                Regarding cookie storage, the application operates on a
                minimalistic basis. It doesn't keep the refresh token in the
                browser, but instead stores only the essential cookies required
                for the app to function properly. Specifically, these cookies
                include an access token, which is used to access your Spotify
                account and expires after an hour, a date cookie that tracks the
                expiration of the access token, and a connect.sid cookie that
                maintains the user session. None of these cookies collect any
                personal information, and their only purpose is to ensure
                seamless and secure access to the application.
              </Typography>
            </Box>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={1} sm={1} lg={1} md={1}>
        <Box marginY={3}></Box>
      </Grid>
      <Grid item xs={11} sm={11} lg={11} md={11}>
        <Box marginY={3} textAlign={"right"}>
          <Button
            size="small"
            sx={{ backgroundColor: "white", marginRight: 2 }}
            variant="contained"
          >
            <a href="/" style={{ textDecoration: "none", color: "black" }}>
              <Typography variant="button" color={"black"}>
                {" "}
                Dashboard
              </Typography>
            </a>
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}
