import { isDashboardState } from "@/states";
import { useRecoilState } from "recoil";

export const useDashboard = () => {
  const [isDashboard, setIsDashboard] = useRecoilState(isDashboardState);

  const handleIsDashboard = () => {
    setIsDashboard(!isDashboard);
  };
  return {
    handleIsDashboard,
    isDashboard,
  };
};
