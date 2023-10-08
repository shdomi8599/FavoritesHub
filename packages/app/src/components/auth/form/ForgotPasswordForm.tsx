import { postUserExist } from "@/api/auth";
import ModalForm from "@/components/common/ModalForm";
import { AuthProps, LoginFormInput } from "@/types";
import { callbackSuccessAlert, errorAlert } from "@/util";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater } from "recoil";
import { AuthButton, AuthFormInput, AuthLink, AuthTitle } from "../common";

interface Props extends AuthProps {
  setIsForgot: SetterOrUpdater<boolean>;
  setUserMail: SetterOrUpdater<string>;
}

export default function ForgotPasswordForm({
  handleAuthModal,
  setIsForgot,
  setUserMail,
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
    const { mail } = data;

    const user = await postUserExist(mail);

    if (!user) {
      return errorAlert("가입되지 않은 이메일입니다.", "이메일 확인");
    }

    setUserMail(mail);
    setIsForgot(true);

    return callbackSuccessAlert(
      "이메일 인증을 부탁드려요.",
      "인증 하러가기",
      alertEvent,
    );
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
        <AuthTitle name="비밀번호 재설정" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <AuthFormInput
            register={register}
            name="mail"
            error={errors?.mail}
            isSubmitted={isSubmitted}
          />
          <AuthButton>이메일 인증</AuthButton>
          <Grid container>
            <Grid item xs>
              <AuthLink clickEvent={() => handleAuthModal("login")}>
                로그인
              </AuthLink>
            </Grid>
            <Grid item>
              <AuthLink clickEvent={() => handleAuthModal("signUp")}>
                회원가입
              </AuthLink>
            </Grid>
          </Grid>
        </ModalForm>
      </Box>
    </Container>
  );
}
