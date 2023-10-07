import { accessTokenState } from "@/states";
import { ApiResultAccessToken, AuthProps, LoginFormInput } from "@/types";
import { api } from "@/util";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import AuthButton from "./AuthButton";
import AuthFormInput from "./AuthFormInput";
import AuthLink from "./AuthLink";
import AuthTitle from "./AuthTitle";

interface Props extends AuthProps {
  handleClose: () => void;
}

export default function LoginForm({ handleClose, handleAuthModal }: Props) {
  const setAccessToken = useSetRecoilState(accessTokenState);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormInput>();

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    const { mail, password } = data;

    const user = await api
      .post("/user/exist", { mail })
      .then((res) => res.data);

    if (!user) {
      return "가입되지 않은 이메일입니다.";
    }

    const { accessToken, message } = await api
      .post<ApiResultAccessToken>("/auth/login", { mail, password })
      .then((res) => res.data);

    if (message === "not exact") {
      return "비밀번호가 일치하지 않습니다.";
    }

    setAccessToken(accessToken!);
    handleClose();
  };

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
          sx={{ mt: 1 }}
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
          <AuthButton name="login" />
          <Grid container>
            <Grid item xs>
              <AuthLink handleAuthModal={handleAuthModal} linkName="password" />
            </Grid>
            <Grid item>
              <AuthLink handleAuthModal={handleAuthModal} linkName="signUp" />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
