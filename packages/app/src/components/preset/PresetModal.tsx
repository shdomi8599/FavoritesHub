import { usePresetModal } from "@/hooks";
import { presetModalState } from "@/states";
import { PresetModalState } from "@/types";
import { Box, Modal } from "@mui/material";
import { useRecoilState } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm } from "./form";

export default function PresetModal() {
  const { isPresetModal, offPresetModal } = usePresetModal();

  const [presetModal, setPresetModal] = useRecoilState(presetModalState);

  const handlePresetModal = (path: PresetModalState) => {
    setPresetModal(path);
  };

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
