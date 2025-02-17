import { useAuth } from "@/hooks/data";
import { useFavoriteEvent } from "@/hooks/event";
import { useGuestFavoriteEvent } from "@/hooks/guest";
import { useFavoriteModal } from "@/hooks/modal";
import { isLoadingState } from "@/states";
import { Box, Modal } from "@mui/material";
import { useRecoilValue } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm, ExportForm, ImportForm } from "./form";

export default function FavoriteModal() {
  const isLoading = useRecoilValue(isLoadingState);

  const { isGuest } = useAuth();
  const { isFavoriteModal, offFavoriteModal, favoriteModal } =
    useFavoriteModal();
  const { favoriteAdd, favoriteEdit, favoriteExport, favoriteImport } =
    useFavoriteEvent();
  const { favoriteAddGuest, favoriteEditGuest, favoriteImportGuest } =
    useGuestFavoriteEvent();

  const modalData = {
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
    import: (
      <ImportForm
        isLoading={isLoading}
        favoriteImport={isGuest ? favoriteImportGuest : favoriteImport}
      />
    ),
    export: (
      <ExportForm isLoading={isLoading} favoriteExport={favoriteExport} />
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
