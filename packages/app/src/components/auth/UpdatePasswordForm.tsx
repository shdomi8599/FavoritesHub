import { userMailState } from "@/states";
import { ApiResultMessage, updatePasswordFormInput } from "@/types";
import { successAlert } from "@/util";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { AxiosInstance } from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import AuthButton from "./AuthButton";
import AuthFormInput from "./AuthFormInput";
import AuthTitle from "./AuthTitle";

interface Props {
  handleClose: () => void;
  api: AxiosInstance;
  setUserMail: SetterOrUpdater<string>;
}

export default function UpdatePasswordForm({
  handleClose,
  api,
  setUserMail,
}: Props) {
  const userMail = useRecoilValue(userMailState);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    getValues,
  } = useForm<updatePasswordFormInput>();

  const confirmPasswordOption = {
    required: true,
    validate: (value: string) =>
      value === getValues("password") ||
      "입력하신 비밀번호와 일치하지 않습니다.",
  };

  const onSubmit: SubmitHandler<updatePasswordFormInput> = async (data) => {
    const { password } = data;
    const { message } = await api
      .put<ApiResultMessage>("/user", { userMail, newPassword: password })
      .then((res) => res.data);

    if (message === "success") {
      setUserMail("");
      handleClose();
      successAlert("재설정이 완료되었습니다.", "비밀번호 재설정");
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
        <AuthTitle name="비밀번호 재설정" />
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: "90%" }}
        >
          <AuthFormInput
            register={register}
            name="password"
            error={errors?.password}
            isSubmitted={isSubmitted}
          />
          <AuthFormInput
            register={register}
            name="confirmPassword"
            error={errors?.password}
            isSubmitted={isSubmitted}
            option={confirmPasswordOption}
          />
          <AuthButton>재설정</AuthButton>
        </Box>
      </Box>
    </Container>
  );
}
