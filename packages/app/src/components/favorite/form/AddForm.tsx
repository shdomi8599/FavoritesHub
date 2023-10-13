import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalTitle,
} from "@/components/modal";
import { favoriteFormOptions } from "@/const";
import { FavoriteAddFormInput } from "@/types";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";

interface Props {
  favoriteAdd: (favoriteName: string, address: string) => void;
  isLoading: boolean;
}

export default function AddForm({ favoriteAdd, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FavoriteAddFormInput>();

  const onSubmit: SubmitHandler<FavoriteAddFormInput> = (data) => {
    const { favoriteName, address } = data;
    favoriteAdd(favoriteName, address);
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
        <ModalTitle name="즐겨찾기 추가" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <ModalFormInput
            label={"별칭"}
            required={false}
            name="favoriteName"
            register={register}
            isSubmitted={isSubmitted}
            error={errors?.favoriteName}
            option={favoriteFormOptions["favoriteName"]}
          />
          <ModalFormInput
            label={"주소"}
            name="address"
            autoFocus={true}
            register={register}
            error={errors?.address}
            isSubmitted={isSubmitted}
            option={favoriteFormOptions["address"]}
          />
          <ModalButton disabled={isLoading}>추가하기</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
