import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1a5f4a",
    },
    background: {
      default: "#f4f6f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
  },
  shape: {
    borderRadius: 8,
  },
});
