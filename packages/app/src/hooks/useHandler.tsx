import { useState } from "react";

export const useHandler = () => {
  const [isBoolean, setisBoolean] = useState(false);

  const handleBoolean = () => {
    setisBoolean(!isBoolean);
  };

  const offBoolean = () => {
    if (isBoolean) {
      setisBoolean(false);
    }
  };

  return {
    isBoolean,
    handleBoolean,
    setisBoolean,
    offBoolean,
  };
};
