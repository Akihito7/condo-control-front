import { api } from "@/services/api";

interface CreateUnitWorksProps {
  form: FormData;
}

export async function createUnitWorks({ form }: CreateUnitWorksProps) {
  const response = await api.post("structure/unit-works", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
