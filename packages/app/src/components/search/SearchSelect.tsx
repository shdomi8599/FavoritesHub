import { SelectItem } from "@/types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

type Props = {
  label: string;
  selectValue: string;
  setSelectValue: Dispatch<SetStateAction<string>>;
  menuItems: SelectItem[];
};

export default function SearchSelect({
  label,
  menuItems,
  selectValue,
  setSelectValue,
}: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value as string);
  };
  return (
    <FormControl sx={{ width: 120 }}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={selectValue} onChange={handleChange}>
        {menuItems.map(({ label, value }) => (
          <MenuItem key={label} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
