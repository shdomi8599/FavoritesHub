import { postAuthLogin, postUserExist } from "@/api/auth";
import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalLink,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions, authInputLabel } from "@/const";
import { useHandler } from "@/hooks";
import { isPasswordForgotState } from "@/states";
import { AuthModalState, LoginFormInput } from "@/types";
import { callbackSuccessAlert, errorAlert } from "@/util";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater, useSetRecoilState } from "recoil";

interface Props {
  openAuthModal: () => void;
  handleAuthModal: (path: AuthModalState) => void;
  setAccessToken: SetterOrUpdater<string>;
  setUserId: SetterOrUpdater<number>;
  setUserMail: SetterOrUpdater<string>;
}

export default function LoginForm({
  openAuthModal,
  handleAuthModal,
  setAccessToken,
  setUserId,
  setUserMail,
}: Props) {
  const { isBoolean: isRefreshToken, handleBoolean: handleRefreshToken } =
    useHandler(false);
  const setIsForgot = useSetRecoilState(isPasswordForgotState);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<LoginFormInput>();

  const passwordEvent = () => {
    handleAuthModal("password");
    openAuthModal();
  };

  const signUpEvent = () => {
    handleAuthModal("signUp");
    openAuthModal();
  };

  const alertEvent = () => {
    handleAuthModal("verify");
    openAuthModal();
  };

  const onSubmit: SubmitHandler<LoginFormInput> = async (data) => {
    const { mail, password } = data;

    const user = await postUserExist(mail);

    if (!user) {
      return errorAlert("가입되지 않은 이메일입니다.", "이메일 확인");
    }

    const { accessToken, message, userId } = await postAuthLogin(
      mail,
      password,
      isRefreshToken,
    );

    if (message === "not exact") {
      return errorAlert("비밀번호가 일치하지 않습니다.", "비밀번호 확인");
    }

    setUserMail(mail);

    if (message === "not verify") {
      return callbackSuccessAlert(
        "이메일 인증을 부탁드려요.",
        "인증 하러가기",
        alertEvent,
      );
    }

    setUserId(userId);
    setAccessToken(accessToken!);
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
        <ModalTitle name="로그인" />
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
          <ModalFormInput
            register={register}
            name="password"
            error={errors?.password}
            isSubmitted={isSubmitted}
            option={authFormOptions["password"]}
            label={authInputLabel["password"]}
            type="password"
          />
          <FormControlLabel
            control={
              <Checkbox
                onClick={handleRefreshToken}
                value="auto-login"
                color="primary"
              />
            }
            label="자동 로그인"
          />
          <ModalButton>로그인</ModalButton>
          <Grid container>
            <Grid item xs>
              <ModalLink clickEvent={passwordEvent}>비밀번호 재설정</ModalLink>
            </Grid>
            <Grid item>
              <ModalLink clickEvent={signUpEvent}>회원가입</ModalLink>
            </Grid>
          </Grid>
        </ModalForm>
      </Box>
    </Container>
  );
}
