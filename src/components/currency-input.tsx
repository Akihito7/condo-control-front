"use client";

import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.br";


export function CurrencyInput({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {

  const displayValue =
    value && value.includes(".") ? value.replace(".", ",") : value;

  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          R$
        </span>
        <Cleave
          onChange={(event) => {
            const rawValue = event.target.rawValue; // sempre número puro → "24956.35"
            onChange(rawValue); // salva cru no estado/banco
          }}
          value={displayValue} // mostra formatado no input
          options={{
            numeral: true,
            numeralThousandsGroupStyle: "thousand",
            numeralDecimalMark: ",", // vírgula como decimal
            delimiter: ".", // ponto como separador de milhar
            numeralDecimalScale: 2,
          }}
          className="pl-10 pr-3 py-2 w-full border-2 h-10 rounded-lg focus:outline-none text-right focus:border-blue-500"
        />
      </div>
    </div>
  );
}
