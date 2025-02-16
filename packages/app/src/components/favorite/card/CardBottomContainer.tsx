import { Box, CardActions, Tooltip, styled } from "@mui/material";

type Props = {
  formatLastVisitedAt: string;
  visitedCount: number;
};

export default function CardBottomContainer({
  visitedCount,
  formatLastVisitedAt,
}: Props) {
  return (
    <BottomContainer
      sx={{
        p: 2,
      }}
    >
      <Box
        sx={{
          fontSize: 9,
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
        color="text.secondary"
      >
        방문 횟수: {visitedCount}
      </Box>
      <Tooltip title={formatLastVisitedAt} enterDelay={300}>
        <Box
          sx={{
            fontSize: 9,
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
