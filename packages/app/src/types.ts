export interface LoginFormInput {
  mail: string;
  password: string;
}
export interface SignUpFormInput extends LoginFormInput {
  confirmPassword?: string;
}

export interface updatePasswordFormInput {
  password: string;
  confirmPassword: string;
}

export type AuthModalState =
  | "signUp"
  | "password"
  | "verify"
  | "updatePassword";

export interface AuthProps {
  handleAuthModal: (path: AuthModalState) => void;
  handleClose: () => void;
}

export type PresetModalState = "add" | "edit";

export type FavoriteModalState = "add" | "edit";

export interface PresetAddFormInput {
  presetName: string;
}

export interface FavoriteAddFormInput {
  favoriteName: string;
  address: string;
}

type Message =
  | "success"
  | "exist"
  | "not exact"
  | "not verify"
  | "same"
  | "max"
  | "cors";

export type ApiResultMessage = {
  message: Message;
  userId?: number;
};

export interface ApiResultAccessToken {
  accessToken?: string;
  message?: Message;
  userId: number;
}

export interface DashBoardChildProps {
  handleDrawer: () => void;
  isLogin: boolean;
  toolBarOpen: boolean;
  handleModalOpen: () => void;
  logoutEvent: () => void;
}

export interface Preset {
  defaultPreset: boolean;
  id: number;
  presetName: string;
}

export interface Favorite {
  id: number;
  favoriteName: string;
  domain: string;
  createdAt: string;
  description: string;
  imgHref: string;
  path: string;
  lastVisitedAt: string;
  star: boolean;
  title: string;
}
