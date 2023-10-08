import { authFormOptions, authInputLabel } from "@/const";
import { TextField } from "@mui/material";
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import AuthAlertMessage from "./AuthAlertMessage";

interface AuthFormInputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: string;
  isSubmitted: boolean;
  error?: FieldError;
  option?: RegisterOptions;
}

export default function AuthFormInput<T extends FieldValues>({
  register,
  name,
  isSubmitted,
  error,
  option,
}: AuthFormInputProps<T>) {
  return (
    <>
      {option ? (
        <TextField
          margin="normal"
          required
          fullWidth
          {...register(name as Path<T>, option)}
          label={authInputLabel[name]}
          type={name === "mail" ? "email" : "password"}
        />
      ) : (
        <TextField
          margin="normal"
          required
          fullWidth
          {...register(name as Path<T>, authFormOptions[name])}
          label={authInputLabel[name]}
          autoComplete={name as string}
          type={name === "mail" ? "email" : "password"}
          autoFocus={name === "mail"}
        />
      )}
      {isSubmitted && <AuthAlertMessage error={error} />}
    </>
  );
}
