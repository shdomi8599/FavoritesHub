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

const options = {
  mail: {
    required: true,
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "입력한 값이 이메일 형식과 일치하지 않습니다.",
    },
  },
  password: {
    required: true,
    pattern: {
      value: /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
      message:
        "비밀번호는 최소 8글자 이상이어야 하며, 대문자와 특수문자를 적어도 1개 이상 포함해야 합니다.",
    },
  },
};

const labelName = {
  mail: "이메일",
  password: "비밀번호",
};

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
        {...register(name, options[name])}
        label={labelName[name]}
        autoComplete={name}
        type={name}
        autoFocus={name === "mail"}
      />
      {isSubmitted && <AuthAlertMessage error={error} />}
    </>
  );
}
