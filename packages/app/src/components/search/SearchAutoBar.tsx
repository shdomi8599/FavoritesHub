import { AutoBarItem } from "@/types";
import { Autocomplete, FilterOptionsState, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

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
  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
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
      disablePortal
      disabled={tags.length === 0}
      options={data}
      sx={{ width: 250 }}
      inputValue={inputValue}
      onInputChange={handleChange}
      filterOptions={filterOptions}
      isOptionEqualToValue={(option, value) => option === value}
      renderInput={(params) => <TextField {...params} label={label} />}
    />
  );
}
