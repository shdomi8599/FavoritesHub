export interface LoginFormInput {
  mail: string;
  password: string;
}

export type AuthModalState = "login" | "signUp" | "password";

export interface AuthProps {
  handleAuthModal: (auth: AuthModalState) => void;
}
