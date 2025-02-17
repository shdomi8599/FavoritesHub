import { copyURL } from "@/util";
import { Box, Tooltip, Typography, styled } from "@mui/material";

type Props = {
  title: string;
  address: string;
  description: string;
  formatCreatedAt: string;
};

export default function CardMiddleContainer({
  title,
  address,
  description,
  formatCreatedAt,
}: Props) {
  return (
    <MiddleContainer>
      <Box
        sx={{
          fontSize: 9,
          my: 0.5,
        }}
        color="text.secondary"
      >
        등록 : {formatCreatedAt}
      </Box>
      <Tooltip title={title} enterDelay={300}>
        <Typography
          variant="h5"
          component="div"
          sx={{
            ...hideText,
          }}
        >
          {title}
        </Typography>
      </Tooltip>
      <Tooltip title={"복사하려면 클릭하세요."} enterDelay={300}>
        <Box
          color="text.secondary"
          sx={{
            mb: 1.3,
            ...hideText,
          }}
          onClick={(e) => {
            e.stopPropagation();
            copyURL(address);
          }}
        >
          {address}
        </Box>
      </Tooltip>
      <Tooltip title={description} enterDelay={300}>
        <Typography
          sx={{
            ...hideText,
          }}
          variant="body2"
        >
          {description}
        </Typography>
      </Tooltip>
    </MiddleContainer>
  );
}

const hideText = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const MiddleContainer = styled(Box)(() => ({}));
