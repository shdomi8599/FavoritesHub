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

interface Props extends DashBoardChildProps {
  addPresetModal: () => void;
  editPresetModal: (id: number) => void;
  deletePresetEvent: (id: number) => void;
  presets: Preset[];
}

export default function DashboardDrawer({
  toolBarOpen,
  handleDrawer,
  handleModalOpen,
  isLogin,
  logoutEvent,
  addPresetModal,
  editPresetModal,
  presets,
  deletePresetEvent,
}: Props) {
  return (
    <Drawer variant="permanent" open={toolBarOpen}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={handleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav" sx={{ height: "90%", pt: 0 }}>
        {isLogin ? (
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
            {toolBarOpen && (
              <Typography sx={{ marginLeft: "1px" }}>
                프리셋 추가하기
              </Typography>
            )}
          </Button>
        ) : (
          toolBarOpen && (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                pt: 1,
              }}
            >
              <Typography>로그인이 필요합니다.</Typography>
            </Box>
          )
        )}
        {presets?.map((preset) => (
          <PresetItem
            key={preset.id}
            preset={preset}
            editPresetModal={editPresetModal}
            deletePresetEvent={deletePresetEvent}
          />
        ))}
      </List>
      {toolBarOpen && (
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
                <span onClick={handleModalOpen}>로그인</span>
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
