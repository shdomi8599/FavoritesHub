import { useState } from "react";

export const useHandleOpen = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return {
    isOpen,
    handleOpen,
    setIsOpen,
  };
};
