import { useModal } from "@/hooks";
import { Box, Modal, Typography, styled } from "@mui/material";

export default function LoginModal() {
  const { isModal, handleClose } = useModal();

  return (
    <Box>
      <Modal open={isModal} onClose={handleClose}>
        <ContentBox>
          <Typography variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </ContentBox>
      </Modal>
    </Box>
  );
}

const ContentBox = styled(Box)(({}) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  minWidth: "300px",
  backgroundColor: "white",
  border: "2px solid #000",
  padding: "1.5rem",
}));
