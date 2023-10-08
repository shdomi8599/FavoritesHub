import { putUpdatePassword } from "@/api/auth";
import ModalForm from "@/components/modal/ModalForm";
import { userMailState } from "@/states";
import { updatePasswordFormInput } from "@/types";
import { successAlert } from "@/util";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { SubmitHandler, useForm } from "react-hook-form";
import { SetterOrUpdater, useRecoilValue } from "recoil";

interface Props {
  handleClose: () => void;
  setUserMail: SetterOrUpdater<string>;
}

export default function AddForm({ handleClose, setUserMail }: Props) {
  const userMail = useRecoilValue(userMailState);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<updatePasswordFormInput>();

  const onSubmit: SubmitHandler<updatePasswordFormInput> = async (data) => {
    const { password } = data;
    const { message } = await putUpdatePassword(userMail, password);

    if (message === "success") {
      setUserMail("");
      handleClose();
      successAlert("재설정이 완료되었습니다.", "비밀번호 재설정");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ModalForm submitEvent={handleSubmit(onSubmit)}>zzz</ModalForm>
      </Box>
    </Container>
  );
}
