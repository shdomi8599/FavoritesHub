import { mainBlueColor } from "@/const";
import {
  useAuth,
  useFavoriteEvent,
  usePresetEvent,
  usePresetModal,
} from "@/hooks";
import { useGuestPresetEvent } from "@/hooks/guest/useGuestPresetEvent";
import { useDashboard } from "@/hooks/useDashboard";
import { isPresetEventState, viewPresetState } from "@/states";
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
import { useRecoilState, useSetRecoilState } from "recoil";

interface Props {
  preset: Preset;
}

export default function PresetItem({ preset }: Props) {
  const { isGuest } = useAuth();
  const { presetName, id } = preset;
  const { isDashboard } = useDashboard();
  const { presetDelete } = usePresetEvent();
  const { presetDeleteGuest } = useGuestPresetEvent();
  const { editPresetModal } = usePresetModal();
  const { favoriteRelocation } = useFavoriteEvent();

  const [viewPreset, setViewPreset] = useRecoilState(viewPresetState);
  const setIsPresetEvent = useSetRecoilState(isPresetEventState);

  const handleViewPreset = async () => {
    await favoriteRelocation();
    setViewPreset(preset);
  };

  useEffect(() => {
    setIsPresetEvent(false);
  }, [preset]);

  return (
    <ListItemButton
      onClick={handleViewPreset}
      sx={{
        padding: "8px 0px",
        ...(isDashboard && {
          padding: "8px",
        }),
      }}
    >
      <ListItemIcon
        sx={{
          padding: "8px 16px",
          ...(!isDashboard && {
            justifyContent: "center",
            width: "100%",
          }),
        }}
      >
        <DashboardIcon
          sx={{
            color: viewPreset?.id === id ? mainBlueColor : "",
          }}
        />
      </ListItemIcon>
      <Tooltip title={presetName}>
        <ListItemText sx={itemTextStyle} primary={presetName} />
      </Tooltip>
      <IconContainer>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            editPresetModal(id);
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            if (isGuest) {
              presetDeleteGuest(id);
              return;
            }
            presetDelete(id);
          }}
        >
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
