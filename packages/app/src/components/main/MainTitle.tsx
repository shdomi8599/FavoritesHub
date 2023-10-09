import {
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
} from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

type Props = {
  presetName: string;
  defaultPreset: boolean;
  HandleDefaultPreset: () => void;
};

export default function MainTitle({
  presetName,
  defaultPreset,
  HandleDefaultPreset,
}: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      {defaultPreset ? (
        <Typography
          sx={{
            p: 0.5,
            backgroundColor: "#1976d2",
            color: "white",
            borderRadius: "50%",
            display: "flex",
          }}
        >
          <StarIcon />
        </Typography>
      ) : (
        <Typography
          onClick={HandleDefaultPreset}
          sx={{
            p: 0.5,
            backgroundColor: "rgb(195, 197, 197)",
            color: "white",
            borderRadius: "50%",
            display: "flex",
            cursor: "pointer",
          }}
        >
          <StarOutlineIcon />
        </Typography>
      )}
      <Typography
        sx={{
          fontSize: "2rem",
        }}
        noWrap
      >
        {presetName}
      </Typography>
    </Box>
  );
}
