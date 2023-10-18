import { postUserExist } from "@/api/auth";
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
import { callbackSuccessAlert, errorAlert } from "@/util";
import { Box, Container, Grid } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater } from "recoil";

interface Props extends AuthProps {
  setIsForgot: SetterOrUpdater<boolean>;
  setUserMail: SetterOrUpdater<string>;
}

export default function ForgotPasswordForm({
  handleAuthModal,
  setIsForgot,
  setUserMail,
  handleClose,
}: Props) {
  const { moveLogin } = useRouters();
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
                  handleClose();
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
