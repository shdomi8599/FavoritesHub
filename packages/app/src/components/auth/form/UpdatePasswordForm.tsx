import { putUpdatePassword } from "@/api/auth";
import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions, authInputLabel } from "@/const";
import { userMailState } from "@/states";
import { updatePasswordFormInput } from "@/types";
import { successAlert } from "@/util";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater, useRecoilValue } from "recoil";

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
          <ModalButton>재설정</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
