import { authFormOptions } from "@/const";
import { useApi } from "@/hooks";
import { ApiResultAccessToken, ApiResultMessage } from "@/types";
import { errorAlert, successAlert } from "@/util";
import { Grid, Link, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater } from "recoil";
import AuthAlertMessage from "./AuthAlertMessage";
import AuthButton from "./AuthButton";
import AuthTitle from "./AuthTitle";

type Props = {
  handleClose: () => void;
  setAccessToken: SetterOrUpdater<string>;
  userId: number;
};

export default function VerifyForm({
  handleClose,
  setAccessToken,
  userId,
}: Props) {
  const { api } = useApi();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<{ verifyCode: string }>();

  const onVerifyMail = async () => {
    successAlert("메일이 발송되었습니다.", "인증번호");
    await api.post("/auth/mail", { userId });
  };

  const onSubmit: SubmitHandler<{ verifyCode: string }> = async (data) => {
    const { verifyCode } = data;
    const { message } = await api
      .post<ApiResultMessage>("/auth/verify", {
        userId,
        verifyCode,
      })
      .then((res) => res.data);

    if (message === "not verify") {
      return errorAlert("인증번호가 일치하지 않습니다.", "인증번호");
    }

    if (message === "success") {
      successAlert("이메일 인증에 성공했습니다.", "이메일 인증");
      const { accessToken } = await api
        .post<ApiResultAccessToken>("/auth/verify/login", {
          userId,
        })
        .then((res) => res.data);

      setAccessToken(accessToken!);
      handleClose();
    }
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
        <AuthTitle name="이메일 인증" />
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: "80%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            {...register("verifyCode", authFormOptions["verifyCode"])}
            label={"인증번호"}
            autoFocus={true}
          />
          {isSubmitted && <AuthAlertMessage error={errors.verifyCode} />}
          <Grid container sx={{ mt: 1 }}>
            <Link onClick={onVerifyMail} sx={linkStyle} variant="body2">
              이메일 재전송
            </Link>
          </Grid>
          <AuthButton name="verify" />
        </Box>
      </Box>
    </Container>
  );
}

const linkStyle = {
  cursor: "pointer",
};
