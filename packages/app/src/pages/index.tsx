import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
} from "@/api/favorite";
import { postPresetDefault } from "@/api/preset";
import { LoginForm } from "@/components/auth/form";
import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { SearchAutoBar, SearchTag } from "@/components/search";
import { useAuth, useAuthModal } from "@/hooks";
import {
  useFavoriteList,
  useMemoFavorites,
  useResetQuery,
} from "@/hooks/react-query";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { isLoadingState, viewPresetState } from "@/states";
import { callbackSuccessAlert, confirmAlert } from "@/util";
import { Box, Button, Container, Grid, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

export default function Main() {
  // 상태
  const [tags, setTags] = useState<string[]>([]);
  const searchLabel = tags.includes("전체") ? "전체" : tags.join(", ");
  const [inputValue, setInputValue] = useState("");

  // 훅
  const {
    userId,
    isLogin,
    accessToken,
    setUserId,
    setUserMail,
    setAccessToken,
  } = useAuth();
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const { handleAuthModal, openAuthModal } = useAuthModal();
  const { viewPreset, addFavoriteModal } = useFavoriteModal();
  const { resetFavoriteList, resetPresetList } = useResetQuery(userId);

  // 데이터
  const { data: favorites } = useFavoriteList(
    userId,
    viewPreset?.id,
    accessToken,
  );

  const viewData = favorites?.filter((favorite) => {
    if (tags.length === 0) {
      return favorites;
    }
    const { domain, description, favoriteName, title } = favorite;
    const loweredInputValue = inputValue.toLowerCase();
    if (tags.includes("전체")) {
      return (
        domain.toLowerCase().includes(loweredInputValue) ||
        description.toLowerCase().includes(loweredInputValue) ||
        favoriteName.toLowerCase().includes(loweredInputValue) ||
        title.toLowerCase().includes(loweredInputValue)
      );
    }
    if (tags.includes("타이틀")) {
      return title.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("도메인")) {
      return domain.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("설명")) {
      return description.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("별칭")) {
      return favoriteName.toLowerCase().includes(loweredInputValue);
    }
  });

  const { titleItems, domainItems, descriptionItems, favoriteNameItems } =
    useMemoFavorites(favorites!);

  const getAutoBarData = () => {
    const selectedItems = [];
    if (tags.includes("전체")) {
      selectedItems.push(
        titleItems,
        domainItems,
        descriptionItems,
        favoriteNameItems,
      );
    } else {
      if (tags.includes("타이틀")) {
        selectedItems.push(titleItems);
      }
      if (tags.includes("도메인")) {
        selectedItems.push(domainItems);
      }
      if (tags.includes("설명")) {
        selectedItems.push(descriptionItems);
      }
      if (tags.includes("별칭")) {
        selectedItems.push(favoriteNameItems);
      }
    }
    return selectedItems.flat();
  };

  const HandleDefaultPreset = async () => {
    const { id: presetId } = viewPreset;

    const callbackEvent = async () => {
      try {
        setIsLoading(true);
        const preset = await postPresetDefault(userId, presetId, accessToken);
        await resetPresetList();
        setViewPreset(preset);
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

  const deleteFavoriteEvent = async (favoriteId: number) => {
    try {
      setIsLoading(true);
      await confirmAlert("정말 삭제하시겠습니까?", "즐겨찾기 삭제가");
      await deleteFavorite(favoriteId, accessToken);
      resetFavoriteList(viewPreset.id);
    } finally {
      setIsLoading(false);
    }
  };

  const favoriteVisited = async (favoriteId: number) => {
    await getFavoriteVisited(favoriteId, accessToken);
    resetFavoriteList(viewPreset.id);
  };

  const favoriteHandleStar = async (favoriteId: number) => {
    await getFavoriteHandleStar(favoriteId, accessToken);
    resetFavoriteList(viewPreset.id);
  };

  useEffect(() => {
    setInputValue("");
  }, [tags]);

  return isLogin ? (
    <>
      <Container
        maxWidth={"md"}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          mt: 2,
        }}
      >
        <SearchTag tags={tags} setTags={setTags} />
        <SearchAutoBar
          label={searchLabel}
          inputValue={inputValue}
          data={getAutoBarData()}
          setInputValue={setInputValue}
        />
      </Container>
      <MainContainer
        sx={{
          px: 2,
        }}
      >
        <MainTitle
          presetName={viewPreset?.presetName}
          defaultPreset={viewPreset?.defaultPreset}
          HandleDefaultPreset={HandleDefaultPreset}
        />
        <Box>
          <Button
            onClick={addFavoriteModal}
            variant="contained"
            sx={{ mt: 3, mb: 2, minWidth: 105 }}
          >
            즐겨찾기 추가
          </Button>
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
            favoriteHandleStar={favoriteHandleStar}
            deleteFavoriteEvent={deleteFavoriteEvent}
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
