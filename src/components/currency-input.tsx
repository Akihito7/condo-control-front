"use client";

import Cleave from "cleave.js/react";
import "cleave.js/dist/addons/cleave-phone.br"; // caso queira outros formatos no futu

export function CurrencyInput({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          R$
        </span>
        <Cleave
          onChange={(event) => {
            const value = event.target.value;
            onChange(value);
          }}
          value={value}
          options={{
            numeral: true,
            numeralThousandsGroupStyle: "thousand",
            numeralDecimalMark: ",",
            delimiter: ".",
            rawValueTrimPrefix: true,
            numeralDecimalScale: 2,
          }}
          className="pl-10 pr-3 py-2 w-full border-2  rounded-lg focus:outline-none text-right focus:border-blue-500"
        />
      </div>
    </div>
  );
}
