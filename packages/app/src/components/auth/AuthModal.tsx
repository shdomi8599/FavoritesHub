import { useAuth, useAuthModal } from "@/hooks";
import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { ModalContentBox } from "../modal";
import {
  ForgotPasswordForm,
  LoginForm,
  MailVerifyForm,
  SignUpForm,
  UpdatePasswordForm,
} from "./form";

export default function AuthModal() {
  const { setUserId, setAccessToken, userMail, setUserMail } = useAuth();
  const { isAuthModal, offAuthModal, handleAuthModal, authModal } =
    useAuthModal();

  const [isForgot, setIsForgot] = useState(false);

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
        setUserMail={setUserMail}
        handleAuthModal={handleAuthModal}
        handleClose={offAuthModal}
        setAccessToken={setAccessToken}
        setUserId={setUserId}
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
        <ModalContentBox>{modalData[authModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
