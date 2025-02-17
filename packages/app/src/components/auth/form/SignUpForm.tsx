import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalLink,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions, authInputLabel } from "@/const";
import { useRouters } from "@/hooks/common";
import { AuthProps, SignUpFormInput } from "@/types";
import { Box, Container, Grid } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { GoogleLogin } from ".";

interface Props extends AuthProps {
  authSignUp: (data: SignUpFormInput) => Promise<void>;
}

export default function SignUpForm({
  handleAuthModal,
  offAuthModal,
  authSignUp,
}: Props) {
  const { moveLogin } = useRouters();
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

  const onSubmit: SubmitHandler<SignUpFormInput> = async (data) => {
    await authSignUp(data);
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
        <ModalTitle name="회원가입" />
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
          <ModalFormInput
            register={register}
            name="confirmPassword"
            error={errors?.confirmPassword}
            isSubmitted={isSubmitted}
            option={confirmPasswordOption}
            label={authInputLabel["confirmPassword"]}
            type="password"
          />
          <ModalButton>회원가입</ModalButton>
          <GoogleLogin />
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
              <ModalLink clickEvent={() => handleAuthModal("password")}>
                비밀번호 재설정
              </ModalLink>
            </Grid>
          </Grid>
        </ModalForm>
      </Box>
    </Container>
  );
}
