import { usePresetModal } from "@/hooks/usePresetModal";
import { presetModalState } from "@/states";
import { PresetModalState } from "@/types";
import { Box, Modal } from "@mui/material";
import { useRecoilState } from "recoil";
import { ModalContentBox } from "../modal";

export default function PresetModal() {
  const { isPresetModal, offPresetModal } = usePresetModal();

  const [presetModal, setPresetModal] = useRecoilState(presetModalState);

  const handlePresetModal = (path: PresetModalState) => {
    setPresetModal(path);
  };

  const modalData: { [key: string]: JSX.Element } = {};

  return (
    <Box>
      <Modal open={isPresetModal} onClose={offPresetModal}>
        <ModalContentBox>
          {/* {modalData[presetModal]} */}
          프리셋 모달
        </ModalContentBox>
      </Modal>
    </Box>
  );
}
