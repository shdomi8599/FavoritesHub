import { usePresetModal } from "@/hooks/usePresetModal";
import { presetModalState } from "@/states";
import { Box, Modal, styled } from "@mui/material";
import { useRecoilState } from "recoil";

export default function PresetModal() {
  const { isPresetModal, offPresetModal } = usePresetModal();

  const [presetModal, setPresetModal] = useRecoilState(presetModalState);

  const handleAuthModal = (path: string) => {
    setPresetModal(path);
  };

  const modalData: { [key: string]: JSX.Element } = {};

  return (
    <Box>
      <Modal open={isPresetModal} onClose={offPresetModal}>
        <ContentBox sx={{ boxShadow: 3 }}>
          {/* {modalData[presetModal]} */}
          프리셋 모달
        </ContentBox>
      </Modal>
    </Box>
  );
}

const ContentBox = styled(Box)(({}) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  minWidth: "300px",
  backgroundColor: "white",
  padding: "1.5rem",
  borderRadius: "4px",
}));
