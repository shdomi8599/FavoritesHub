import { useMediaQuery } from "@mui/material";

export const useBreakPoints = () => {
  const isMinWidth600 = useMediaQuery("(min-width:600px)");
  const isMaxWidth900 = useMediaQuery("(max-width:900px)");

  return {
    isMinWidth600,
    isMaxWidth900,
  };
};
