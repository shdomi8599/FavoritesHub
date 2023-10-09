import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalTitle,
} from "@/components/modal";
import { presetFormOptions } from "@/const";
import { PresetAddFormInput } from "@/types";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  presetAdd: (presetName: string) => void;
}

export default function AddForm({ presetAdd }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<PresetAddFormInput>();

  const onSubmit: SubmitHandler<PresetAddFormInput> = (data) => {
    const { presetName } = data;
    presetAdd(presetName);
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
        <ModalTitle name="프리셋 추가" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <ModalFormInput
            register={register}
            name="presetName"
            error={errors?.presetName}
            isSubmitted={isSubmitted}
            option={presetFormOptions["presetName"]}
            label={"프리셋 추가"}
            autoFocus={true}
          />
          <ModalButton>추가하기</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
