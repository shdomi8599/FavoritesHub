import Box from "@mui/material/Box";
import { FormEventHandler, ReactNode } from "react";

type Props = {
  submitEvent: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
};

export default function ModalForm({ submitEvent, children }: Props) {
  return (
    <Box
      component="form"
      onSubmit={submitEvent}
      noValidate
      sx={{ mt: 1, width: "90%" }}
    >
      {children}
    </Box>
  );
}
