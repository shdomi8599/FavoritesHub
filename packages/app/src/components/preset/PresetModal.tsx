import { useAuth, usePresetEvent, usePresetModal } from "@/hooks";
import { selectedPresetIdState } from "@/states";
import { Box, Modal } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { ModalContentBox } from "../modal";
import { AddForm, EditForm } from "./form";

export default function PresetModal() {
  const queryClient = useQueryClient();
  const { userId, accessToken } = useAuth();
  const selectedPresetId = useRecoilValue(selectedPresetIdState);
  const { isPresetModal, offPresetModal, presetModal } = usePresetModal();

  const resetPresetList = async () => {
    return await queryClient.invalidateQueries(["presetList", userId]);
  };

  const { isLoding, presetAdd, presetEdit } = usePresetEvent({
    userId,
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
