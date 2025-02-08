import {
  ModalButton,
  ModalForm,
  ModalFormInput,
  ModalTitle,
} from "@/components/modal";
import { favoriteEditOptions } from "@/const";
import { selectedFavoriteNameState } from "@/states";
import { FavoriteEditFormInput } from "@/types";
import { Box, Container } from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";

interface Props {
  favoriteEdit: (favoriteName: string) => Promise<void>;
  isLoading: boolean;
}

export default function EditForm({ favoriteEdit, isLoading }: Props) {
  const selectedFavoriteName = useRecoilValue(selectedFavoriteNameState);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<FavoriteEditFormInput>();

  const onSubmit: SubmitHandler<FavoriteEditFormInput> = async (data) => {
    const { favoriteName } = data;
    await favoriteEdit(favoriteName);
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
        <ModalTitle name="별칭 수정" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <ModalFormInput
            register={register}
            name="favoriteName"
            error={errors?.favoriteName}
            isSubmitted={isSubmitted}
            option={favoriteEditOptions["favoriteName"]}
            label={"별칭 수정"}
            autoFocus={true}
            defaultValue={selectedFavoriteName}
          />
          <ModalButton disabled={isLoading}>수정하기</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
