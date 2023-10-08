import { Box, styled } from "@mui/material";
import { ReactNode, forwardRef } from "react";

type Props = {
  children: ReactNode;
};

const ModalContentBox = forwardRef(({ children }: Props, ref) => {
  return (
    <ContentBox ref={ref} sx={{ boxShadow: 3 }}>
      {children}
    </ContentBox>
  );
});

ModalContentBox.displayName = "ModalContentBox";

export default ModalContentBox;

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
