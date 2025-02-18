import { mainBlueColor } from "@/const";
import { useDashboard } from "@/hooks/common";
import { useAuth } from "@/hooks/data";
import { useFavoriteEvent, usePresetEvent } from "@/hooks/event";
import { useGuestPresetEvent } from "@/hooks/guest";
import { usePresetModal } from "@/hooks/modal";
import {
  dragFavoriteIdState,
  dragFavoriteItemState,
  isPresetEventState,
  viewPresetState,
} from "@/states";
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

interface Props {
  preset: Preset;
}

export default function PresetItem({ preset }: Props) {
  const { isGuest } = useAuth();
  const { presetName, id } = preset;
  const { isDashboard } = useDashboard();
  const { presetDelete } = usePresetEvent();
  const { editPresetModal } = usePresetModal();
  const { favoriteTransfer } = useFavoriteEvent();
  const { favoriteRelocation } = useFavoriteEvent();
  const { presetDeleteGuest } = useGuestPresetEvent();

  const setIsPresetEvent = useSetRecoilState(isPresetEventState);
  const [viewPreset, setViewPreset] = useRecoilState(viewPresetState);
  const dragFavoriteItem = useRecoilValue(dragFavoriteItemState);
  const dragFavoriteId = useRecoilValue(dragFavoriteIdState);
  const isViewPreset = viewPreset?.id === id;

  const handleViewPreset = async () => {
    await favoriteRelocation();
    setViewPreset(preset);
  };

  const mouseMoveEvent = async () => {
    if (isViewPreset) {
      return;
    }
    if (!dragFavoriteItem && dragFavoriteId) {
      await favoriteTransfer(id);
    }
  };

  useEffect(() => {
    setIsPresetEvent(false);
  }, [preset]);

  return (
    <ListItemButton
      onMouseMove={mouseMoveEvent}
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
      {isDashboard && (
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
      )}
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
