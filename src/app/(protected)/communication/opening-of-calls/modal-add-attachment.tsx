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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAttachmentsOpeningCalls } from "@/api/add-attachment";
import { OpeningCall } from "@/api/get-opening-calls-records";
import { useUserContext } from "@/providers/use-user-context";

interface ModalAddAttachmentProps {
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openingRecordSelected: OpeningCall;
  setOpeningRecordSelectted: React.Dispatch<
    React.SetStateAction<OpeningCall | null>
  >;
}

export function ModalAddAttachment({
  open,
  setIsOpen,
  openingRecordSelected,
  setOpeningRecordSelectted,
}: ModalAddAttachmentProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUserContext();
  const condominiumId = user.condominiumId;
  const queryClient = useQueryClient();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  }

  async function handleConfirm() {
    await handleAddAttachments();
    setSelectedFiles([]);
    setIsOpen(false);
  }

  async function handleAddAttachments() {
    const formData = new FormData();

    formData.append("openingRecordId", String(openingRecordSelected.id));
    formData.append("condominiumId", String(condominiumId));

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("attachment", file);
      });
    }

    await addAttachment(formData);
  }

  function handleRemoveFile(index: number) {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  }

  const { mutateAsync: addAttachment, status: addAttachmentStatus } =
    useMutation({
      mutationFn: async (formData: FormData) =>
        addAttachmentsOpeningCalls({ formData }),
      onSuccess: (attachments) => {
        const newAttachments = attachments;
        setOpeningRecordSelectted((prev) => {
          if (prev) {
            return {
              ...prev,
              attachments: [...prev.attachments, ...newAttachments],
            };
          }
          return prev;
        });
        queryClient.invalidateQueries({
          queryKey: ["openingCallsRecords"],
          exact: false,
        });
      },
    });

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setSelectedFiles([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>Adicionar Anexos</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
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
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleConfirm}
            disabled={
              selectedFiles.length === 0 || addAttachmentStatus === "pending"
            }
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
