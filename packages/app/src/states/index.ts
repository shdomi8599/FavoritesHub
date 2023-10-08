import { AuthModalState, PresetModalState } from "@/types";
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

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: "login",
});

export const isPresetModalState = atom({
  key: "isPresetModalState",
  default: false,
});

export const presetModalState = atom<PresetModalState>({
  key: "authModalState",
  default: "add",
});

export const selectedPresetIdState = atom({
  key: "selectedPresetState",
  default: 0,
});

export const accessTokenState = atom({
  key: "accessTokenState",
  default: "",
});

export const userIdState = atom({
  key: "userIdState",
  default: 0,
});

export const userMailState = atom({
  key: "userMailState",
  default: "",
});
