import { atom } from "recoil";

export const isLoginState = atom({
  key: "isLoginState",
  default: false,
});

export const isModalState = atom({
  key: "isModalState",
  default: false,
});

// 대시보드 바 높이 상태
export const barHeightState = atom({
  key: "barHeightState",
  default: 0,
});

export const authModalState = atom({
  key: "authModalState",
  default: "login",
});
