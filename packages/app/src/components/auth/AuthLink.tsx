import { AuthModalState, AuthProps } from "@/types";
import Link from "@mui/material/Link";

interface Props extends AuthProps {
  linkName: AuthModalState;
}

const linkData: { [key: string]: string } = {
  login: "로그인",
  password: "비밀번호 찾기",
  signUp: "회원가입",
};

export default function AuthLink({ handleAuthModal, linkName }: Props) {
  return (
    <Link
      onClick={() => handleAuthModal(linkName)}
      sx={LinkStyle}
      variant="body2"
    >
      {linkData[linkName]}
    </Link>
  );
}

const LinkStyle = {
  cursor: "pointer",
};
