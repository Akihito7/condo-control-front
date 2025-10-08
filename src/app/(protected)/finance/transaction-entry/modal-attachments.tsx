"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, Download, FileText } from "lucide-react";
import { Attachment, FinancialRecord } from "@/api/fetch-financial-records";
import { ModalAddAttachment } from "../../communication/opening-of-calls/modal-add-attachment";
import { useMutation } from "@tanstack/react-query";
import { addAttachmentTransactionEntry } from "@/api/add-attachment-transaction-entry";
import { useUserContext } from "@/providers/use-user-context";
import { deleteAttchmentTransacationEntry } from "@/api/delete-attchment-transaction-entry";
import { fetchSupabasePublicUrl } from "@/api/fetch-supabase-public-url";

interface ModalAttachmentsProps {
  transactionSelected: FinancialRecord | undefined;
  attachments: Attachment[] | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTransactionSelected: React.Dispatch<
    React.SetStateAction<FinancialRecord | undefined>
  >;
}

export function ModalAttachments({
  isOpen,
  setIsOpen,
  attachments,
  transactionSelected,
  setTransactionSelected,
}: ModalAttachmentsProps) {
  const { user } = useUserContext();

  const { mutateAsync: addAttachments } = useMutation({
    mutationFn: (form: FormData) => addAttachmentTransactionEntry(form),
    onSuccess: (newAttachment) => {
      if (newAttachment) {
        const currentAttachments = transactionSelected?.attachments ?? [];
        const newAttachments = [...newAttachment, ...currentAttachments];
        setTransactionSelected((prev) => {
          if (prev) {
            return {
              ...prev,
              attachments: newAttachments,
            };
          }
          return undefined;
        });
      }
    },
  });

  const { mutateAsync: handleDeleteAttchment } = useMutation({
    mutationFn: (fileId: number) => deleteAttchmentTransacationEntry(fileId),
    onSuccess: (fileId: number) => {
      const attachmentsFiltered =
        transactionSelected?.attachments.filter(
          (attachment) => attachment.id !== fileId
        ) ?? [];

      setTransactionSelected((prev) => {
        if (!prev) return undefined;
        return {
          ...prev,
          attachments: attachmentsFiltered,
        };
      });
    },
  });

  async function handleAddAttachments(files: File[]) {
    const form = new FormData();
    form.append("transactionId", String(transactionSelected?.id));
    form.append("condominiumId", String(user.condominiumId));

    if (files.length > 0) {
      files.forEach((file) => {
        form.append("attachment", file);
      });
    }

    await addAttachments(form);
  }

  async function handleDownloadAttachment(attachment: Attachment) {
    const publicUrl = await fetchSupabasePublicUrl(attachment.path);
    if (!publicUrl) return;

    const response = await fetch(publicUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.originalName || "arquivo.svg";
    link.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md w-full rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Anexos do chamado
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {!attachments ||
              (attachments.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Nenhum anexo disponível.
                </p>
              ))}

            {attachments?.map((file) => (
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-100"
                    onClick={async () => {
                      await handleDeleteAttchment(file.id);
                    }}
                  >
                    <Trash className="w-12 h-12 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
            <ModalAddAttachment onAddAttachments={handleAddAttachments} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
