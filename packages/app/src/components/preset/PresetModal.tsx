import { useAuth, usePresetEvent, usePresetModal } from "@/hooks";
import { useResetQuery } from "@/hooks/react-query";
import { selectedPresetIdState } from "@/states";
import { Box, Modal } from "@mui/material";
import { useRecoilValue } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function PresetModal() {
  const { userId, accessToken, isGuest } = useAuth();
  const selectedPresetId = useRecoilValue(selectedPresetIdState);
  const { isPresetModal, offPresetModal, presetModal } = usePresetModal();

  const { resetPresetList } = useResetQuery(userId);

  const { isLoding, presetAdd, presetEdit } = usePresetEvent({
    isGuest,
    accessToken,
    selectedPresetId,
    resetPresetList,
    offPresetModal,
  });

  const modalData: { [key: string]: JSX.Element } = {
    add: <AddForm presetAdd={presetAdd} isLoding={isLoding} />,
    edit: <EditForm presetEdit={presetEdit} isLoding={isLoding} />,
  };

  return (
    <Box>
      <Modal open={isPresetModal} onClose={offPresetModal}>
        <ModalContentBox>{modalData[presetModal]}</ModalContentBox>
      </Modal>
    </Box>
  );
}
