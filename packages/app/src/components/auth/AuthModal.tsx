import { useAuthModal } from "@/hooks";
import { accessTokenState, userIdState, userMailState } from "@/states";
import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ModalContentBox } from "../modal";
import {
  ForgotPasswordForm,
  LoginForm,
  MailVerifyForm,
  SignUpForm,
  UpdatePasswordForm,
} from "./form";

export default function AuthModal() {
  const { isAuthModal, offAuthModal, handleAuthModal, authModal } =
    useAuthModal();

  const [isForgot, setIsForgot] = useState(false);
  const setUserId = useSetRecoilState(userIdState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const [userMail, setUserMail] = useRecoilState(userMailState);

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
        <ModalContentBox>{modalData[authModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
