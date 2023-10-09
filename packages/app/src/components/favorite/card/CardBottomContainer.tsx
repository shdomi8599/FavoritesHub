import { Box, Button, CardActions, styled } from "@mui/material";

type Props = {
  openSite: () => void;
  formatLastVisitedAt: string;
};

export default function CardBottomContainer({
  openSite,
  formatLastVisitedAt,
}: Props) {
  return (
    <BottomContainer
      sx={{
        p: 2,
      }}
    >
      <Button size="small" onClick={openSite}>
        방문하기
      </Button>
      <Box
        sx={{
          fontSize: 8,
        }}
        color="text.secondary"
      >
        최근 방문 : {formatLastVisitedAt}
      </Box>
    </BottomContainer>
  );
}

const BottomContainer = styled(CardActions)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 50,
}));
