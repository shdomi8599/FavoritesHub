import { useEffect, useRef } from "react";

export const useOutSideRef = (handler: () => void) => {
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (!ref.current?.contains(event.target)) {
        handler();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handler]);

  return { ref };
};
