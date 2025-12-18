import { useState } from "react";

export function useUnits() {
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
