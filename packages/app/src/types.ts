export interface LoginFormInput {
  mail: string;
  password: string;
}
export interface SignUpFormInput extends LoginFormInput {
  confirmPassword?: string;
}

export type AuthModalState = "login" | "signUp" | "password" | "verify";

export interface AuthProps {
  handleAuthModal: (auth: AuthModalState) => void;
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
