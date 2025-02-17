import { postAuthMail } from "@/api/auth";
import {
  ModalAlertMessage,
  ModalButton,
  ModalForm,
  ModalLink,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions } from "@/const";
import { useAuth } from "@/hooks/data";
import { MailVerifyInput } from "@/types";
import { successAlert } from "@/util";
import { Box, Container, Grid, TextField } from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTimer } from "react-timer-hook";

interface Props {
  authMailVerify: (data: MailVerifyInput) => Promise<void>;
}

export default function MailVerifyForm({ authMailVerify }: Props) {
  const { userMail } = useAuth();
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 180);
  const { seconds, restart, minutes } = useTimer({ expiryTimestamp });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<MailVerifyInput>();

  const onVerifyMail = async () => {
    restart(expiryTimestamp);
    successAlert("메일이 발송되었습니다.", "인증번호");
    await postAuthMail(userMail);
  };

  const onSubmit: SubmitHandler<MailVerifyInput> = async (data) => {
    await authMailVerify(data);
  };

  useEffect(() => {
    onVerifyMail();
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
