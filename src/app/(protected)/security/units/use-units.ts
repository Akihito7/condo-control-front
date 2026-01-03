import { useState } from "react";

export function useUnits() {
  const date = new Date();
  const [range, setRange] = useState({
    from: date,
    to: date,
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  return {
    range,
    setRange,
    modalIsOpen,
    setModalIsOpen,
  };
}
