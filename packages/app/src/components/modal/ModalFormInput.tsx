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
}

export default function ModalFormInput<T extends FieldValues>({
  register,
  name,
  isSubmitted,
  error,
  option,
  label,
}: Props<T>) {
  return (
    <>
      <TextField
        margin="normal"
        required
        fullWidth
        {...register(name as Path<T>, option)}
        label={label}
      />
      {isSubmitted && <ModalAlertMessage error={error} />}
    </>
  );
}
