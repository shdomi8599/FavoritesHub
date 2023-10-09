/* eslint-disable @next/next/no-img-element */
import { Favorite } from "@/types";
import {
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import moment from "moment";
import "moment/locale/ko";

export default function FavoriteCard({ favorite }: { favorite: Favorite }) {
  const {
    path,
    domain,
    imgHref,
    star,
    favoriteName,
    title,
    description,
    createdAt,
    lastVisitedAt,
  } = favorite;

  const openSith = () => {
    window.open(`https://${domain}${path}`, "_blank");
  };

  const formatDate = (date: string) => {
    return moment(date).format("YYYY년 MMMM Do, a h:mm:ss");
  };

  const imgSrc = imgHref.includes("https") ? imgHref : `https://${imgHref}`;
  const formatCreatedAt = formatDate(createdAt);
  const formatLastVisitedAt = formatDate(lastVisitedAt);

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Card sx={cardStyle}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", height: 150 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <img
              src={imgSrc}
              style={{ width: "2rem", height: "2rem" }}
              alt=""
            />
            <Box sx={{ cursor: "pointer" }}>
              {star ? <StarIcon /> : <StarBorderIcon />}
            </Box>
          </Box>
          <Box
            sx={{
              fontSize: 8,
              mt: 0.5,
            }}
            color="text.secondary"
          >
            등록 : {formatCreatedAt}
          </Box>
          <Box sx={{ fontSize: 14 }}>{favoriteName}</Box>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Box sx={{ mb: 1.3 }} color="text.secondary">
            {domain}
          </Box>
          <Typography
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
            variant="body2"
          >
            {description}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Button size="small" onClick={openSith}>
            방문하기
          </Button>
          <Box
            sx={{
              fontSize: 8,
            }}
            color="text.secondary"
          >
            방문 : {formatLastVisitedAt}
          </Box>
        </CardActions>
      </Card>
    </Grid>
  );
}

const cardStyle = {
  minWidth: 275,
  height: 200,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};
