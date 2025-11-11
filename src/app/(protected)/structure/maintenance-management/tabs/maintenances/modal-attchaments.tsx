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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addAttachmentTransactionEntry } from "@/api/add-attachment-transaction-entry";
import { useUserContext } from "@/providers/use-user-context";
import { deleteAttchmentTransacationEntry } from "@/api/delete-attchment-transaction-entry";
import { fetchSupabasePublicUrl } from "@/api/fetch-supabase-public-url";
import React from "react";
import { ModalAddAttachment } from "@/app/(protected)/communication/opening-of-calls/modal-add-attachment";
import { DayEvent } from "@/api/fetch-calendar-maintenances";
import { Asset } from "@/api/fetch-maintenance-management-assets";
import { fetchMaintenanceAssetsAttachments } from "@/api/fetch-maintenance-assets-attachments";
import { deleteMaintenanceAssetsAttachment } from "@/api/delete-maintenance-assets-attachment";
import { addAttachmentMaintenanceAsset } from "@/api/add-attachment-maintenance-asset";
import { Maintenance } from "@/api/fetch-maintenances";
import { fetchMaintenanceAttachments } from "@/api/fetch-maintenance-attachments";
import { addAttachmentMaintenance } from "@/api/add-attachment-maintenance";
import { deleteMaintenanceAttachment } from "@/api/delete-maintenance-attachment";

interface ModalAttachmentsProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  maintenanceSelected: Maintenance | null;
  setMaintenanceSelected: React.Dispatch<
    React.SetStateAction<Maintenance | null>
  >;
}
export function ModalAttachments({
  maintenanceSelected,
  setMaintenanceSelected,
  isOpen,
  setIsOpen,
}: ModalAttachmentsProps) {
  const query = useQueryClient();
  const { user } = useUserContext();

  const { data: attachments, status } = useQuery({
    queryKey: ["attachments", maintenanceSelected?.id],
    queryFn: () => fetchMaintenanceAttachments(maintenanceSelected!.id),
    enabled: !!maintenanceSelected?.id,
  });

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

  const { mutateAsync: handleDeleteAttchment } = useMutation({
    mutationFn: (attachmentId: number) =>
      deleteMaintenanceAttachment(attachmentId),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["attachments", maintenanceSelected?.id],
      });
    },
  });

  const { mutateAsync: addAttachments } = useMutation({
    mutationFn: (form: FormData) => addAttachmentMaintenance(form),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["attachments", maintenanceSelected?.id],
      });
    },
  });

  async function handleAddAttachments(files: File[]) {
    const form = new FormData();
    form.append("maintenanceId", String(maintenanceSelected?.id));
    form.append("condominiumId", String(user.condominiumId));

    if (files.length > 0) {
      files.forEach((file) => {
        form.append("attachment", file);
      });
    }

    await addAttachments(form);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md w-full rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Anexos
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {!attachments ||
              (attachments.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  Nenhum anexo disponível.
                </p>
              ))}

            {attachments?.map((file: any) => (
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
