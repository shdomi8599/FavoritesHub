import { usePresetModal } from "@/hooks";
import { Box, Modal } from "@mui/material";
import { ModalContentBox } from "../modal";
import { AddForm } from "./form";

export default function PresetModal() {
  const { isPresetModal, offPresetModal, handlePresetModal, presetModal } =
    usePresetModal();

  const modalData: { [key: string]: JSX.Element } = {
    add: <AddForm offPresetModal={offPresetModal} />,
  };

  return (
    <Box>
      <Modal open={isPresetModal} onClose={offPresetModal}>
        <ModalContentBox>{modalData[presetModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
