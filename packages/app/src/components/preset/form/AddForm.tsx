import { ModalForm, ModalTitle } from "@/components/modal";
import { PresetProps, updatePasswordFormInput } from "@/types";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props extends PresetProps {}

export default function AddForm({ offPresetModal }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<updatePasswordFormInput>();

  const onSubmit: SubmitHandler<updatePasswordFormInput> = async (data) => {};

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <ModalTitle name="프리셋 추가" />
        </ModalForm>
      </Box>
    </Container>
  );
}
