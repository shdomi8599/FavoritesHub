import { Typography } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  clickEvent: () => void;
  children: ReactNode;
}

export default function ModalLink({ clickEvent, children }: Props) {
  return (
    <Typography onClick={clickEvent} sx={LinkStyle} variant="body2">
      {children}
    </Typography>
  );
}

const LinkStyle = {
  cursor: "pointer",
  color: "#1976d2",
  textDecoration: "underline",
};
