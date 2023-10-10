import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type Props = {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
};

export default function SearchBar({ value, setValue }: Props) {
  const handleValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValue(e.target.value);
  };
  return (
    <TextField
      id="search"
      type="search"
      label="Search"
      value={value}
      onChange={handleValue}
      sx={{ width: 300 }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
