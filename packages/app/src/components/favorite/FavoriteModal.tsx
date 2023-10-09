import { useAuth } from "@/hooks";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { Box, Modal } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function FavoriteModal() {
  const queryClient = useQueryClient();
  const { userId, accessToken } = useAuth();
  const { isFavoriteModal, offFavoriteModal, favoriteModal } =
    useFavoriteModal();

  const resetPresetList = () => {
    queryClient.invalidateQueries(["favoriteList", userId]);
  };

  const modalData: { [key: string]: JSX.Element } = {
    add: <AddForm />,
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
