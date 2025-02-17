import { ModalButton, ModalForm, ModalTitle } from "@/components/modal";
import { ImportFavorite } from "@/types";
import { Box, Container, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  isLoading: boolean;
  favoriteImport: (fileData: ImportFavorite[]) => Promise<void>;
}

export default function ImportForm({ isLoading, favoriteImport }: Props) {
  const { handleSubmit } = useForm();
  const [fileData, setFileData] = useState<ImportFavorite[]>(null!);
  const [error, setError] = useState<string>(null!);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = JSON.parse(e.target?.result as string);

        if (!Array.isArray(result) || !result.every((item) => item.address)) {
          throw new Error("파일 형식이 올바르지 않습니다.");
        }

        setFileData(result);
        setError(null!);
      } catch (err) {
        setError("올바른 JSON 파일을 업로드해주세요.");
        setFileData(null!);
      }
    };

    reader.readAsText(file);
  };

  const onSubmit = async () => {
    if (!fileData) {
      setError("JSON 파일을 업로드해주세요.");
      return;
    }

    try {
      await favoriteImport(fileData);
    } catch (error) {
      setError("파일 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <ModalTitle name="즐겨찾기 삽입" />
        <ModalForm submitEvent={handleSubmit(onSubmit)}>
          <input type="file" accept=".json" onChange={handleFileUpload} />
          {error && <Typography color="error">{error}</Typography>}
          {fileData && (
            <Typography color="primary">
              파일이 정상적으로 로드되었습니다.
            </Typography>
          )}
          <ModalButton disabled={isLoading || !fileData}>삽입하기</ModalButton>
        </ModalForm>
      </Box>
    </Container>
  );
}
