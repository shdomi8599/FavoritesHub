import {
  postAuthLogout,
  postAuthVerify,
  postAuthVerifyLogin,
  postSignUp,
  postUserExist,
  putUpdatePassword,
} from "@/api/auth";
import { guestFavoritesAdd } from "@/api/favorite";
import {
  dragFavoriteDataState,
  dragPresetDataState,
  isLoadingState,
  isPasswordForgotState,
  isRefreshTokenState,
  viewPresetState,
} from "@/states";
import {
  Favorite,
  LoginFormInput,
  MailVerifyInput,
  Preset,
  SignUpFormInput,
  updatePasswordFormInput,
} from "@/types";
import {
  callbackSuccessAlert,
  confirmAlert,
  errorAlert,
  getLocalStorageItem,
  successAlert,
} from "@/util";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useAuth, useAuthModal, useFavoriteEvent, usePresetEvent } from ".";
import { useResetQuery } from "./react-query";
import { useRouters } from "./useRouters";

export const useAuthEvent = () => {
  const setIsLoading = useSetRecoilState(isLoadingState);
  const setViewPreset = useSetRecoilState(viewPresetState);
  const setDragPresetData = useSetRecoilState(dragPresetDataState);
  const setDragFavoriteData = useSetRecoilState(dragFavoriteDataState);
  const isRefreshToken = useRecoilValue(isRefreshTokenState);
  const [isForgot, setIsForgot] = useRecoilState(isPasswordForgotState);

  const { resetPresetList } = useResetQuery();
  const { presetRelocation } = usePresetEvent();
  const { favoriteRelocation } = useFavoriteEvent();
  const { moveLogin, moveHome, moveReload } = useRouters();
  const { offAuthModal, handleAuthModal } = useAuthModal();
  const { userMail, accessToken, setUserId, setAccessToken, setUserMail } =
    useAuth();

  const resetUserData = () => {
    setUserMail("");
    setAccessToken("");
    setViewPreset(null!);
    setDragPresetData([]);
    setDragFavoriteData([]);
    resetPresetList();
    moveLogin();
  };

  const alertEvent = () => {
    handleAuthModal("verify");
  };

  const authForgotPassword = async (data: LoginFormInput) => {
    const { mail } = data;

    const user = await postUserExist(mail);

    if (!user) {
      return errorAlert("가입되지 않은 이메일입니다.", "이메일 확인");
    }

    setUserMail(mail);
    setIsForgot(true);

    return callbackSuccessAlert(
      "이메일 인증을 부탁드려요.",
      "인증 하러가기",
      alertEvent,
    );
  };

  const authSignUp = async (data: SignUpFormInput) => {
    const { mail, password } = data;
    const { message } = await postSignUp(mail, password);

    if (message === "exist") {
      return errorAlert("이미 가입된 이메일입니다.", "이메일 확인");
    }

    if (message === "success") {
      try {
        const guestFavoriteList: Favorite[] =
          getLocalStorageItem("favoriteList");

        if (guestFavoriteList) {
          await confirmAlert(
            "게스트 데이터를 이전하시겠습니까?",
            "게스트 이전이",
          ).then(async () => {
            setIsLoading(true);
            const presetList: Preset[] = getLocalStorageItem("presetList");
            const presetName = presetList[0].presetName;
            await guestFavoritesAdd(guestFavoriteList, mail, presetName);
          });
        }
      } finally {
        callbackSuccessAlert(
          "회원가입을 축하합니다.",
          "로그인 하러가기",
          moveLogin,
        );
        offAuthModal();
        setIsLoading(false);
      }
    }
  };

  const authMailVerify = async (data: MailVerifyInput) => {
    const { verifyCode } = data;
    const { message } = await postAuthVerify(userMail, verifyCode);

    if (message === "not verify") {
      return errorAlert("인증번호가 일치하지 않습니다.", "인증번호");
    }

    if (message === "success") {
      successAlert("이메일 인증에 성공했습니다.", "이메일 인증");
    }

    if (isForgot) {
      return handleAuthModal("updatePassword");
    }

    const { accessToken, userId } = await postAuthVerifyLogin(
      userMail,
      isRefreshToken,
    );

    setUserMail(userMail);
    setUserId(userId);
    setAccessToken(accessToken!);
    offAuthModal();
    moveHome();
  };

  const authUpdatePassword = async (data: updatePasswordFormInput) => {
    const { password } = data;
    const { message } = await putUpdatePassword(userMail, password);

    if (message === "success") {
      setUserMail("");
      offAuthModal();
      successAlert("재설정이 완료되었습니다.", "비밀번호 재설정");
    }
  };

  const authLogout = async () => {
    try {
      await favoriteRelocation();
      await presetRelocation();
      const { message } = await postAuthLogout(accessToken);

      if (message === "success") {
        resetUserData();
        moveLogin();
      }
    } catch {
      resetUserData();
      moveReload();
    }
  };

  return {
    authForgotPassword,
    authSignUp,
    authMailVerify,
    authUpdatePassword,
    authLogout,
  };
};
