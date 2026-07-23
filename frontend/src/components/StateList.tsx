import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

type StateListProps = {
  title: string;
  names: string[];
  selectedName: string | null;
  highlightedNames: ReadonlySet<string>;
  emptyMessage?: string;
  onSelect: (name: string) => void;
  onToggleHighlight: (name: string) => void;
};

export function StateList({
  title,
  names,
  selectedName,
  highlightedNames,
  emptyMessage = "No states to show.",
  onSelect,
  onToggleHighlight,
}: StateListProps) {
  return (
    <Paper variant="outlined" sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
      <Typography
        variant="subtitle2"
        sx={{ px: 1.5, py: 1, borderBottom: 1, borderColor: "divider", fontWeight: 600 }}
      >
        {title}
      </Typography>
      <List
        dense
        disablePadding
        sx={{ height: 220, overflow: "auto" }}
        aria-label={title}
      >
        {names.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 1.5, py: 2 }}>
            {emptyMessage}
          </Typography>
        ) : (
          names.map((name) => {
            const isSelected = name === selectedName;
            const isHighlighted = highlightedNames.has(name);

            return (
              <ListItemButton
                key={name}
                selected={isSelected}
                onClick={() => onSelect(name)}
                onDoubleClick={() => onToggleHighlight(name)}
                sx={{
                  userSelect: "none",
                  bgcolor: isHighlighted ? "warning.light" : undefined,
                  "&.Mui-selected": {
                    bgcolor: isHighlighted ? "warning.main" : "action.selected",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: isHighlighted ? "warning.main" : "action.selected",
                  },
                  "&:hover": {
                    bgcolor: isHighlighted ? "warning.light" : undefined,
                  },
                }}
              >
                <ListItemText
                  primary={name}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: isHighlighted || isSelected ? 600 : 400,
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })
        )}
      </List>
    </Paper>
  );
}
