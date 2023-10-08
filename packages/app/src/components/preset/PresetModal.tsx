import { useAuth, usePresetModal } from "@/hooks";
import { Box, Modal } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { ModalContentBox } from "../modal";
import { AddForm } from "./form";

export default function PresetModal() {
  const queryClient = useQueryClient();
  const { userId, accessToken } = useAuth();
  const { isPresetModal, offPresetModal, presetModal } = usePresetModal();

  const modalData: { [key: string]: JSX.Element } = {
    add: (
      <AddForm
        offPresetModal={offPresetModal}
        userId={userId}
        accessToken={accessToken}
        queryClient={queryClient}
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
