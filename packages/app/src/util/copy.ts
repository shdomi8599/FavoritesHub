import { successToast } from ".";

export const copyURL = (address: string) => {
  navigator.clipboard.writeText(address);
  successToast("주소가 복사되었습니다.");
};
