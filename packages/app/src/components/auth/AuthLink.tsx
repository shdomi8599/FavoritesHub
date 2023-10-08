import Link from "@mui/material/Link";
import { ReactNode } from "react";

interface Props {
  clickEvent: () => void;
  children: ReactNode;
}

export default function AuthLink({ clickEvent, children }: Props) {
  return (
    <Link onClick={clickEvent} sx={LinkStyle} variant="body2">
      {children}
    </Link>
  );
}

const LinkStyle = {
  cursor: "pointer",
};
