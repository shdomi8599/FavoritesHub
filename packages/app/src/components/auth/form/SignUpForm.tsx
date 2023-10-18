import { postSignUp } from "@/api/auth";
import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalLink,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions, authInputLabel } from "@/const";
import { AuthProps, SignUpFormInput } from "@/types";
import { errorAlert } from "@/util";
import { callbackSuccessAlert } from "@/util/alert";
import { Box, Container, Grid } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

export default function SignUpForm({
  handleAuthModal,
  handleClose,
}: AuthProps) {
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
    const { mail, password } = data;
    const { message } = await postSignUp(mail, password);

    if (message === "exist") {
      return errorAlert("이미 가입된 이메일입니다.", "이메일 확인");
    }

    if (message === "success") {
      callbackSuccessAlert(
        "회원가입을 축하합니다.",
        "로그인 하러가기",
        handleClose,
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
          <Grid container justifyContent={"space-between"}>
            <Grid item>
              <ModalLink clickEvent={handleClose}>로그인</ModalLink>
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
