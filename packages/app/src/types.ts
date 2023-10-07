export interface LoginFormInput {
  mail: string;
  password: string;
}
export interface SignUpFormInput extends LoginFormInput {
  confirmPassword?: string;
}

export type AuthModalState = "login" | "signUp" | "password" | "congrats";

export interface AuthProps {
  handleAuthModal: (auth: AuthModalState) => void;
}

export type PostSignUpMessage = {
  message: "success" | "exist";
};
