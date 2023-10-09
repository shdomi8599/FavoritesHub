import { Box, styled } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  clickEvent: () => void;
  children: ReactNode;
}

export default function IconBox({ clickEvent, children }: Props) {
  return (
    <Container
      onClick={(e) => {
        e.stopPropagation();
        clickEvent();
      }}
    >
      {children}
    </Container>
  );
}

const Container = styled(Box)(({}) => ({
  cursor: "pointer",
  position: "relative",
  "&:hover": {
    "&:before": {
      content: '""',
      position: "absolute",
      left: "-28%",
      top: "-26%",
      background: "#666666",
      opacity: "0.5",
      padding: "1.2rem",
      borderRadius: "10px",
    },
  },
}));
