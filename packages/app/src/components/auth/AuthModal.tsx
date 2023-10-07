import { useModal } from "@/hooks";
import { accessTokenState, authModalState, userIdState } from "@/states";
import { AuthModalState } from "@/types";
import { Box, Modal, styled } from "@mui/material";
import { useRecoilState, useSetRecoilState } from "recoil";
import LoginForm from "./LoginForm";
import PasswordForm from "./PasswordForm";
import SignUpForm from "./SignUpForm";
import VerifyForm from "./VerifyForm";

export default function AuthModal() {
  const { isModal, handleClose } = useModal();

  const [userId, setUserId] = useRecoilState(userIdState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const [authModal, setAuthModal] = useRecoilState(authModalState);

  const handleAuthModal = (auth: AuthModalState) => {
    setAuthModal(auth);
  };

  const modalData: { [key: string]: JSX.Element } = {
    login: (
      <LoginForm
        handleAuthModal={handleAuthModal}
        handleClose={handleClose}
        setAccessToken={setAccessToken}
        setUserId={setUserId}
      />
    ),
    password: <PasswordForm handleAuthModal={handleAuthModal} />,
    signUp: <SignUpForm handleAuthModal={handleAuthModal} />,
    verify: (
      <VerifyForm
        handleClose={handleClose}
        setAccessToken={setAccessToken}
        userId={userId}
      />
    ),
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
