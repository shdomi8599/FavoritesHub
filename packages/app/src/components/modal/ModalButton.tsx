import { Button } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  disabled?: boolean;
}

export default function ModalButton({ children, disabled = false }: Props) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
      {children}
    </Button>
  );
}
