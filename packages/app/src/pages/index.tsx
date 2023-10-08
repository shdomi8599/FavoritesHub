import FavoriteCard from "@/components/favorite/FavoriteCard";
import { viewPresetState } from "@/states";
import { Grid } from "@mui/material";
import { useRecoilValue } from "recoil";

export default function Main() {
  const viewPreset = useRecoilValue(viewPresetState);
  return (
    <Grid
      container
      spacing={4}
      sx={{
        p: 2,
      }}
    >
      <FavoriteCard />
      <FavoriteCard />
      <FavoriteCard />
      <FavoriteCard />
    </Grid>
  );
}
