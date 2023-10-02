import { DashboardBarHeightState } from "@/states";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

export const useDashboardBarHeight = () => {
  const ref = useRef<HTMLDivElement>(null!);

  const [dashboardBarHeight, setDashboardBarHeight] = useRecoilState(
    DashboardBarHeightState
  );

  useEffect(() => {
    const handleheight = () => {
      setDashboardBarHeight(ref.current.offsetHeight);
    };
    handleheight();
    window.addEventListener("resize", handleheight);
    return () => window.removeEventListener("resize", handleheight);
  }, []);

  return {
    ref,
    dashboardBarHeight,
  };
};
