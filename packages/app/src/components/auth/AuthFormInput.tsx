import { LoginFormInput } from "@/types";
import { TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<LoginFormInput>;
  name: "mail" | "password";
}

const options = {
  mail: {
    required: true,
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "입력한 값이 이메일 형식과 일치하지 않습니다.",
    },
  },
  password: { required: true, maxLength: 20 },
};

const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export default function AuthFormInput({ register, name }: Props) {
  return (
    <TextField
      margin="normal"
      required
      fullWidth
      {...register(name, options[name])}
      label={capitalize(name)}
      autoComplete={name}
      type={name}
      autoFocus={name === "mail"}
    />
  );
}
