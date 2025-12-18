import { useState } from "react";

export function useResidentRequests() {
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
