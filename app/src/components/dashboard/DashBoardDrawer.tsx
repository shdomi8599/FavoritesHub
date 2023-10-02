import { navItems } from "@/const";
import {
  AccountCircle as AccountCircleIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import {
  Box,
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

type Props = {
  toolBarOpen: boolean;
  handleDrawer: () => void;
  handlePage: (route: string) => void;
  isLogin: boolean;
  handleOpen: () => void;
};

export default function DashBoardDrawer({
  toolBarOpen,
  handleDrawer,
  handleOpen,
  handlePage,
  isLogin,
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
      <List component="nav" sx={{ height: "90%" }}>
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
              <></>
            ) : (
              <>
                <AccountCircleIcon fontSize="large" />
                <span onClick={handleOpen}>Login</span>
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
