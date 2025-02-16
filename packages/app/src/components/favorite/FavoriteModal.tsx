import { postFavoriteAdd, putFavoriteEdit } from "@/api/favorite";
import { guestFavoriteAdd, guestFavoriteEdit } from "@/guest/favorite";
import { useAuth } from "@/hooks";
import { useResetQuery } from "@/hooks/react-query";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { guestFavoritesState, selectedFavoriteIdState } from "@/states";
import { Favorite } from "@/types";
import { errorAlert, getLocalStorageItem, successAlert } from "@/util";
import { Box, Modal } from "@mui/material";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function FavoriteModal() {
  const { accessToken, isGuest } = useAuth();
  const [isLoading, setIsLoding] = useState(false);
  const setGuestFavorites = useSetRecoilState(guestFavoritesState);
  const selectedFavoriteId = useRecoilValue(selectedFavoriteIdState);
  const { viewPreset, isFavoriteModal, offFavoriteModal, favoriteModal } =
    useFavoriteModal();

  const { resetFavoriteList } = useResetQuery();

  const guestFavoriteAddEvent = async (
    favoriteName: string,
    address: string,
  ) => {
    await guestFavoriteAdd(favoriteName, address);

    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);

    offFavoriteModal();
    successAlert("즐겨찾기가 추가되었습니다.", "즐겨찾기 추가");
  };

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
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoding(false);
    }
  };

  const guestFavoriteEditEvent = async (favoriteName: string) => {
    await guestFavoriteEdit(favoriteName, selectedFavoriteId);

    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);

    offFavoriteModal();
    successAlert("즐겨찾기가 수정되었습니다.", "즐겨찾기 수정");
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
    } catch (e: any) {
      if (e?.code === 401) {
        location.reload();
      }
    } finally {
      setIsLoding(false);
    }
  };

  const modalData: { [key: string]: JSX.Element } = {
    add: (
      <AddForm
        favoriteAdd={isGuest ? guestFavoriteAddEvent : favoriteAdd}
        isLoading={isLoading}
      />
    ),
    edit: (
      <EditForm
        favoriteEdit={isGuest ? guestFavoriteEditEvent : favoriteEdit}
        isLoading={isLoading}
      />
    ),
  };

  return (
    <Box>
      <Modal open={isFavoriteModal} onClose={offFavoriteModal}>
        <ModalContentBox>{modalData[favoriteModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
