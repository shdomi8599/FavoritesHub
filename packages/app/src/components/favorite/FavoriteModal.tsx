import { postFavoriteAdd, putFavoriteEdit } from "@/api/favorite";
import { useAuth } from "@/hooks";
import { useResetQuery } from "@/hooks/react-query";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { selectedFavoriteIdState } from "@/states";
import { errorAlert, successAlert } from "@/util";
import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function FavoriteModal() {
  const { userId, accessToken } = useAuth();
  const [isLoading, setIsLoding] = useState(false);
  const selectedFavoriteId = useRecoilValue(selectedFavoriteIdState);
  const { viewPreset, isFavoriteModal, offFavoriteModal, favoriteModal } =
    useFavoriteModal();

  const { resetFavoriteList } = useResetQuery(userId);

  const favoriteAdd = async (favoriteName: string, address: string) => {
    try {
      setIsLoding(true);
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

      if (message === "exist") {
        return errorAlert("이미 존재하는 주소입니다.", "즐겨찾기 추가");
      }

      if (message === "success") {
        resetFavoriteList(viewPreset?.id);
        offFavoriteModal();
        successAlert("즐겨찾기가 추가되었습니다.", "즐겨찾기 추가");
      }
    } finally {
      setIsLoding(false);
    }
  };

  const favoriteEdit = async (favoriteName: string) => {
    try {
      setIsLoding(true);
      await putFavoriteEdit(selectedFavoriteId, accessToken, favoriteName);

      resetFavoriteList(viewPreset?.id);
      offFavoriteModal();
      successAlert(
        "즐겨찾기 별칭 수정이 완료되었습니다.",
        "즐겨찾기 별칭 수정",
      );
    } finally {
      setIsLoding(false);
    }
  };

  const modalData: { [key: string]: JSX.Element } = {
    add: <AddForm favoriteAdd={favoriteAdd} isLoading={isLoading} />,
    edit: <EditForm favoriteEdit={favoriteEdit} isLoading={isLoading} />,
  };

  return (
    <Box>
      <Modal open={isFavoriteModal} onClose={offFavoriteModal}>
        <ModalContentBox>{modalData[favoriteModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
