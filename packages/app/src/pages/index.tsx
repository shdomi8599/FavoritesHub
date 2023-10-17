import { getPresetDefault } from "@/api/preset";
import { LoginForm } from "@/components/auth/form";
import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { SearchAutoBar, SearchTag } from "@/components/search";
import SearchSelect from "@/components/search/SearchSelect";
import { SearchSelects } from "@/const";
import {
  useAuth,
  useAuthModal,
  useFavoriteEvent,
  useFavoriteFilter,
  useHandler,
} from "@/hooks";
import { useFavoriteList, useResetQuery } from "@/hooks/react-query";
import { useBreakPoints } from "@/hooks/useBreakPoints";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { isDashboardState, isLoadingState, viewPresetState } from "@/states";
import { callbackSuccessAlert } from "@/util";
import {
  Search as SearchIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function Main() {
  // 상태
  const [tags, setTags] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState("createdAt");
  const [inputValue, setInputValue] = useState("");
  const searchLabel = tags.includes("전체") ? "전체" : tags.join(", ");
  const { isBoolean: isStar, handleBoolean: handleStar } = useHandler(false);

  // 훅
  const {
    userId,
    isLogin,
    accessToken,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const { isMaxWidth600 } = useBreakPoints();
  const isDashboard = useRecoilValue(isDashboardState);
  const isHideContent = isDashboard && isMaxWidth600;
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const { handleAuthModal, openAuthModal } = useAuthModal();
  const { viewPreset, addFavoriteModal, editFavoriteModal } =
    useFavoriteModal();
  const { resetFavoriteList, resetPresetList } = useResetQuery(userId);

  // 데이터
  const { data: favorites } = useFavoriteList(
    userId,
    viewPreset?.id,
    accessToken,
  );

  const { viewData, autoBarData } = useFavoriteFilter({
    selectValue,
    favorites,
    isStar,
    tags,
    inputValue,
  });

  // 이벤트
  const {
    deleteFavoriteEvent,
    favoriteVisited,
    favoriteHandleStar,
    upFavoriteVisitedCount,
  } = useFavoriteEvent({
    id: viewPreset?.id,
    accessToken,
    setIsLoading,
    resetFavoriteList,
  });

  const HandleDefaultPreset = async () => {
    const { id: presetId } = viewPreset;

    const callbackEvent = async () => {
      try {
        setIsLoading(true);
        const preset = await getPresetDefault(presetId, accessToken);
        await resetPresetList();
        setViewPreset(preset);
      } catch (e: any) {
        if (e?.code === 401) {
          location.reload();
        }
      } finally {
        setIsLoading(false);
      }
    };

    callbackSuccessAlert(
      "기본 프리셋 변경",
      "정말 기본 프리셋을 변경하시겠습니까?",
      callbackEvent,
    );
  };

  useEffect(() => {
    setInputValue("");
  }, [tags]);

  return isLogin ? (
    <>
      <Head>
        <title>Favorites Hub</title>
      </Head>
      <Container
        maxWidth={"md"}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          mt: 2,
        }}
      >
        {!isHideContent && (
          <>
            <SearchIcon fontSize="large" />
            <SearchTag tags={tags} setTags={setTags} />
            <SearchAutoBar
              tags={tags}
              label={searchLabel}
              inputValue={inputValue}
              data={autoBarData}
              setInputValue={setInputValue}
            />
          </>
        )}
      </Container>
      <MainContainer
        sx={{
          px: 2,
          mt: 1,
          "@media screen and (max-width: 600px)": {
            flexDirection: "column",
            gap: 1.5,
          },
        }}
      >
        <MainTitle
          presetName={viewPreset?.presetName}
          defaultPreset={viewPreset?.defaultPreset}
          HandleDefaultPreset={HandleDefaultPreset}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            "@media screen and (max-width: 600px)": {
              width: "100%",
              justifyContent: "flex-end",
            },
          }}
        >
          {!isHideContent && (
            <>
              <IconButton onClick={handleStar}>
                {isStar ? (
                  <StarIcon fontSize="large" sx={{ color: "#e96363d2" }} />
                ) : (
                  <StarBorderIcon fontSize="large" />
                )}
              </IconButton>
              <SearchSelect
                label={"날짜"}
                selectValue={selectValue}
                menuItems={SearchSelects}
                setSelectValue={setSelectValue}
              />
              <Button
                onClick={addFavoriteModal}
                variant="contained"
                sx={{ minWidth: 105 }}
              >
                즐겨찾기 추가
              </Button>
            </>
          )}
        </Box>
      </MainContainer>
      <Grid
        container
        spacing={4}
        sx={{
          p: 2,
        }}
      >
        {viewData?.map((favorite, index) => (
          <FavoriteCard
            key={index}
            favorite={favorite}
            favoriteVisited={favoriteVisited}
            editFavoriteModal={editFavoriteModal}
            favoriteHandleStar={favoriteHandleStar}
            deleteFavoriteEvent={deleteFavoriteEvent}
            upFavoriteVisitedCount={upFavoriteVisitedCount}
          />
        ))}
      </Grid>
    </>
  ) : (
    <LoginContainer>
      <LoginForm
        setUserId={setUserId}
        setUserMail={setUserMail}
        openAuthModal={openAuthModal}
        setAccessToken={setAccessToken}
        handleAuthModal={handleAuthModal}
      />
    </LoginContainer>
  );
}

const LoginContainer = styled(Box)(() => ({
  height: "90%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const MainContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
