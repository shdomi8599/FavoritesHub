import { useAuth, usePresetModal } from "@/hooks";
import { Box, Modal } from "@mui/material";
import { ModalContentBox } from "../modal";
import { AddForm } from "./form";

export default function PresetModal() {
  const { userId, accessToken } = useAuth();
  const { isPresetModal, offPresetModal, presetModal } = usePresetModal();

  const modalData: { [key: string]: JSX.Element } = {
    add: (
      <AddForm
        offPresetModal={offPresetModal}
        userId={userId}
        accessToken={accessToken}
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
