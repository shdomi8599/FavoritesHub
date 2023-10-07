export interface LoginFormInput {
  mail: string;
  password: string;
}
export interface SignUpFormInput extends LoginFormInput {
  confirmPassword?: string;
}

export type AuthModalState = "login" | "signUp" | "password";

export interface AuthProps {
  handleAuthModal: (auth: AuthModalState) => void;
}

type Message = "success" | "exist" | "not exact";

export type ApiResultMessage = {
  message: Message;
};

export interface ApiResultAccessToken {
  accessToken?: string;
  message?: Message;
}
