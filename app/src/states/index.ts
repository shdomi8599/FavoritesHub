import { atom } from "recoil";

export const isLoginState = atom({
  key: "isLoginState",
  default: false,
});

export const isModalState = atom({
  key: "isModalState",
  default: false,
});

export const DashboardBarHeightState = atom({
  key: "DashboardBarHeightState",
  default: 0,
});
