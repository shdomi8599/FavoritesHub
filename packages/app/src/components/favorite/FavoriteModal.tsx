import { useAuth, useFavoriteEvent } from "@/hooks";
import { useGuestFavoriteEvent } from "@/hooks/guest/useGuestFavoriteEvent";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { isLoadingState } from "@/states";
import { Box, Modal } from "@mui/material";
import { useRecoilValue } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function FavoriteModal() {
  const isLoading = useRecoilValue(isLoadingState);

  const { isGuest } = useAuth();
  const { isFavoriteModal, offFavoriteModal, favoriteModal } =
    useFavoriteModal();
  const { favoriteAdd, favoriteEdit } = useFavoriteEvent();
  const { favoriteAddGuest, favoriteEditGuest } = useGuestFavoriteEvent();

  const modalData: { [key: string]: JSX.Element } = {
    add: (
      <AddForm
        favoriteAdd={isGuest ? favoriteAddGuest : favoriteAdd}
        isLoading={isLoading}
      />
    ),
    edit: (
      <EditForm
        favoriteEdit={isGuest ? favoriteEditGuest : favoriteEdit}
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
