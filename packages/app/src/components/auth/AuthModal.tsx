import { useAuthModal } from "@/hooks";
import {
  accessTokenState,
  authModalState,
  userIdState,
  userMailState,
} from "@/states";
import { AuthModalState } from "@/types";
import { Box, Modal, styled } from "@mui/material";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  ForgotPasswordForm,
  LoginForm,
  MailVerifyForm,
  SignUpForm,
  UpdatePasswordForm,
} from "./form";

export default function AuthModal() {
  const { isAuthModal, offAuthModal } = useAuthModal();

  const [isForgot, setIsForgot] = useState(false);
  const setUserId = useSetRecoilState(userIdState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const [userMail, setUserMail] = useRecoilState(userMailState);
  const [authModal, setAuthModal] = useRecoilState(authModalState);

  const handleAuthModal = (path: AuthModalState) => {
    setAuthModal(path);
  };

  const modalData: { [key: string]: JSX.Element } = {
    login: (
      <LoginForm
        handleAuthModal={handleAuthModal}
        handleClose={offAuthModal}
        setAccessToken={setAccessToken}
        setUserId={setUserId}
        setUserMail={setUserMail}
        setIsForgot={setIsForgot}
      />
    ),
    password: (
      <ForgotPasswordForm
        handleAuthModal={handleAuthModal}
        setIsForgot={setIsForgot}
        setUserMail={setUserMail}
      />
    ),
    signUp: <SignUpForm handleAuthModal={handleAuthModal} />,
    verify: (
      <MailVerifyForm
        handleAuthModal={handleAuthModal}
        handleClose={offAuthModal}
        setAccessToken={setAccessToken}
        userMail={userMail}
        isForgot={isForgot}
      />
    ),
    updatePassword: (
      <UpdatePasswordForm
        handleClose={offAuthModal}
        setUserMail={setUserMail}
      />
    ),
  };

  return (
    <Box>
      <Modal open={isAuthModal} onClose={offAuthModal}>
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
