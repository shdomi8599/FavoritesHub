import {
  accessTokenState,
  isLoginState,
  userIdState,
  userMailState,
} from "@/states";
import { useRecoilState } from "recoil";

export const useAuth = () => {
  const [userId, setUserId] = useRecoilState(userIdState);
  const [userMail, setUserMail] = useRecoilState(userMailState);
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const resetAccessToken = () => {
    setAccessToken("");
  };

  return {
    userId,
    userMail,
    isLogin,
    accessToken,
    setUserId,
    setIsLogin,
    setAccessToken,
    setUserMail,
    resetAccessToken,
  };
};
