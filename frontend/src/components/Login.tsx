import { Box, Button, Grid, Typography } from "@mui/material";
import moodbasedExample from "../images/moodbasedExample.JPG";
export function Login() {
  return (
    <Grid container columns={1}>
      <Grid
        item
        xs={1}
        lg={1}
        md={1}
        sm={1}
        display={"flex"}
        justifyContent="center"
      >
        <Box
          component="img"
          sx={{
            maxHeight: { xs: 400, s: 500, md: 700, lg: 800 },
            maxWidth: { xs: 300, s: 400, md: 600, lg: 700 },
            margin: 1,
          }}
          alt=""
          src={moodbasedExample}
        />
      </Grid>
      <Grid
        item
        xs={1}
        lg={1}
        md={1}
        sm={1}
        display={"flex"}
        justifyContent="center"
      >
        <Button
          size="small"
          sx={{ backgroundColor: "white", marginTop: 4 }}
          variant="contained"
          href="http://localhost:3005/passport"
        >
          <Typography variant="h6"> Login through Spotify</Typography>
        </Button>
      </Grid>
    </Grid>
  );
}
