import { Typography } from "@mui/material";

interface Props {
  name: string;
}

export default function AuthTitle({ name }: Props) {
  return (
    <Typography component="h1" variant="h5" textTransform={"uppercase"}>
      {name}
    </Typography>
  );
}
