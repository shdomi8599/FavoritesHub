import { Preset } from "@/types";
import {
  Dashboard as DashboardIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import { SetterOrUpdater } from "recoil";
import IconBox from "../icon/IconBox";

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
        <IconBox clickEvent={() => editPresetModal(id)}>
          <EditIcon />
        </IconBox>
        <IconBox clickEvent={() => deletePresetEvent(id)}>
          <DeleteIcon />
        </IconBox>
      </IconContainer>
    </ListItemButton>
  );
}

const IconContainer = styled(Box)(({}) => ({
  display: "flex",
  gap: "0.9rem",
}));

const itemTextStyle = {
  "& > span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
