import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useStatesQuery } from "./hooks/useStates";

export function App() {
  const { data: states, isPending, isError, error } = useStatesQuery();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box component="header" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          States &amp; Counties
        </Typography>
        <Typography color="text.secondary">
          Browse US states and their counties.
        </Typography>
      </Box>

      {isPending && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress aria-label="Loading states" />
        </Box>
      )}

      {isError && (
        <Alert severity="error">
          {error instanceof Error ? error.message : "Failed to load states"}
        </Alert>
      )}

      {states && (
        <List disablePadding>
          {states.map((item, index) => (
            <Box key={item.state}>
              {index > 0 && <Divider component="li" />}
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemText
                  primary={item.state}
                  secondary={`${item.counties.toLocaleString()} counties · ${item.population.toLocaleString()} people`}
                  slotProps={{
                    primary: { sx: { fontWeight: 500 } },
                  }}
                />
              </ListItem>
            </Box>
          ))}
        </List>
      )}
    </Container>
  );
}
