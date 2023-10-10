import { Autocomplete, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type Props<T> = {
  data: T[];
  label?: string;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export default function SearchAutoBar<T>({
  label,
  value,
  setValue,
  data,
}: Props<T>) {
  // 핸들러
  const handleValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(e.target.value);
  };

  return (
    <Autocomplete
      disablePortal
      options={data}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          onChange={handleValue}
          value={value}
        />
      )}
    />
  );
}
