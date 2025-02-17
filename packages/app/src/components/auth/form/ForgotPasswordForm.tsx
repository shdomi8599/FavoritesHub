import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalLink,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions, authInputLabel } from "@/const";
import { useRouters } from "@/hooks/useRouters";
import { AuthProps, LoginFormInput } from "@/types";
import { Box, Container, Grid } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props extends AuthProps {
  authForgotPassword: (data: LoginFormInput) => Promise<void>;
}

export default function ForgotPasswordForm({
  handleAuthModal,
  offAuthModal,
  authForgotPassword,
}: Props) {
  const { moveLogin } = useRouters();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormInput>();

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    await authForgotPassword(data);
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
        <ModalTitle name="비밀번호 재설정" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <ModalFormInput
            register={register}
            name="mail"
            error={errors?.mail}
            isSubmitted={isSubmitted}
            option={authFormOptions["mail"]}
            label={authInputLabel["mail"]}
            autoFocus={true}
            type="email"
          />
          <ModalButton>이메일 인증</ModalButton>
          <Grid container justifyContent={"space-between"}>
            <Grid item>
              <ModalLink
                clickEvent={() => {
                  offAuthModal();
                  moveLogin();
                }}
              >
                로그인
              </ModalLink>
            </Grid>
            <Grid item>
              <ModalLink clickEvent={() => handleAuthModal("signUp")}>
                회원가입
              </ModalLink>
            </Grid>
          </Grid>
        </ModalForm>
      </Box>
    </Container>
  );
}
