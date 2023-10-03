import { useState } from "react";

export const useHandleOpen = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const offContent = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return {
    isOpen,
    handleOpen,
    setIsOpen,
    offContent,
  };
};
