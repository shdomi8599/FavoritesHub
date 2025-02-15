import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalTitle,
} from "@/components/modal";
import { presetFormOptions } from "@/const";
import { guideStepState, isGuideModalState } from "@/states";
import { PresetAddFormInput } from "@/types";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface Props {
  presetAdd: (presetName: string) => void;
  isLoading: boolean;
}

export default function AddForm({ presetAdd, isLoading }: Props) {
  const isGuideModal = useRecoilValue(isGuideModalState);
  const setGuideStep = useSetRecoilState(guideStepState);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<PresetAddFormInput>();

  const onSubmit: SubmitHandler<PresetAddFormInput> = (data) => {
    if (isGuideModal) {
      setGuideStep(2);
    }
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
          <ModalButton disabled={isLoading}>추가하기</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
