import { AuthModalState } from "@/types";
import { Button } from "@mui/material";

interface Props {
  name: AuthModalState;
}

const buttonData: { [key: string]: string } = {
  login: "로그인",
  password: "비밀번호 찾기",
  signUp: "회원가입",
};

export default function AuthButton({ name }: Props) {
  return (
    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
      {buttonData[name]}
    </Button>
  );
}
