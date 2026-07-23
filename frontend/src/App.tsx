import { useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { StateDetailPanel } from "./components/StateDetailPanel";
import { StateList } from "./components/StateList";
import { useStatesQuery } from "./hooks/useStates";

export function App() {
  const { data: states, isPending, isError, error } = useStatesQuery();
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [highlightedNames, setHighlightedNames] = useState<Set<string>>(() => new Set());
  const [filterText, setFilterText] = useState("");

  const allNames = useMemo(
    () => (states ?? []).map((item) => item.state),
    [states],
  );

  const highlightedList = useMemo(
    () => allNames.filter((name) => highlightedNames.has(name)),
    [allNames, highlightedNames],
  );

  const filteredHighlightedList = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) {
      return highlightedList;
    }
    return highlightedList.filter((name) => name.toLowerCase().includes(query));
  }, [highlightedList, filterText]);

  function handleSelect(name: string) {
    setSelectedName(name);
  }

  function handleToggleHighlight(name: string) {
    setHighlightedNames((previous) => {
      const next = new Set(previous);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      {isPending && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress aria-label="Loading states" />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : "Failed to load states"}
        </Alert>
      )}

      {states && (
        <Stack spacing={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
              alignItems: "stretch",
            }}
          >
            <StateList
              title="All states"
              names={allNames}
              selectedName={selectedName}
              highlightedNames={highlightedNames}
              onSelect={handleSelect}
              onToggleHighlight={handleToggleHighlight}
            />

            <Stack spacing={1} sx={{ minHeight: 0 }}>
              <TextField
                size="small"
                label="Filter highlighted states"
                placeholder='e.g. "ne"'
                value={filterText}
                onChange={(event) => setFilterText(event.target.value)}
                fullWidth
              />
              <StateList
                title="Highlighted states"
                names={filteredHighlightedList}
                selectedName={selectedName}
                highlightedNames={highlightedNames}
                emptyMessage={
                  highlightedList.length === 0
                    ? "Double-click states in the first list to highlight them."
                    : "No highlighted states match this filter."
                }
                onSelect={handleSelect}
                onToggleHighlight={handleToggleHighlight}
              />
            </Stack>
          </Box>

          <StateDetailPanel stateName={selectedName} />
        </Stack>
      )}
    </Container>
  );
}
