import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { SearchAutoBar, SearchTag } from "@/components/search";
import SearchSelect from "@/components/search/SearchSelect";
import { SearchSelects } from "@/const";
import { useFavoriteFilter, useHandler } from "@/hooks";
import { useBreakPoints } from "@/hooks/useBreakPoints";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import {
  localFavoriteDelete,
  localFavoriteHandleStar,
  localFavoriteVisited,
  localUpFavoriteVisited,
} from "@/localEvent/favorite";
import { localHandleDefaultPreset } from "@/localEvent/preset";
import {
  guestFavoritesState,
  guestPresetsState,
  isDashboardState,
  isLoadingState,
  viewPresetState,
} from "@/states";
import { Favorite, Preset } from "@/types";
import { callbackSuccessAlert, getLocalStorageItem } from "@/util";
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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function Guest() {
  // 상태
  const [tags, setTags] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState("createdAt");
  const [inputValue, setInputValue] = useState("");
  const searchLabel = tags.includes("전체") ? "전체" : tags.join(", ");
  const { isBoolean: isStar, handleBoolean: handleStar } = useHandler(false);

  // 훅
  const { isMaxWidth600 } = useBreakPoints();
  const isDashboard = useRecoilValue(isDashboardState);
  const isHideContent = isDashboard && isMaxWidth600;
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const { viewPreset, addFavoriteModal, editFavoriteModal } =
    useFavoriteModal();

  // 데이터
  const [guestFavorites, setGuestFavorites] =
    useRecoilState(guestFavoritesState);
  const favorites = [...guestFavorites];
  const setGuestPresets = useSetRecoilState(guestPresetsState);
  const { viewData, autoBarData } = useFavoriteFilter({
    selectValue,
    favorites,
    isStar,
    tags,
    inputValue,
  });

  // 로컬 즐겨찾기 이벤트
  const localDeleteFavoriteEvent = async (id: number) => {
    await localFavoriteDelete(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const localUpFavoriteVisitedCountEvent = async (id: number) => {
    await localUpFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const localFavoriteVisitedEvent = async (id: number) => {
    await localFavoriteVisited(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const localFavoriteHandleStarEvent = async (id: number) => {
    await localFavoriteHandleStar(id);
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    setGuestFavorites([...favorites]);
  };

  const HandleDefaultPreset = async () => {
    if (!viewPreset) {
      return;
    }
    const { id: presetId } = viewPreset;

    const callbackEvent = async () => {
      try {
        setIsLoading(true);
        const result = localHandleDefaultPreset(presetId);
        if (result) {
          const { newPresetList, findPreset } = result;
          setGuestPresets(newPresetList);
          setViewPreset(findPreset!);
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

  useEffect(() => {
    const presets: Preset[] = getLocalStorageItem("presetList");
    const defaultPreset = presets?.find(({ defaultPreset }) => defaultPreset)!;
    setViewPreset(defaultPreset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const favorites: Favorite[] = getLocalStorageItem("favoriteList");
    if (favorites) {
      setGuestFavorites([...favorites]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Favorites Hub - 게스트</title>
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
      <CenterContainer
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
      </CenterContainer>
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
            editFavoriteModal={editFavoriteModal}
            favoriteVisited={localFavoriteVisitedEvent}
            deleteFavoriteEvent={localDeleteFavoriteEvent}
            favoriteHandleStar={localFavoriteHandleStarEvent}
            upFavoriteVisitedCount={localUpFavoriteVisitedCountEvent}
          />
        ))}
      </Grid>
    </>
  );
}

const CenterContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
