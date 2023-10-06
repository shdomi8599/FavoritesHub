import { useModal } from "@/hooks";
import { authModalState } from "@/states";
import { Box, Modal, styled } from "@mui/material";
import { useRecoilValue } from "recoil";
import LoginForm from "./LoginForm";

export default function LoginModal() {
  const { isModal, handleClose } = useModal();

  const authModal = useRecoilValue(authModalState);
  const modalData: { [key: string]: JSX.Element } = {
    login: <LoginForm />,
  };

  return (
    <Box>
      <Modal open={isModal} onClose={handleClose}>
        <ContentBox sx={{ boxShadow: 3 }}>{modalData[authModal]}</ContentBox>
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
  padding: "1.5rem",
  borderRadius: "4px",
}));
