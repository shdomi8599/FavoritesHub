import { navItems } from "@/const";
import { DashBoardChildProps } from "@/types";
import {
  AccountCircle as AccountCircleIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  DirectionsRun as DirectionsRunIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props extends DashBoardChildProps {
  handlePage: (route: string) => void;
  addPresetModal: () => void;
}

export default function DashboardDrawer({
  toolBarOpen,
  handleDrawer,
  handleModalOpen,
  handlePage,
  isLogin,
  logoutEvent,
  addPresetModal,
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
        {toolBarOpen && (
          <Button
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              padding: "12px",
            }}
            onClick={addPresetModal}
          >
            <AddCircleOutlineIcon />
            프리셋 추가하기
          </Button>
        )}
        {navItems.map(({ name, route }) => (
          <ListItemButton onClick={() => handlePage(route)} key={name}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
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
