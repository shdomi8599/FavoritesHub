import {
  accessTokenState,
  isLoginState,
  userIdState,
  userMailState,
} from "@/states";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

export const useAuth = () => {
  const [userId, setUserId] = useRecoilState(userIdState);
  const [userMail, setUserMail] = useRecoilState(userMailState);
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  const resetAccessToken = () => {
    setAccessToken("");
  };

  useEffect(() => {
    if (accessToken) {
      setIsLogin(true);
    } else {
      setUserId(0);
      setIsLogin(false);
    }
  }, [accessToken, setIsLogin, setUserId]);

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
