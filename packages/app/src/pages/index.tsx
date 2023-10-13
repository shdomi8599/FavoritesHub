import {
  deleteFavorite,
  getFavoriteHandleStar,
  getFavoriteVisited,
  upVisitedCountFavorite,
} from "@/api/favorite";
import { postPresetDefault } from "@/api/preset";
import { LoginForm } from "@/components/auth/form";
import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { SearchAutoBar, SearchTag } from "@/components/search";
import SearchSelect from "@/components/search/SearchSelect";
import { SearchSelects } from "@/const";
import { useAuth, useAuthModal, useHandler } from "@/hooks";
import {
  useFavoriteList,
  useMemoFavorites,
  useResetQuery,
} from "@/hooks/react-query";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { isLoadingState, viewPresetState } from "@/states";
import { Favorite } from "@/types";
import { callbackSuccessAlert, confirmAlert } from "@/util";
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
import { useSetRecoilState } from "recoil";

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

  const upFavoriteVisitedCount = async (id: number) => {
    await upVisitedCountFavorite(id, accessToken);
  };

  const getFilterData = () => {
    let data: Favorite[] = [];

    if (selectValue === "createdAt") {
      data = favorites?.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })!;
    }

    if (selectValue === "lastVisitedAt") {
      data = favorites?.sort((a, b) => {
        return (
          new Date(b.lastVisitedAt).getTime() -
          new Date(a.lastVisitedAt).getTime()
        );
      })!;
    }

    if (selectValue === "visitedCount") {
      data = favorites?.sort((a, b) => {
        return b.visitedCount - a.visitedCount;
      })!;
    }

    if (isStar) {
      data = favorites?.filter((favorite) => favorite.star)!;
    }

    return data;
  };

  const viewData = getFilterData()?.filter((favorite) => {
    if (tags.length === 0) {
      return favorites;
    }
    const { address, description, favoriteName, title } = favorite;
    const loweredInputValue = inputValue.toLowerCase();
    if (tags.includes("전체")) {
      return (
        address.toLowerCase().includes(loweredInputValue) ||
        description.toLowerCase().includes(loweredInputValue) ||
        favoriteName.toLowerCase().includes(loweredInputValue) ||
        title.toLowerCase().includes(loweredInputValue)
      );
    }
    if (tags.includes("타이틀")) {
      return title.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("주소")) {
      return address.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("설명")) {
      return description.toLowerCase().includes(loweredInputValue);
    }
    if (tags.includes("별칭")) {
      return favoriteName.toLowerCase().includes(loweredInputValue);
    }
  });

  const { titleItems, descriptionItems, favoriteNameItems, addressItems } =
    useMemoFavorites(viewData!);

  const getAutoBarData = () => {
    const selectedItems = [];
    if (tags.includes("전체")) {
      selectedItems.push(titleItems, descriptionItems, favoriteNameItems);
    } else {
      if (tags.includes("타이틀")) {
        selectedItems.push(titleItems);
      }
      if (tags.includes("주소")) {
        selectedItems.push(addressItems);
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
        const preset = await postPresetDefault(presetId, accessToken);
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
        <SearchIcon fontSize="large" />
        <SearchTag tags={tags} setTags={setTags} />
        <SearchAutoBar
          tags={tags}
          label={searchLabel}
          inputValue={inputValue}
          data={getAutoBarData()}
          setInputValue={setInputValue}
        />
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
