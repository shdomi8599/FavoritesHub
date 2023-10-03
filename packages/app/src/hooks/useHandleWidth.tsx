import { useEffect, useState } from "react";

export const useHandleWidth = () => {
  const [width, setWidth] = useState(0);

  // 이펙트
  useEffect(() => {
    const handleWidth = () => {
      setWidth(window.innerWidth);
    };
    handleWidth();
    window.addEventListener("resize", handleWidth);
    return () => window.removeEventListener("resize", handleWidth);
  }, []);

  return {
    width,
  };
};
