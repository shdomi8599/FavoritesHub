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
  | "login"
  | "signUp"
  | "password"
  | "verify"
  | "updatePassword";

export interface AuthProps {
  handleAuthModal: (path: AuthModalState) => void;
}

type Message = "success" | "exist" | "not exact" | "not verify";

export type ApiResultMessage = {
  message: Message;
  userId: number;
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
