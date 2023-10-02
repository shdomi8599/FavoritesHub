import { barHeightState } from "@/states";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";

export const useBarHeight = () => {
  const ref = useRef<HTMLDivElement>(null!);

  const [barHeight, setBarHeight] = useRecoilState(barHeightState);

  useEffect(() => {
    const handleheight = () => {
      setBarHeight(ref.current.offsetHeight);
    };
    handleheight();
    window.addEventListener("resize", handleheight);
    return () => window.removeEventListener("resize", handleheight);
  }, []);

  return {
    ref,
    barHeight,
  };
};
