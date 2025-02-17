import Blind from "@/components/blind/Blind";
import { useAuth, useAuthModal, usePresetModal } from "@/hooks";
import { useDashboard } from "@/hooks/useDashboard";
import { useRouters } from "@/hooks/useRouters";
import { guideStepState, isGuideModalState } from "@/states";
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
  Tooltip,
  tooltipClasses,
  TooltipProps,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import DraggablePresetList from "./DraggablePresetList";

interface Props extends DashBoardChildProps {
  presets: Preset[];
}

export default function DashboardDrawer({ presets, logoutEvent }: Props) {
  const guideStep = useRecoilValue(guideStepState);
  const isGuideModal = useRecoilValue(isGuideModalState);

  const { isLogin } = useAuth();
  const { addPresetModal } = usePresetModal();
  const { handleSignUpModal } = useAuthModal();
  const { pathname, moveGuest, moveLogin } = useRouters();
  const { isDashboard, handleIsDashboard } = useDashboard();

  const [guideTipOpen, setGuideTipOpen] = useState(false);

  useEffect(() => {
    if (isGuideModal) {
      setGuideTipOpen(true);
    }
  }, [isGuideModal]);

  return (
    <Drawer variant="permanent" open={isDashboard}>
      {isGuideModal && <Blind />}
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={handleIsDashboard}>
          <ChevronLeftIcon fontSize="large" />
        </IconButton>
      </Toolbar>
      <Divider />
      <List
        component="nav"
        sx={{
          pt: 0,
          flex: 1,
          overflowY: "auto",
          "::-webkit-scrollbar": {
            width: "6px",
          },
        }}
      >
        {pathname === "/login" ? (
          isDashboard && (
            <Box sx={{ p: 1, textAlign: "center" }}>로그인을 부탁드려요.</Box>
          )
        ) : (
          <>
            {isGuideModal ? (
              <HtmlTooltip
                title={<>즐겨찾기들을 저장할 프리셋을 추가해보세요.</>}
                placement="right"
                arrow
                open={guideTipOpen}
              >
                <Button
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    height: "5vh",
                    minHeight: "40px",
                    minWidth: "unset",
                    ...(isGuideModal &&
                      guideStep === 1 && {
                        zIndex: 1201,
                        background: "white",
                      }),
                  }}
                  onClick={() => {
                    setGuideTipOpen(false);
                    addPresetModal();
                  }}
                >
                  <AddCircleOutlineIcon />
                  {isDashboard && (
                    <Typography sx={{ marginLeft: "1px" }}>
                      프리셋 추가
                    </Typography>
                  )}
                </Button>
              </HtmlTooltip>
            ) : (
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  height: "5vh",
                  minHeight: "40px",
                  minWidth: "unset",
                }}
                onClick={addPresetModal}
              >
                <AddCircleOutlineIcon />
                {isDashboard && (
                  <Typography sx={{ marginLeft: "1px" }}>
                    프리셋 추가
                  </Typography>
                )}
              </Button>
            )}
            <DraggablePresetList dragPresetData={presets} />
          </>
        )}
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
            ) : pathname === "/guest" ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mr: 2,
                    cursor: "pointer",
                  }}
                  onClick={moveLogin}
                >
                  <AccountCircleIcon fontSize="large" />
                  <span>로그인</span>
                </Box>
                <Divider orientation={"vertical"} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    ml: 2,
                    cursor: "pointer",
                  }}
                  onClick={handleSignUpModal}
                >
                  <AccountCircleIcon fontSize="large" />
                  <span>회원가입</span>
                </Box>
              </>
            ) : (
              <>
                <AccountCircleIcon fontSize="large" />
                <span onClick={moveGuest}>게스트</span>
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
    maxHeight: "100vh",
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
  padding: "12px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "2px",
  "& > span": {
    cursor: "pointer",
  },
}));

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  textAlign: "center",
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(20),
    padding: "8px 16px",
  },
}));
