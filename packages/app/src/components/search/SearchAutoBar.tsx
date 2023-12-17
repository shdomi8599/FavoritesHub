import { AutoBarItem } from "@/types";
import { Autocomplete, FilterOptionsState, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type Props<T> = {
  data: T[];
  tags: string[];
  label?: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
};

export default function SearchAutoBar<T extends AutoBarItem>({
  tags,
  label,
  data,
  inputValue,
  setInputValue,
}: Props<T>) {
  const handleChange = (event: ChangeEvent<{}>, newValue: string) => {
    if (tags.length === 0) {
      setInputValue("");
      return;
    }
    setInputValue(newValue);
  };

  const filterOptions = (options: T[], state: FilterOptionsState<T>) => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(state.inputValue.toLowerCase()),
    );
    return filtered;
  };

  return (
    <Autocomplete
      key={tags.length}
      disablePortal
      disabled={tags.length === 0}
      options={data}
      sx={{ width: 250 }}
      inputValue={inputValue}
      onInputChange={handleChange}
      filterOptions={filterOptions}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
