import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { SearchAutoBar, SearchTag } from "@/components/search";
import SearchSelect from "@/components/search/SearchSelect";
import { SearchSelects } from "@/const";
import { useFavoriteFilter, useHandler } from "@/hooks";
import { useBreakPoints } from "@/hooks/useBreakPoints";
import { useFavoriteModal } from "@/hooks/useFavoriteModal";
import { guideStepState, isDashboardState, isGuideModalState } from "@/states";
import { Favorite } from "@/types";
import {
  Search as SearchIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

type Props = {
  favoriteVisited: (id: number) => Promise<void>;
  deleteFavoriteEvent: (id: number) => Promise<void>;
  favoriteHandleStar: (id: number) => Promise<void>;
  upFavoriteVisitedCount: (id: number) => Promise<void>;
  HandleDefaultPreset: () => Promise<void>;
  favorites: Favorite[];
};

export default function MainContainer({
  HandleDefaultPreset,
  favoriteVisited,
  deleteFavoriteEvent,
  favoriteHandleStar,
  upFavoriteVisitedCount,
  favorites,
}: Props) {
  // 상태
  const isGuideModal = useRecoilValue(isGuideModalState);
  const guideStep = useRecoilValue(guideStepState);
  const [isGrid, setIsGrid] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState("createdAt");
  const [inputValue, setInputValue] = useState("");
  const searchLabel = tags.includes("전체") ? "전체" : tags.join(", ");
  const { isBoolean: isStar, handleBoolean: handleStar } = useHandler(false);

  // 훅
  const { isMaxWidth600, isMaxWidth900 } = useBreakPoints();
  const isDashboard = useRecoilValue(isDashboardState);
  const isHideContent = isDashboard && isMaxWidth600;
  const { viewPreset, addFavoriteModal, editFavoriteModal } =
    useFavoriteModal();

  // 데이터
  const { viewData, autoBarData } = useFavoriteFilter({
    selectValue,
    favorites,
    isStar,
    tags,
    inputValue,
  });

  useEffect(() => {
    if (tags.length === 0) {
      setInputValue("");
    }
  }, [tags]);

  return (
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
              {!isMaxWidth900 && (
                <IconButton onClick={() => setIsGrid(!isGrid)}>
                  {isGrid ? (
                    <ViewModuleIcon fontSize="large" />
                  ) : (
                    <ViewListIcon fontSize="large" />
                  )}
                </IconButton>
              )}
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
                sx={{
                  minWidth: 105,
                  ...(isGuideModal &&
                    guideStep === 2 && {
                      zIndex: 1201,
                    }),
                }}
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
          mt: 0,
        }}
      >
        {viewData?.map((favorite, index) => (
          <FavoriteCard
            key={index}
            isGrid={isGrid}
            favorite={favorite}
            editFavoriteModal={editFavoriteModal}
            favoriteVisited={favoriteVisited}
            deleteFavoriteEvent={deleteFavoriteEvent}
            favoriteHandleStar={favoriteHandleStar}
            upFavoriteVisitedCount={upFavoriteVisitedCount}
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
