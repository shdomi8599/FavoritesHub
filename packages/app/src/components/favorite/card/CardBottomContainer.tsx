import { Box, Button, CardActions, Tooltip, styled } from "@mui/material";

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
      <Button
        size="small"
        onClick={openSite}
        sx={{ minWidth: "50px" }}
        variant="contained"
      >
        방문
      </Button>
      <Tooltip title={formatLastVisitedAt} enterDelay={300}>
        <Box
          sx={{
            fontSize: 8,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          color="text.secondary"
        >
          최근 방문 : {formatLastVisitedAt}
        </Box>
      </Tooltip>
    </BottomContainer>
  );
}

const BottomContainer = styled(CardActions)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: 50,
}));
