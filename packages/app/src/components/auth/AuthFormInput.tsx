import { authFormOptions, authInputLabel } from "@/const";
import { LoginFormInput } from "@/types";
import { TextField } from "@mui/material";
import { FieldError, UseFormRegister } from "react-hook-form";
import AuthAlertMessage from "./AuthAlertMessage";

interface Props {
  register: UseFormRegister<LoginFormInput>;
  name: "mail" | "password";
  isSubmitted: boolean;
  error?: FieldError;
}

export default function AuthFormInput({
  register,
  name,
  isSubmitted,
  error,
}: Props) {
  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        {...register(name, authFormOptions[name])}
        label={authInputLabel[name]}
        autoComplete={name}
        type={name}
        autoFocus={name === "mail"}
      />
      {isSubmitted && <AuthAlertMessage error={error} />}
    </>
  );
}
