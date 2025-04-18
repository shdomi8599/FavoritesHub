export interface LoginFormInput {
  mail: string;
  password: string;
}
export interface SignUpFormInput extends LoginFormInput {
  confirmPassword?: string;
}

export interface MailVerifyInput {
  verifyCode: string;
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
  offAuthModal: () => void;
}

export type PresetModalState = "add" | "edit";

export type FavoriteModalState = "add" | "edit" | "import" | "export";

export interface PresetAddFormInput {
  presetName: string;
}

export interface FavoriteEditFormInput {
  favoriteName: string;
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
  | "cors"
  | "googleId";

export interface ApiResultMessage {
  message?: Message;
  userId?: number;
}

export interface ResPostPresetAdd extends ApiResultMessage {
  preset?: Preset;
}

export interface ResPostPresetPut extends ApiResultMessage {
  preset?: Preset;
}

export interface ResPostFavoritePut {
  favorite: Favorite;
}

export interface ApiResultAccessToken {
  accessToken?: string;
  message?: Message;
  userId: number;
  mail: string;
}

export interface Preset {
  id: number;
  order: number;
  presetName: string;
}

export interface Favorite {
  id: number;
  favoriteName: string;
  address: string;
  createdAt: string;
  description: string;
  imgHref: string;
  lastVisitedAt: string;
  star: boolean;
  title: string;
  visitedCount: number;
  order: number;
}

export interface ImportFavorite {
  address: string;
  [key: string]: any;
}

export interface AutoBarItem {
  label: string;
}

export interface SelectItem extends AutoBarItem {
  value: string;
}
