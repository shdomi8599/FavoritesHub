import { useAuth } from "@/hooks/data";
import { usePresetEvent } from "@/hooks/event";
import { useGuestPresetEvent } from "@/hooks/guest";
import { usePresetModal } from "@/hooks/modal";
import { isLoadingState } from "@/states";
import { Box, Modal } from "@mui/material";
import { useRecoilValue } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function PresetModal() {
  const isLoading = useRecoilValue(isLoadingState);

  const { isGuest } = useAuth();
  const { presetAdd, presetEdit } = usePresetEvent();
  const { presetAddGuest, presetEditGuest } = useGuestPresetEvent();
  const { isPresetModal, offPresetModal, presetModal } = usePresetModal();

  const modalData = {
    add: (
      <AddForm
        presetAdd={isGuest ? presetAddGuest : presetAdd}
        isLoading={isLoading}
      />
    ),
    edit: (
      <EditForm
        presetEdit={isGuest ? presetEditGuest : presetEdit}
        isLoading={isLoading}
      />
    ),
  };

  return (
    <Box>
      <Modal open={isPresetModal} onClose={offPresetModal}>
        <ModalContentBox>{modalData[presetModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
