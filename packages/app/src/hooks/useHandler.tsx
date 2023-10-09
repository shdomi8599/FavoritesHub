import { useState } from "react";

export const useHandler = (initialBoolean: boolean) => {
  const [isBoolean, setisBoolean] = useState(initialBoolean);

  const handleBoolean = () => {
    console.log(2);
    setisBoolean(!isBoolean);
  };

  const offBoolean = () => {
    console.log(1);
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
