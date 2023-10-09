import { Box, Typography, styled } from "@mui/material";

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
          fontSize: 8,
          my: 0.5,
        }}
        color="text.secondary"
      >
        등록 : {formatCreatedAt}
      </Box>
      <Typography
        variant="h5"
        component="div"
        sx={{
          ...hideText,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          mb: 1.3,
          ...hideText,
        }}
        color="text.secondary"
      >
        {address}
      </Box>
      <Typography
        sx={{
          ...hideText,
        }}
        variant="body2"
      >
        {description}
      </Typography>
    </MiddleContainer>
  );
}

const hideText = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
};

const MiddleContainer = styled(Box)(() => ({}));
