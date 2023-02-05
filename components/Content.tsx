// This is the wrapper for the main content of the app (extracted from Theme.tsx)
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export default function Content({ props }: any) {
  return (
    <Box
      component="main"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Toolbar />
      {props.children}
    </Box>
  );
}
