import { useState } from "react";

export const useHandler = (initialBoolean: boolean) => {
  const [isBoolean, setisBoolean] = useState(initialBoolean);

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
