import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Userinfo } from "./components/Userinfo";
import { Privacy } from "./components/Privacy";

// Material UI Imports ---------------------

import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

const theme = createTheme({
  spacing: 6,
  palette: {
    mode: "dark",
    background: {
      default: "black",
    },
    primary: {
      main: "#1DB954",
    },
  },

  typography: {
    fontSize: 15,
    fontFamily: ["sans-serif"].join(","),
  },
  
});

// ----------------------------------------

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <Container sx={{ marginTop: 5 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Userinfo />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </Container>
      </CssBaseline>
    </ThemeProvider>
  );
}
