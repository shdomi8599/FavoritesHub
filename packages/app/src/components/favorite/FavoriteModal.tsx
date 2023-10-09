import { postFavoriteAdd } from "@/api/favorite";
import { useAuth } from "@/hooks";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { errorAlert, successAlert } from "@/util";
import { Box, Modal } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function FavoriteModal() {
  const queryClient = useQueryClient();
  const { userId, accessToken } = useAuth();
  const { viewPreset, isFavoriteModal, offFavoriteModal, favoriteModal } =
    useFavoriteModal();

  const resetFavoriteList = () => {
    queryClient.invalidateQueries(["favoriteList", userId, viewPreset?.id]);
  };

  const favoriteAdd = async (favoriteName: string, address: string) => {
    const { message } = await postFavoriteAdd(
      viewPreset?.id,
      favoriteName,
      address,
      accessToken,
    );

    if (message === "not exact") {
      return errorAlert("도메인이 유효하지 않습니다.", "즐겨찾기 추가");
    }

    if (message === "cors") {
      return errorAlert(
        "주소 오류로 인해 등록할 수 없습니다.",
        "즐겨찾기 추가",
      );
    }

    if (message === "success") {
      resetFavoriteList();
      offFavoriteModal();
      successAlert("즐겨찾기가 추가되었습니다.", "즐겨찾기 추가");
    }
  };

  const modalData: { [key: string]: JSX.Element } = {
    add: <AddForm favoriteAdd={favoriteAdd} />,
    edit: <EditForm />,
  };

  return (
    <Box>
      <Modal open={isFavoriteModal} onClose={offFavoriteModal}>
        <ModalContentBox>{modalData[favoriteModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
