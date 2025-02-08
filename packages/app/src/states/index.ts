import {
  AuthModalState,
  Favorite,
  FavoriteModalState,
  Preset,
  PresetModalState,
} from "@/types";
import { atom } from "recoil";

export const isLoginState = atom({
  key: "isLoginState",
  default: false,
});

// 대시보드 바 높이 상태
export const barHeightState = atom({
  key: "barHeightState",
  default: 0,
});

export const isAuthModalState = atom({
  key: "isAuthModalState",
  default: false,
});

export const isPasswordForgotState = atom({
  key: "isPasswordForgotState",
  default: false,
});

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: "signUp",
});

export const isPresetModalState = atom({
  key: "isPresetModalState",
  default: false,
});

export const isPresetEventState = atom({
  key: "isPresetEventState",
  default: false,
});

export const presetModalState = atom<PresetModalState>({
  key: "presetModalState",
  default: "add",
});

export const presetLengthState = atom({
  key: "presetLengthState",
  default: 0,
});

export const selectedPresetIdState = atom({
  key: "selectedPresetState",
  default: 0,
});

export const isFavoriteModalState = atom({
  key: "isFavoriteModalState",
  default: false,
});

export const favoriteModalState = atom<FavoriteModalState>({
  key: "favoriteModalState",
  default: "add",
});

export const selectedFavoriteIdState = atom({
  key: "selectedFavoriteIdState",
  default: 0,
});

export const selectedFavoriteNameState = atom({
  key: "selectedFavoriteNameState",
  default: "",
});

export const viewPresetState = atom<Preset>({
  key: "viewPresetState",
  default: null!,
});

export const accessTokenState = atom({
  key: "accessTokenState",
  default: "",
});

export const isRefreshTokenState = atom({
  key: "isRefreshTokenState",
  default: false,
});

export const userIdState = atom({
  key: "userIdState",
  default: 0,
});

export const userMailState = atom({
  key: "userMailState",
  default: "",
});

export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});

export const isDashboardState = atom({
  key: "isDashboardState",
  default: true,
});

export const guestPresetsState = atom<Preset[]>({
  key: "guestPresetsState",
  default: [],
});

export const guestFavoritesState = atom<Favorite[]>({
  key: "guestFavoritesState",
  default: [],
});

export const isGuideModalState = atom({
  key: "isGuideModalState",
  default: false,
});

export const guideStepState = atom({
  key: "guideStepState",
  default: 1,
});
