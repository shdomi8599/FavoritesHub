import FavoriteCard from "@/components/favorite/FavoriteCard";
import { MainTitle } from "@/components/main";
import { SearchAutoBar, SearchTag } from "@/components/search";
import SearchSelect from "@/components/search/SearchSelect";
import { SearchSelects } from "@/const";
import { useFavoriteEvent, useFavoriteFilter, useHandler } from "@/hooks";
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
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import DraggableFavoriteList from "./DraggableFavoriteList";

type Props = {
  favorites: Favorite[];
};

export default function MainContainer({ favorites }: Props) {
  const [open, setOpen] = useState(false);
  const isGuideModal = useRecoilValue(isGuideModalState);
  const guideStep = useRecoilValue(guideStepState);
  const [isGrid, setIsGrid] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [selectValue, setSelectValue] = useState("default");
  const [inputValue, setInputValue] = useState("");
  const searchLabel = tags.includes("전체") ? "전체" : tags.join(", ");
  const { isBoolean: isStar, handleBoolean: handleStar } = useHandler(false);

  const { isMaxWidth600, isMaxWidth900 } = useBreakPoints();
  const { viewPreset, addFavoriteModal } = useFavoriteModal();
  const isDashboard = useRecoilValue(isDashboardState);
  const isHideContent = isDashboard && isMaxWidth600;
  const { relocationFavorites } = useFavoriteEvent();

  const { viewData, autoBarData } = useFavoriteFilter({
    selectValue,
    favorites,
    isStar,
    tags,
    inputValue,
  });

  useEffect(() => {
    if (isStar || isGrid) {
      relocationFavorites();
    }
  }, [isStar, isGrid]);

  useEffect(() => {
    if (tags.length === 0) {
      setInputValue("");
    }
  }, [tags]);

  useEffect(() => {
    if (isGuideModal && guideStep === 2) {
      setOpen(true);
    }
  }, [isGuideModal, guideStep]);

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
        <MainTitle presetName={viewPreset?.presetName} />
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
                label={"정렬"}
                selectValue={selectValue}
                menuItems={SearchSelects}
                setSelectValue={setSelectValue}
              />
              {isGuideModal ? (
                <HtmlTooltip
                  title={<>즐겨찾기를 추가해보세요.</>}
                  placement="left"
                  arrow
                  open={open}
                >
                  <Button
                    onClick={() => {
                      setOpen(false);
                      addFavoriteModal();
                    }}
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
                </HtmlTooltip>
              ) : (
                <Button
                  onClick={addFavoriteModal}
                  variant="contained"
                  sx={{
                    minWidth: 105,
                  }}
                >
                  즐겨찾기 추가
                </Button>
              )}
            </>
          )}
        </Box>
      </CenterContainer>
      {selectValue === "default" && !isStar ? (
        <DraggableFavoriteList isGrid={isGrid} />
      ) : (
        <Grid
          container
          spacing={2.5}
          sx={{
            marginTop: "-10px",
            padding: "0px 10px",
            paddingTop: "0px",
          }}
        >
          {viewData?.map((favorite, index) => (
            <FavoriteCard key={index} isGrid={isGrid} favorite={favorite} />
          ))}
        </Grid>
      )}
    </>
  );
}

const CenterContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
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
