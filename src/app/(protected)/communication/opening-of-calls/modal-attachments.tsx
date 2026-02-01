"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash, FastForward } from "lucide-react";
import { OpeningCall } from "@/api/get-opening-calls-records";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { downloadAttchment } from "@/api/download-attachment";
import { useState } from "react";
import { ModalAddAttachment } from "./modal-add-attachment";
import { deleteAttachmentOpeningCalls } from "@/api/delete-attachment-opening-calls";
import { addAttachmentsOpeningCalls } from "@/api/add-attachment";
import { useUserContext } from "@/providers/use-user-context";

interface Attachment {
  id: number;
  originalName: string;
  path: string;
}

interface ModalAnexosProps {
  attachments: Attachment[];
  open: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openingRecordSelected: OpeningCall;
  setOpeningRecordSelectted: React.Dispatch<
    React.SetStateAction<OpeningCall | null>
  >;
}

export function ModalAttachments({
  attachments,
  setOpeningRecordSelectted,
  setIsOpen,
  openingRecordSelected,
}: ModalAnexosProps) {
  const { user } = useUserContext();
  const { condominiumId } = user;

  const { mutateAsync: getLinkAttachment } = useMutation({
    mutationFn: async (fullPath: string) => downloadAttchment({ fullPath }),
  });

  const queryClient = useQueryClient();

  const {
    mutateAsync: handleDeleteAttachment,
    status: deleteAttachmentStatus,
  } = useMutation({
    mutationFn: async (attachmentId: number) =>
      deleteAttachmentOpeningCalls({ attachmentId }),
    onSuccess: (attachmentId) => {
      setOpeningRecordSelectted((prev) => {
        if (prev) {
          return {
            ...prev,
            attachments: prev.attachments.filter(
              (attachment) => attachment.id !== attachmentId,
            ),
          };
        }

        return null;
      });

      queryClient.invalidateQueries({
        queryKey: ["openingCallsRecords"],
        exact: false,
      });
    },
  });

  async function handleDownloadAttachment(fullPath: string) {
    try {
      const signedUrl = await getLinkAttachment(fullPath);
      const fileName = fullPath.split("/").pop() || "download";
      const response = await fetch(signedUrl.publicUrl);
      if (!response.ok) throw new Error("Erro ao baixar arquivo");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      alert("Erro ao baixar arquivo");
    }
  }

  async function handleAddAttachments(files: File[]) {
    const formData = new FormData();

    formData.append("openingRecordId", String(openingRecordSelected.id));
    formData.append("condominiumId", String(condominiumId));

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("attachment", file);
      });
    }

    await addAttachment(formData);
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
      open={true}
      onOpenChange={(value) => {
        if (!value) {
          setOpeningRecordSelectted(null);
          setIsOpen(false);
        }
      }}
    >
      <DialogContent
        className="
    w-screen h-screen max-w-none max-h-none rounded-none
    md:w-auto md:h-auto md:max-w-[600px] md:rounded-lg
    flex flex-col
  "
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Anexos do chamado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {attachments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum anexo encontrado.
            </p>
          ) : (
            attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-md hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <FileText className="text-blue-500 w-7 h-7 flex-shrink-0" />
                  <span className="text-base text-gray-700 truncate max-w-[320px]">
                    {att.originalName}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-100"
                    onClick={() => handleDownloadAttachment(att.path)}
                  >
                    <Download className="w-12 h-12 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-100"
                    onClick={() => handleDeleteAttachment(att.id)}
                    disabled={deleteAttachmentStatus === "pending"}
                  >
                    <Trash className="w-12 h-12 text-red-600" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter className="pt-6">
          <DialogClose>
            <Button variant="outline" size="lg" className="cursor-pointer">
              Fechar
            </Button>
          </DialogClose>

          <ModalAddAttachment onAddAttachments={handleAddAttachments} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
