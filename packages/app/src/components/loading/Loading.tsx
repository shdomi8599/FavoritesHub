import { isLoadingState } from "@/states";
import { Box, CircularProgress } from "@mui/material";
import { useRecoilValue } from "recoil";

export default function Loading() {
  const isLoading = useRecoilValue(isLoadingState);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        backgroundColor: "black",
        opacity: "0.5",
        zIndex: isLoading ? 9999 : -100,
      }}
    >
      <CircularProgress />
    </Box>
  );
}
