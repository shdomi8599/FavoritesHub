import PresetItem from "@/components/preset/PresetItem";
import { DashBoardChildProps, Preset } from "@/types";
import {
  AccountCircle as AccountCircleIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  ChevronLeft as ChevronLeftIcon,
  DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { SetterOrUpdater } from "recoil";

interface Props extends DashBoardChildProps {
  setViewPreset: SetterOrUpdater<Preset>;
  addPresetModal: () => void;
  editPresetModal: (id: number) => void;
  deletePresetEvent: (id: number) => void;
  viewPreset: Preset;
  presets: Preset[];
}

export default function DashboardDrawer({
  presets,
  isLogin,
  viewPreset,
  isDashboard,
  logoutEvent,
  setViewPreset,
  addPresetModal,
  editPresetModal,
  handleModalOpen,
  deletePresetEvent,
  handleIsDashboard,
}: Props) {
  return (
    <Drawer variant="permanent" open={isDashboard}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={handleIsDashboard}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ height: "90%", pt: 0 }}>
        <Button
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "5vh",
          }}
          onClick={addPresetModal}
        >
          <AddCircleOutlineIcon />
          {isDashboard && (
            <Typography sx={{ marginLeft: "1px" }}>프리셋 추가</Typography>
          )}
        </Button>
        {presets?.map((preset) => (
          <PresetItem
            key={preset?.id}
            preset={preset}
            viewPreset={viewPreset}
            setViewPreset={setViewPreset}
            editPresetModal={editPresetModal}
            deletePresetEvent={deletePresetEvent}
          />
        ))}
      </List>
      {isDashboard && (
        <>
          <Divider />
          <ToolBarLoginBox>
            {isLogin ? (
              <>
                <DirectionsRunIcon fontSize="large" />
                <span onClick={logoutEvent}>로그아웃</span>
              </>
            ) : (
              <>
                <AccountCircleIcon fontSize="large" />
                <span onClick={handleModalOpen}>회원가입</span>
              </>
            )}
          </ToolBarLoginBox>
        </>
      )}
    </Drawer>
  );
}

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    overflow: "hidden",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const ToolBarLoginBox = styled(Box)(() => ({
  minHeight: "3rem",
  padding: "1rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "0.2rem",
  "& > span": {
    cursor: "pointer",
  },
}));
