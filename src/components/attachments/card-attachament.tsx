import { File } from "@/api/fetch-attachement";
import { Download, FileText, Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAttachement } from "@/api/delete-attachament";
import { useRef } from "react";
import { fetchSupabasePublicUrl } from "@/api/fetch-supabase-public-url";

interface CardAttachentProps {
  file: File;
}

export function CardAttachement({ file }: CardAttachentProps) {
  const queryClient = useQueryClient();

  const { mutateAsync: mutate } = useMutation({
    mutationFn: deleteAttachement,
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["attachments"],
      });
    },
  });

  async function handleDeleteAttachment() {
    await mutate(file.id);
  }

  async function handleDownloadAttachment(attachment: File) {
    const publicUrl = await fetchSupabasePublicUrl(attachment.path);
    if (!publicUrl) return;

    const response = await fetch(publicUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.originalName || "arquivo.svg";
    link.click();

    window.URL.revokeObjectURL(url)
  }

  return (
    <div
      key={file.id}
      className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-md hover:shadow-md transition"
    >
      <div className="flex items-center gap-4 overflow-hidden">
        <FileText className="text-blue-500 w-7 h-7 flex-shrink-0" />
        <span className="text-base text-gray-700 truncate max-w-[320px]">
          {file.originalName}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-blue-100"
          onClick={() => handleDownloadAttachment(file)}
        >
          <Download className="w-12 h-12 text-blue-600" />
        </Button>
        <DialogDeleteFile onConfirm={handleDeleteAttachment}>
          <Button variant="ghost" size="icon" className="hover:bg-red-100">
            <Trash className="w-12 h-12 text-red-600" />
          </Button>
        </DialogDeleteFile>
      </div>
    </div>
  );
}

interface DialogDeleteFileProps {
  onCancel?(): void;
  onConfirm?(): void;
  children: React.ReactNode;
}

function DialogDeleteFile({
  onCancel,
  onConfirm,
  children,
}: DialogDeleteFileProps) {
  const buttonCloseRef = useRef<HTMLButtonElement>(null);

  function handleCloseDialog() {
    buttonCloseRef.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza que deseja deletar?</DialogTitle>
        </DialogHeader>

        <div className="ml-auto space-x-2">
          <DialogClose asChild ref={buttonCloseRef}>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm?.();
              handleCloseDialog();
            }}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
