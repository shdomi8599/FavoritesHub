import { postPresetAdd } from "@/api/preset";
import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalTitle,
} from "@/components/modal";
import { presetFormOptions } from "@/const";
import { PresetAddFormInput, PresetProps } from "@/types";
import { errorAlert, successAlert } from "@/util";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props extends PresetProps {
  userId: number;
  accessToken: string;
}

export default function AddForm({
  offPresetModal,
  userId,
  accessToken,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<PresetAddFormInput>();

  const onSubmit: SubmitHandler<PresetAddFormInput> = async (data) => {
    const { presetName } = data;

    const { message } = await postPresetAdd(userId, accessToken, presetName);

    if (message === "exist") {
      return errorAlert("이미 존재하는 이름입니다.", "프리셋 추가");
    }

    if (message === "success") {
      offPresetModal();
      successAlert("프리셋이 추가되었습니다.", "프리셋 추가");
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
