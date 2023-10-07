import { AuthProps, LoginFormInput } from "@/types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthButton from "./AuthButton";
import AuthFormInput from "./AuthFormInput";
import AuthLink from "./AuthLink";
import AuthTitle from "./AuthTitle";

export default function PasswordForm({ handleAuthModal }: AuthProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormInput>();
  const onSubmit: SubmitHandler<LoginFormInput> = (data) => console.log(data);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <AuthTitle name="비밀번호 찾기" />
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
          <AuthButton name="password" />
          <Grid container>
            <Grid item xs>
              <AuthLink handleAuthModal={handleAuthModal} linkName="login" />
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
