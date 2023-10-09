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
  styled,
} from "@mui/material";
import { SetterOrUpdater } from "recoil";

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
  const { presetName, id } = preset;
  return (
    <ListItemButton onClick={() => setViewPreset(preset)}>
      <ListItemIcon>
        <DashboardIcon sx={{ color: viewPreset?.id === id ? "#1976d2" : "" }} />
      </ListItemIcon>
      <ListItemText sx={itemTextStyle} primary={presetName} />
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
