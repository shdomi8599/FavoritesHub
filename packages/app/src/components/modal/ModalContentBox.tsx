import { Box, styled } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ModalContentBox({ children }: Props) {
  return <ContentBox sx={{ boxShadow: 3 }}>{children}</ContentBox>;
}

const ContentBox = styled(Box)(({}) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  minWidth: "300px",
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "4px",
}));
