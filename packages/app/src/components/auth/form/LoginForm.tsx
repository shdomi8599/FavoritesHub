import { ApiResultAccessToken, AuthProps, LoginFormInput } from "@/types";
import { callbackSuccessAlert, errorAlert } from "@/util";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater } from "recoil";
import { AuthButton, AuthFormInput, AuthLink, AuthTitle } from "../common";

interface Props extends AuthProps {
  handleClose: () => void;
  setAccessToken: SetterOrUpdater<string>;
  setUserId: SetterOrUpdater<number>;
  setUserMail: SetterOrUpdater<string>;
  setIsForgot: SetterOrUpdater<boolean>;
}

export default function LoginForm({
  handleClose,
  handleAuthModal,
  setAccessToken,
  setUserId,
  setUserMail,
  setIsForgot,
  api,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormInput>();

  const alertEvent = () => {
    handleAuthModal("verify");
  };

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    const { mail, password } = data;

    const user = await api
      .post("/user/exist", { mail })
      .then((res) => res.data);

    if (!user) {
      return errorAlert("가입되지 않은 이메일입니다.", "이메일 확인");
    }

    const { accessToken, message, userId } = await api
      .post<ApiResultAccessToken>("/auth/login", { mail, password })
      .then((res) => res.data);

    if (message === "not exact") {
      return errorAlert("비밀번호가 일치하지 않습니다.", "비밀번호 확인");
    }

    if (message === "not verify") {
      setUserMail(mail);
      return callbackSuccessAlert(
        "이메일 인증을 부탁드려요.",
        "인증 하러가기",
        alertEvent,
      );
    }

    setUserId(userId);
    setAccessToken(accessToken!);
    handleClose();
  };

  useEffect(() => {
    setIsForgot(false);
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
        <AuthTitle name="로그인" />
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: "90%" }}
        >
          <AuthFormInput
            register={register}
            name="mail"
            error={errors?.mail}
            isSubmitted={isSubmitted}
          />
          <AuthFormInput
            register={register}
            name="password"
            error={errors?.password}
            isSubmitted={isSubmitted}
          />
          <FormControlLabel
            sx={{ display: "block" }}
            control={<Checkbox value="auto-login" color="primary" />}
            label="자동 로그인"
          />
          <AuthButton>로그인</AuthButton>
          <Grid container>
            <Grid item xs>
              <AuthLink clickEvent={() => handleAuthModal("password")}>
                비밀번호 재설정
              </AuthLink>
            </Grid>
            <Grid item>
              <AuthLink clickEvent={() => handleAuthModal("signUp")}>
                회원가입
              </AuthLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
