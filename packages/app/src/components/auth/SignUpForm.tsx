import { ApiResultMessage, AuthProps, SignUpFormInput } from "@/types";
import { errorAlert } from "@/util";
import { callbackSuccessAlert } from "@/util/alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthButton from "./AuthButton";
import AuthFormInput from "./AuthFormInput";
import AuthLink from "./AuthLink";
import AuthTitle from "./AuthTitle";

export default function SignUpForm({ handleAuthModal, api }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
  } = useForm<SignUpFormInput>();

  const confirmPasswordOption = {
    required: true,
    validate: (value: string) =>
      value === getValues("password") ||
      "입력하신 비밀번호와 일치하지 않습니다.",
  };

  const alertEvent = () => {
    handleAuthModal("login");
  };

  const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    const { mail, password } = data;
    const { message } = await api
      .post<ApiResultMessage>("/user", { mail, password })
      .then((res) => res.data);

    if (message === "exist") {
      return errorAlert("이미 가입된 이메일입니다.", "이메일 확인");
    }

    if (message === "success") {
      callbackSuccessAlert(
        "회원가입을 축하합니다.",
        "로그인 하러가기",
        alertEvent,
      );
    }
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
        <AuthTitle name="회원가입" />
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
          <AuthFormInput
            register={register}
            name="confirmPassword"
            error={errors?.password}
            isSubmitted={isSubmitted}
            option={confirmPasswordOption}
          />
          <AuthButton>회원가입</AuthButton>
          <Grid container>
            <Grid item xs>
              <AuthLink clickEvent={() => handleAuthModal("login")}>
                로그인
              </AuthLink>
            </Grid>
            <Grid item>
              <AuthLink clickEvent={() => handleAuthModal("password")}>
                비밀번호 재설정
              </AuthLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
