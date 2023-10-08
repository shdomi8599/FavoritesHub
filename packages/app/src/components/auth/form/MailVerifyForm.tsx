import { postAuthMail, postAuthVerify, postAuthVerifyLogin } from "@/api/auth";
import {
  ModalAlertMessage,
  ModalButton,
  ModalForm,
  ModalLink,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions } from "@/const";
import { AuthProps } from "@/types";
import { errorAlert, successAlert } from "@/util";
import { Box, Container, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";
import { SetterOrUpdater } from "recoil";

interface Props extends AuthProps {
  handleClose: () => void;
  setAccessToken: SetterOrUpdater<string>;
  setUserId: SetterOrUpdater<number>;
  userMail: string;
  isForgot: boolean;
}

export default function MailVerifyForm({
  handleClose,
  setAccessToken,
  userMail,
  isForgot,
  handleAuthModal,
  setUserId,
}: Props) {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 180);
  const { seconds, restart, minutes } = useTimer({ expiryTimestamp });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<{ verifyCode: string }>();

  const onVerifyMail = async () => {
    restart(expiryTimestamp);
    successAlert("메일이 발송되었습니다.", "인증번호");
    await postAuthMail(userMail);
  };

  const onSubmit: SubmitHandler<{ verifyCode: string }> = async (data) => {
    const { verifyCode } = data;
    const { message } = await postAuthVerify(userMail, verifyCode);

    if (message === "not verify") {
      return errorAlert("인증번호가 일치하지 않습니다.", "인증번호");
    }

    if (message === "success") {
      successAlert("이메일 인증에 성공했습니다.", "이메일 인증");
    }

    if (isForgot) {
      return handleAuthModal("updatePassword");
    }

    const { accessToken, userId } = await postAuthVerifyLogin(userMail);

    setUserId(userId);
    setAccessToken(accessToken!);
    handleClose();
  };

  useEffect(() => {
    onVerifyMail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ModalTitle name="이메일 인증" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            required
            fullWidth
            {...register("verifyCode", authFormOptions["verifyCode"])}
            label={"인증번호"}
            autoFocus={true}
          />
          {isSubmitted && <ModalAlertMessage error={errors.verifyCode} />}
          <Grid container sx={{ mt: 1, justifyContent: "space-between" }}>
            <ModalLink clickEvent={onVerifyMail}>이메일 재전송</ModalLink>
            <Box>
              남은 시간 {minutes}분:{seconds}초
            </Box>
          </Grid>
          <ModalButton>인증하기</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
