import { AuthProps, PostSignUpMessage, SignUpFormInput } from "@/types";
import { api } from "@/util";
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

  const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    const { mail, password } = data;
    const { message } = await api
      .post<PostSignUpMessage>("/user", { mail, password })
      .then((res) => res.data);

    if (message === "success") {
      handleAuthModal("congrats");
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
