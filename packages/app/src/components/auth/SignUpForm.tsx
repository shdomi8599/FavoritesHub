import { ApiResultMessage, AuthProps, SignUpFormInput } from "@/types";
import { api, errorAlert } from "@/util";
import { callbackSuccessAlert } from "@/util/alert";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthAlertMessage from "./AuthAlertMessage";
import AuthButton from "./AuthButton";
import AuthFormInput from "./AuthFormInput";
import AuthLink from "./AuthLink";
import AuthTitle from "./AuthTitle";

export default function SignUpForm({ handleAuthModal }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
  } = useForm<SignUpFormInput>();

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
          <TextField
            margin="normal"
            required
            fullWidth
            {...register("confirmPassword", {
              required: true,
              validate: (value) =>
                value === getValues("password") ||
                "입력하신 비밀번호와 일치하지 않습니다.",
            })}
            label={"비밀번호 확인"}
            type="password"
          />
          {isSubmitted && errors.confirmPassword && (
            <AuthAlertMessage error={errors.confirmPassword} />
          )}
          <AuthButton name="signUp" />
          <Grid container>
            <Grid item xs>
              <AuthLink handleAuthModal={handleAuthModal} linkName="login" />
            </Grid>
            <Grid item>
              <AuthLink handleAuthModal={handleAuthModal} linkName="password" />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
