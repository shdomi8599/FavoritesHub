import { mainBlueColor, mainRedColor } from "@/const";
import { isPresetEventState } from "@/states";
import { Preset } from "@/types";
import {
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  styled,
} from "@mui/material";
import { useEffect } from "react";
import { SetterOrUpdater, useSetRecoilState } from "recoil";

interface Props {
  preset: Preset;
  viewPreset: Preset;
  setViewPreset: SetterOrUpdater<Preset>;
  editPresetModal: (id: number) => void;
  deletePresetEvent: (id: number) => void;
}

export default function PresetItem({
  preset,
  viewPreset,
  setViewPreset,
  editPresetModal,
  deletePresetEvent,
}: Props) {
  const { presetName, id, defaultPreset } = preset;
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);
  useEffect(() => {
    setIsPresetEvent(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ListItemButton onClick={() => setViewPreset(preset)}>
      <ListItemIcon>
        <DashboardIcon
          sx={{
            color:
              viewPreset?.id === id
                ? mainBlueColor
                : defaultPreset
                ? mainRedColor
                : "",
          }}
        />
      </ListItemIcon>
      <Tooltip title={presetName}>
        <ListItemText sx={itemTextStyle} primary={presetName} />
      </Tooltip>
      <IconContainer>
        <IconButton onClick={() => editPresetModal(id)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => deletePresetEvent(id)}>
          <DeleteIcon />
        </IconButton>
      </IconContainer>
    </ListItemButton>
  );
}

const IconContainer = styled(Box)(({}) => ({
  display: "flex",
}));

const itemTextStyle = {
  "& > span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
