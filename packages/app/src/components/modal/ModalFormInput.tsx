import { TextField } from "@mui/material";
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import ModalAlertMessage from "./ModalAlertMessage";

interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: string;
  isSubmitted: boolean;
  error?: FieldError;
  option?: RegisterOptions;
  label: string;
  type?: string;
  autoFocus?: boolean;
  required?: boolean;
}

export default function ModalFormInput<T extends FieldValues>({
  register,
  name,
  isSubmitted,
  error,
  option,
  label,
  type,
  autoFocus,
  required = true,
}: Props<T>) {
  return (
    <>
      <TextField
        margin="normal"
        required={required}
        fullWidth
        {...register(name as Path<T>, option)}
        label={label}
        type={type}
        autoFocus={autoFocus}
      />
      {isSubmitted && <ModalAlertMessage error={error} />}
    </>
  );
}
