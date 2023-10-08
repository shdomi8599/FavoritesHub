import { styled } from "@mui/material";
import { FieldError } from "react-hook-form";

interface Props {
  error?: FieldError;
}

export default function ModalAlertMessage({ error }: Props) {
  return <AlertMessage role="alert">{error?.message}</AlertMessage>;
}

const AlertMessage = styled("span")(({}) => ({
  color: "red",
}));
