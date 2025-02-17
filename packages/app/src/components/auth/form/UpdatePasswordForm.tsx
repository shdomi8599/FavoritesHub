import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalTitle,
} from "@/components/modal";
import { authFormOptions, authInputLabel } from "@/const";
import { updatePasswordFormInput } from "@/types";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  authUpdatePassword: (data: updatePasswordFormInput) => Promise<void>;
}

export default function UpdatePasswordForm({ authUpdatePassword }: Props) {
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
    await authUpdatePassword(data);
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
