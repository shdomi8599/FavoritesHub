import { putUpdatePassword } from "@/api/auth";
import { ModalButton, ModalTitle } from "@/components/modal";
import ModalForm from "@/components/modal/ModalForm";
import { userMailState } from "@/states";
import { updatePasswordFormInput } from "@/types";
import { successAlert } from "@/util";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import { AuthFormInput } from "../common";

interface Props {
  handleClose: () => void;
  setUserMail: SetterOrUpdater<string>;
}

export default function UpdatePasswordForm({
  handleClose,
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
    const { message } = await putUpdatePassword(userMail, password);

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
        <ModalTitle name="비밀번호 재설정" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <AuthFormInput
            register={register}
            name="password"
            error={errors?.password}
            isSubmitted={isSubmitted}
          />
          <AuthFormInput
            register={register}
            name="confirmPassword"
            error={errors?.confirmPassword}
            isSubmitted={isSubmitted}
            option={confirmPasswordOption}
          />
          <ModalButton>재설정</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
