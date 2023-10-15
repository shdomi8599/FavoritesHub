import { useAuth, useAuthModal } from "@/hooks";
import { isPasswordForgotState, isRefreshTokenState } from "@/states";
import { Modal } from "@mui/material";
import { useRecoilState, useRecoilValue } from "recoil";
import { ModalContentBox } from "../modal";
import {
  ForgotPasswordForm,
  MailVerifyForm,
  SignUpForm,
  UpdatePasswordForm,
} from "./form";

export default function AuthModal() {
  const isRefreshToken = useRecoilValue(isRefreshTokenState);
  const { setUserId, setAccessToken, userMail, setUserMail } = useAuth();
  const { isAuthModal, offAuthModal, handleAuthModal, authModal } =
    useAuthModal();

  const [isForgot, setIsForgot] = useRecoilState(isPasswordForgotState);

  const modalData: Record<string, JSX.Element> = {
    password: (
      <ForgotPasswordForm
        handleClose={offAuthModal}
        handleAuthModal={handleAuthModal}
        setIsForgot={setIsForgot}
        setUserMail={setUserMail}
      />
    ),
    signUp: (
      <SignUpForm
        handleAuthModal={handleAuthModal}
        handleClose={offAuthModal}
      />
    ),
    verify: (
      <MailVerifyForm
        setUserMail={setUserMail}
        handleAuthModal={handleAuthModal}
        handleClose={offAuthModal}
        setAccessToken={setAccessToken}
        setUserId={setUserId}
        userMail={userMail}
        isForgot={isForgot}
        isRefreshToken={isRefreshToken}
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
    <Modal open={isAuthModal} onClose={offAuthModal}>
      <ModalContentBox>{modalData[authModal]}</ModalContentBox>
    </Modal>
  );
}
