import { ModalButton, ModalForm, ModalTitle } from "@/components/modal";
import { dragFavoriteDataState } from "@/states";
import { FavoriteAddFormInput } from "@/types";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";

interface Props {
  isLoading: boolean;
  favoriteExport: (checkedItems: boolean[]) => Promise<void>;
}

export default function ExportForm({ isLoading, favoriteExport }: Props) {
  const dragFavoriteData = useRecoilValue(dragFavoriteDataState);

  const formData = dragFavoriteData.map(({ address, favoriteName }) => {
    const domain = address.split("https://")[1].split("/")[0];
    if (favoriteName) {
      return { label: `[${favoriteName}] ${domain}` };
    }
    return { label: domain };
  });

  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(formData.length).fill(true),
  );

  const handleCheckboxChange = (index: number) => {
    setCheckedItems((prev) => {
      const newCheckedItems = [...prev];
      newCheckedItems[index] = !newCheckedItems[index];
      return newCheckedItems;
    });
  };

  const { handleSubmit } = useForm<FavoriteAddFormInput>();
  const onSubmit = async () => {
    await favoriteExport(checkedItems);
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
        <ModalTitle name="즐겨찾기 추출" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <FormGroup sx={{ pt: 1 }}>
            <FormLabel>추출할 즐겨찾기 선택</FormLabel>
            {formData.map(({ label }, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                }
                label={label}
              />
            ))}
          </FormGroup>
          <ModalButton disabled={isLoading}>추출하기</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
