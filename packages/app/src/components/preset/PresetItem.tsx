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
        <IconBox
          onClick={(e) => {
            e.stopPropagation();
            editPresetModal(id);
          }}
        >
          <EditIcon />
        </IconBox>
        <IconBox
          onClick={(e) => {
            e.stopPropagation();
            deletePresetEvent(id);
          }}
        >
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

const IconBox = styled(Box)(({}) => ({
  position: "relative",
  "&:hover": {
    "&:before": {
      content: '""',
      position: "absolute",
      left: "-25%",
      top: "-25%",
      background: "#666666",
      transition: "all 0.2s",
      opacity: "0.5",
      padding: "1.2rem",
      borderRadius: "10px",
    },
  },
}));

const itemTextStyle = {
  "& > span": {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};
