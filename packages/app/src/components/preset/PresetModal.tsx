import { usePresetEvent, usePresetModal } from "@/hooks";
import { Box, Modal } from "@mui/material";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function PresetModal() {
  const { isPresetModal, offPresetModal, presetModal } = usePresetModal();
  const { isLoading, presetAdd, presetEdit } = usePresetEvent();

  const modalData: { [key: string]: JSX.Element } = {
    add: <AddForm presetAdd={presetAdd} isLoading={isLoading} />,
    edit: <EditForm presetEdit={presetEdit} isLoading={isLoading} />,
  };

  return (
    <Box>
      <Modal open={isPresetModal} onClose={offPresetModal}>
        <ModalContentBox>{modalData[presetModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
