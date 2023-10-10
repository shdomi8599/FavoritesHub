import { SearchTags } from "@/const";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

type Props = {
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
};

export default function SearchTag({ tags, setTags }: Props) {
  const isAll = tags.includes("전체");

  const handleChange = (event: SelectChangeEvent<typeof tags>) => {
    const {
      target: { value },
    } = event;
    const isValueAll = value.includes("전체");
    if (isValueAll) {
      return setTags([...SearchTags]);
    }
    if (!isValueAll && isAll) {
      return setTags([]);
    }
    setTags(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl sx={{ m: 1, width }}>
      <InputLabel>태그</InputLabel>
      <Select
        multiple
        value={tags}
        onChange={handleChange}
        input={<OutlinedInput label="태그" />}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
      >
        {isAll
          ? ["전체"].map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={tags.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))
          : SearchTags.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={tags.indexOf(name) > -1} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
      </Select>
    </FormControl>
  );
}

const width = 130;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: width,
    },
  },
};
