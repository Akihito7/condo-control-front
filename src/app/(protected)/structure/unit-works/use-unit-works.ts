import { useState } from "react";

export function useUnitWorks() {
  const date = new Date();
  const [range, setRange] = useState({
    from: date,
    to: date,
  });

  return {
    range,
    setRange,
  };
}
