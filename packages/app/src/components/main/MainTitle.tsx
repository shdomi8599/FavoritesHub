import { mainBlueColor } from "@/const";
import { Star as StarIcon } from "@mui/icons-material";
import { Box, Tooltip, Typography } from "@mui/material";

type Props = {
  presetName: string;
};

export default function MainTitle({ presetName }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        "@media screen and (max-width: 600px)": {
          width: "100%",
        },
      }}
    >
      <Typography
        sx={{
          p: 0.5,
          backgroundColor: presetName ? mainBlueColor : "gray",
          color: "white",
          borderRadius: "50%",
          display: "flex",
        }}
      >
        <StarIcon />
      </Typography>
      <Tooltip title={presetName} enterDelay={300}>
        <Typography
          sx={{
            fontSize: "2rem",
          }}
          noWrap
        >
          {presetName}
        </Typography>
      </Tooltip>
    </Box>
  );
}
