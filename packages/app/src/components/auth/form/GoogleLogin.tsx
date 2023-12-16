import { baseURL } from "@/api";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

const GoogleLogin = () => {
  return (
    <GoogleBox>
      <GoogleBtn href={`${baseURL}/auth/google`} />
    </GoogleBox>
  );
};

export default GoogleLogin;

const GoogleBox = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  marginBottom: "8px",
}));

const GoogleBtn = styled("a")(() => ({
  width: "180px",
  display: "block",
  height: "43px",
  backgroundImage: `url(/google/btn.png)`,
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
  cursor: "pointer",
  "&:hover": {
    backgroundImage: `url(/google/btn-hover.png)`,
  },
}));
