import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useStateDetailQuery } from "../hooks/useStates";
import { Divider } from "@mui/material";

type StateDetailPanelProps = {
  stateName: string | null;
  /** `detail` URL from the `/states` list item — used to load this panel. */
  detailUrl: string | null;
};

export function StateDetailPanel({ stateName, detailUrl }: StateDetailPanelProps) {
  const { data, isPending, isError, error, isFetching } = useStateDetailQuery(detailUrl);

  const countyPopulationSum =
    data?.countyList.reduce((sum, county) => sum + county.population, 0) ?? 0;
  const populationsMatch = data ? countyPopulationSum === data.population : false;

  return (
    <Paper
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
    >
      <Typography
        variant="subtitle2"
        sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: "divider", fontWeight: 600 }}
      >
        State details
      </Typography>

      <Box
        sx={{
          p: 1.5,
          height: 320,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!stateName && (
          <Typography variant="body2" color="text.secondary">
            Click a state to view its details.
          </Typography>
        )}

        {stateName && !detailUrl && (
          <Alert severity="error">No detail URL was provided for this state.</Alert>
        )}

        {detailUrl && isPending && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
            <CircularProgress size={28} aria-label="Loading state details" />
          </Box>
        )}

        {detailUrl && isError && (
          <Alert severity="error">
            {error instanceof Error ? error.message : "Failed to load state details"}
          </Alert>
        )}

        {data && (
          <Stack direction="row" spacing={1.5} divider={<Divider flexItem orientation="vertical" />} sx={{ height: "100%" }}>
            <Stack spacing={1.5} sx={{ minWidth: 0 }}>
              <Box>
                <Typography variant="h6" component="h2">
                  {data.state}
                </Typography>
                {isFetching && !isPending && (
                  <Typography variant="caption" color="text.secondary">
                    Refreshing…
                  </Typography>
                )}
              </Box>

              <Stack spacing={0.5}>
                <Typography variant="body2">
                  State population: <strong>{data.population.toLocaleString()}</strong>
                </Typography>
                <Typography variant="body2">
                  Number of counties: <strong>{data.counties.toLocaleString()}</strong>
                </Typography>
                <Typography variant="body2">
                  Sum of county populations:{" "}
                  <strong>{countyPopulationSum.toLocaleString()}</strong>
                </Typography>
              </Stack>

              <Alert severity={populationsMatch ? "success" : "warning"} sx={{ py: 0.5 }}>
                {populationsMatch
                  ? "County population totals match the state population record."
                  : "County population totals do not match the state population record."}
              </Alert>
            </Stack>

            <Stack sx={{ display: "flex", minHeight: 0, height: "100%", width: "100%" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Counties
              </Typography>
              <List
                dense
                disablePadding
                sx={{ flex: 1, minHeight: 0, overflow: "auto" }}
              >
                {data.countyList.map((county) => (
                  <ListItem key={county.county} disableGutters divider>
                    <ListItemText
                      primary={county.county}
                      secondary={`Population: ${county.population.toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}
