import {
  fetchAttachment,
  File as FileCondo,
} from "@/api/fetch-attachement";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CardAttachement } from "./card-attachament";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { ModalAddAttachment } from "./modal-add-attachment";
import { addAttachemtGeneric } from "@/api/add-attachment-generic";
import { fetchSupabasePublicUrl } from "@/api/fetch-supabase-public-url";

interface ModalAttchamentProps {
  children: React.ReactNode;
  relatedType: string;
  relatedId: number;
}
export function ModalAttchament({
  relatedId,
  relatedType,
  children,
}: ModalAttchamentProps) {
  const queryClient = useQueryClient();

  const { data: attachments } = useQuery({
    queryKey: [relatedId, relatedType, "attachments"],
    queryFn: ({ queryKey: [relatedId, relatedType] }) =>
      fetchAttachment({
        relatedId: relatedId as number,
        relatedType: relatedType as string,
      }),
  });

  const { mutateAsync: mutate } = useMutation({
    mutationFn: addAttachemtGeneric,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [relatedId, relatedType, "attachments"],
      });
    },
  });

  async function handleAddAttachment(files: File[]) {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("attachment", file);
    });

    mutate({ form: formData, relatedId, relatedType });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>Anexos</DialogHeader>

        <div>
          {attachments &&
            attachments.length > 0 &&
            attachments.map((attachment: FileCondo) => (
              <CardAttachement file={attachment} />
            ))}

          {attachments?.length === 0 && <span>Sem documentos</span>}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>

          <ModalAddAttachment onAddAttachments={handleAddAttachment} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
