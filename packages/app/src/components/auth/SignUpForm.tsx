import { AuthProps, LoginFormInput } from "@/types";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthFormInput from "./AuthFormInput";
import AuthLink from "./AuthLink";

export default function SignUpForm({ handleAuthModal }: AuthProps) {
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
        <Typography component="h1" variant="h5">
          SIGN UP
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <AuthFormInput register={register} name="mail" />
          {isSubmitted && (
            <AlertMessage role="alert">{errors?.mail?.message}</AlertMessage>
          )}
          <AuthFormInput register={register} name="password" />
          <FormControlLabel
            control={<Checkbox value="auto-login" color="primary" />}
            label="자동 로그인"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            로그인
          </Button>
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

const AlertMessage = styled("span")(({}) => ({
  color: "red",
}));

const LinkStyle = {
  cursor: "pointer",
};
