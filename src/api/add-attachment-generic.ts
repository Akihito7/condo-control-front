import { api } from "@/services/api";

interface AddAttachemtGenericProps {
  form: FormData;
  relatedType: string;
  relatedId: number;
}
export async function addAttachemtGeneric({
  relatedId,
  relatedType,
  form,
}: AddAttachemtGenericProps) {
  const response = await api.post(
    `structure/attachments/${relatedType}/${relatedId}`,
    form
  );
  return response.data;
}
