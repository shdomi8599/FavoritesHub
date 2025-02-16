import { useMediaQuery } from "@mui/material";

export const useBreakPoints = () => {
  const isMaxWidth600 = useMediaQuery("(max-width:600px)");
  const isMinWidth600 = useMediaQuery("(min-width:600px)");
  const isMaxWidth900 = useMediaQuery("(max-width:900px)");

  return {
    isMaxWidth600,
    isMinWidth600,
    isMaxWidth900,
  };
};
