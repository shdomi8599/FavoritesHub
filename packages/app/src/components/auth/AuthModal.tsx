import { useAuthEvent } from "@/hooks/event";
import { useAuthModal } from "@/hooks/modal";
import { Modal } from "@mui/material";
import { ModalContentBox } from "../modal";
import {
  ForgotPasswordForm,
  MailVerifyForm,
  SignUpForm,
  UpdatePasswordForm,
} from "./form";

export default function AuthModal() {
  const { isAuthModal, offAuthModal, handleAuthModal, authModal } =
    useAuthModal();

  const { authForgotPassword, authSignUp, authMailVerify, authUpdatePassword } =
    useAuthEvent();

  const modalData = {
    password: (
      <ForgotPasswordForm
        authForgotPassword={authForgotPassword}
        offAuthModal={offAuthModal}
        handleAuthModal={handleAuthModal}
      />
    ),
    signUp: (
      <SignUpForm
        authSignUp={authSignUp}
        handleAuthModal={handleAuthModal}
        offAuthModal={offAuthModal}
      />
    ),
    verify: <MailVerifyForm authMailVerify={authMailVerify} />,
    updatePassword: (
      <UpdatePasswordForm authUpdatePassword={authUpdatePassword} />
    ),
  };

  return (
    <Modal open={isAuthModal} onClose={offAuthModal}>
      <ModalContentBox>{modalData[authModal]}</ModalContentBox>
    </Modal>
  );
}
