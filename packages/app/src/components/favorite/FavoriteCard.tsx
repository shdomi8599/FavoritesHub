import { useHandler } from "@/hooks";
import { useBreakPoints } from "@/hooks/useBreakPoints";
import { Favorite } from "@/types";
import { successToast } from "@/util/alert";
import { Card, CardContent, Grid } from "@mui/material";
import moment from "moment";
import "moment/locale/ko";
import {
  CardBottomContainer,
  CardMiddleContainer,
  CardTopContainer,
} from "./card";

type Props = {
  favoriteVisited: (favoriteId: number) => Promise<void>;
  editFavoriteModal: (favoriteId: number, name?: string) => void;
  favoriteHandleStar: (favoriteId: number) => void;
  deleteFavoriteEvent: (favoriteId: number) => void;
  upFavoriteVisitedCount: (favoriteId: number) => Promise<void>;
  favorite: Favorite;
  isGrid: boolean;
  isDrag?: boolean;
};

function FavoriteCard({
  isDrag,
  isGrid,
  favorite,
  favoriteVisited,
  favoriteHandleStar,
  deleteFavoriteEvent,
  upFavoriteVisitedCount,
  editFavoriteModal,
}: Props) {
  const { isMaxWidth900 } = useBreakPoints();
  const {
    isBoolean: isHover,
    onBoolean: onHover,
    offBoolean: offHover,
  } = useHandler(false);

  const {
    id,
    star,
    title,
    address,
    imgHref,
    createdAt,
    description,
    visitedCount,
    favoriteName,
    lastVisitedAt,
    order,
  } = favorite;

  const formatDate = (date: string) => {
    return moment(date).format("YYYY년 MMMM Do, a h:mm:ss");
  };

  const extractURLs = (text: string) => {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const urls = text.match(urlRegex);

    if (urls) {
      return urls.map((url: string) => {
        if (url.startsWith("https://")) {
          return url.replace("https://", "").split("/")[0];
        } else {
          return url.split("/")[0];
        }
      });
    } else {
      return "";
    }
  };

  const formatCreatedAt = formatDate(createdAt);
  const formatLastVisitedAt = formatDate(lastVisitedAt);
  const imgSrc = imgHref.includes("https")
    ? imgHref
    : `https://${extractURLs(address) + imgHref}`;

  const openSite = async () => {
    await upFavoriteVisitedCount(id);
    await favoriteVisited(id);
    window.open(address, "_blank");
  };

  const handleStar = () => {
    favoriteHandleStar(id);
  };

  const deleteEvent = () => {
    deleteFavoriteEvent(id);
  };

  const editEvent = () => {
    editFavoriteModal(id, favoriteName);
  };

  const copyURL = () => {
    navigator.clipboard.writeText(address);
    successToast("주소가 복사되었습니다.");
  };

  if (isDrag) {
    return (
      <div
        id={`favorite-${order}`}
        className="grid-stack-item"
        gs-no-resize="true"
      >
        <Card
          className="grid-stack-item-content"
          onClick={openSite}
          onMouseEnter={onHover}
          onMouseLeave={offHover}
          raised={isHover}
          sx={cardStyle}
        >
          <CardContent
            id={`favorite-${order}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: 120,
              backfaceVisibility: "hidden",
              transform: "translateZ(0)",
              WebkitFontSmoothing: "subpixel-antialiased",
            }}
          >
            <CardTopContainer
              id={id}
              star={star}
              title={title}
              imgSrc={!imgHref ? imgHref : imgSrc}
              favoriteName={favoriteName}
              handleStar={handleStar}
              editEvent={editEvent}
              deleteEvent={deleteEvent}
            />
            <CardMiddleContainer
              title={title}
              copyURL={copyURL}
              address={address}
              description={description}
              formatCreatedAt={formatCreatedAt}
            />
          </CardContent>
          <CardBottomContainer
            visitedCount={visitedCount}
            formatLastVisitedAt={formatLastVisitedAt}
          />
        </Card>
      </div>
    );
  }

  return (
    <Grid
      sx={{
        paddingTop: isMaxWidth900 ? "16px !important" : "",
      }}
      item
      xs={12}
      md={isGrid ? 12 : 4}
      lg={isGrid ? 12 : 3}
    >
      <Card
        onClick={openSite}
        onMouseEnter={onHover}
        onMouseLeave={offHover}
        raised={isHover}
        sx={cardStyle}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 120,
            backfaceVisibility: "hidden",
            transform: "translateZ(0)",
            WebkitFontSmoothing: "subpixel-antialiased",
          }}
        >
          <CardTopContainer
            id={id}
            star={star}
            title={title}
            imgSrc={!imgHref ? imgHref : imgSrc}
            favoriteName={favoriteName}
            handleStar={handleStar}
            editEvent={editEvent}
            deleteEvent={deleteEvent}
          />
          <CardMiddleContainer
            title={title}
            copyURL={copyURL}
            address={address}
            description={description}
            formatCreatedAt={formatCreatedAt}
          />
        </CardContent>
        <CardBottomContainer
          visitedCount={visitedCount}
          formatLastVisitedAt={formatLastVisitedAt}
        />
      </Card>
    </Grid>
  );
}

export default FavoriteCard;

const cardStyle = {
  minWidth: 275,
  height: 180,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 0.5s",
  cursor: "pointer",
};
