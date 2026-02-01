"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FilePlus, X } from "lucide-react";
import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { ChangeEvent, useRef, useState } from "react";

interface ModalAddAttachmentProps {
  onAddAttachments: (files: File[]) => Promise<void>;
}

export function ModalAddAttachment({
  onAddAttachments,
}: ModalAddAttachmentProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const buttonCloseRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  }

  function handleRemoveFile(index: number) {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  }

  async function handleConfirm(selectedFiles: File[]) {
    await onAddAttachments(selectedFiles);
    setSelectedFiles([]);
    buttonCloseRef.current?.click();
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setSelectedFiles([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Adicionar Anexos</Button>
      </DialogTrigger>
      <DialogContent
        className="
    w-screen h-screen max-w-none max-h-none rounded-none
    md:w-auto md:h-auto md:max-w-[600px] md:rounded-lg
    flex flex-col
  "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Adicionar Anexos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            ref={inputRef}
            className="hidden"
          />

          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2"
          >
            <FilePlus className="w-5 h-5" />
            Selecionar arquivos
          </Button>

          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md"
                >
                  <span className="text-sm truncate max-w-[80%]">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 flex justify-between">
          <DialogClose asChild>
            <Button ref={buttonCloseRef} variant="secondary">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              handleConfirm(selectedFiles);
            }}
            disabled={selectedFiles.length === 0}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Enviar anexos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
