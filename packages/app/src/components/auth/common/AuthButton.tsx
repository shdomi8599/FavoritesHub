import { Button } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthButton({ children }: Props) {
  return (
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
      {children}
    </Button>
  );
}
