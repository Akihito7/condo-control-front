import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ModalGalerryProps {
  imageUrls: string[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BASE_URL =
  "https://vtupybmxylkunzpgxwex.supabase.co/storage/v1/object/public/";

export function ModalGallery({
  imageUrls,
  isOpen,
  setIsOpen,
}: ModalGalerryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative flex items-center gap-4 z-60"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-white p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
          onClick={() => {
            const prevImageIndex = currentIndex - 1;
            if (prevImageIndex < 0) {
              setCurrentIndex(imageUrls.length - 1);
            } else {
              setCurrentIndex((prev) => prev - 1);
            }
          }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={`${BASE_URL}${imageUrls[currentIndex]}`}
          alt="Imagem em destaque"
          className="max-h-[95vh] max-w-screen"
        />

        <button
          className="text-white p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
          onClick={() => {
            const nextImageIndex = currentIndex + 1;
            if (nextImageIndex > imageUrls.length - 1) {
              setCurrentIndex(0);
            } else {
              setCurrentIndex((prev) => prev + 1);
            }
          }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
