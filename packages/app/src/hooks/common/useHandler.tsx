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

  const onBoolean = () => {
    setisBoolean(true);
  };

  return {
    isBoolean,
    handleBoolean,
    setisBoolean,
    onBoolean,
    offBoolean,
  };
};
