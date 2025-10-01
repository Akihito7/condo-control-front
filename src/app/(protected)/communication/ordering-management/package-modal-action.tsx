"use client";

import React, { useEffect, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePickerWithHours } from "@/components/date-picker-with-hours";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Paperclip, FileText } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDelivery } from "@/api/create-delivery";
import { useUserContext } from "@/providers/use-user-context";
import { Apartment } from "@/api/fetch-apartaments";
import { Delivery } from "@/api/fetch-deliveries";
import { parseISO } from "date-fns";
import { updateDelivery } from "@/api/update-delivery";
import { markAsDelivered } from "@/api/mark-as-delivered";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PackageModalActionProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  apartaments: Apartment[] | undefined;
  deliverySelected: Delivery | undefined;
  setDeliverySelected: React.Dispatch<
    React.SetStateAction<Delivery | undefined>
  >;
  type: "create" | "edit";
}

const schema = z.object({
  apartment: z.string().min(1, "Apartment is required"),
  description: z.string().min(3, "Description is too short"),
  receivedDate: z.date(),
  attachment: z.any().optional(),
});

type PackageFormData = z.infer<typeof schema>;

export function PackageModalAction({
  isOpen,
  setIsOpen,
  apartaments,
  deliverySelected,
  setDeliverySelected,
  type = "create",
}: PackageModalActionProps) {
  const buttonCloseRef = useRef<HTMLButtonElement>(null);

  const { user } = useUserContext();

  const condominiumId = user.condominiumId;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PackageFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      apartment: "",
      description: "",
      receivedDate: new Date(),
      attachment: undefined,
    },
  });

  const selectedFiles = useWatch({
    control,
    name: "attachment",
  });

  async function handleFormSubmit(data: PackageFormData) {
    const formData = new FormData();
    formData.append("apartment", data.apartment);
    formData.append("description", data.description);
    formData.append("receivedDate", data.receivedDate.toISOString());
    formData.append("condominiumId", String(condominiumId));

    if (Array.isArray(data.attachment)) {
      data.attachment.forEach((file: File) => {
        formData.append("attachment", file);
      });
    }

    if (type === "create") {
      await handleCreateDelivery(formData);
    } else {
      await handleUpdateDelivery(formData);
    }

    buttonCloseRef.current?.click();
    reset();
  }

  const queryClient = useQueryClient();

  const { mutateAsync: handleCreateDelivery } = useMutation({
    mutationFn: (formData: FormData) => createDelivery({ formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
        exact: false,
      });
    },
  });

  const { mutateAsync: handleUpdateDelivery } = useMutation({
    mutationFn: async (formData: FormData) =>
      updateDelivery({ formData, deliveryId: deliverySelected!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["deliveries"],
        exact: false,
      });
    },
  });

  useEffect(() => {
    if (type === "edit") {
      const deliveryDateFormmated = deliverySelected?.pickedUpAt
        ? parseISO(deliverySelected.pickedUpAt)
        : undefined;
      const receveidDateFormmated = deliverySelected?.receivedAt
        ? parseISO(deliverySelected.receivedAt)
        : undefined;
      reset({
        apartment: deliverySelected?.apartmentId
          ? String(deliverySelected.apartmentId)
          : "",
        description: deliverySelected?.description,
        receivedDate: receveidDateFormmated,
      });
    } else {
      reset({
        apartment: "",
        description: "",
        receivedDate: new Date(),
        attachment: undefined,
      });
    }
  }, [type]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) {
          setDeliverySelected(undefined);
          reset({
            receivedDate: new Date(),
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Registrar Encomenda</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {" "}
            {type === "create" ? "Registrar Encomenda" : "Editar Encomenda"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da encomenda para registar.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 py-4"
          noValidate
        >
          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartment" className="text-right">
                Apartmento
              </Label>
              <Controller
                name="apartment"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione um apartamento." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {apartaments?.map((apartament) => (
                          <SelectItem value={String(apartament.id)}>
                            {apartament.apartmentNumber}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.apartment && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.apartment.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Descrição da entrega"
                    className="col-span-3"
                  />
                )}
              />
              {errors.description && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="receivedDate" className="text-right">
                Recebido
              </Label>
              <Controller
                name="receivedDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours date={value!} setDate={onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 mt-4">
                <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600">
                  <Paperclip />
                  Clique para adicionar documentos
                  <Controller
                    name="attachment"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          const fileArray = files ? Array.from(files) : [];
                          field.onChange(fileArray);
                        }}
                        className="hidden"
                      />
                    )}
                  />
                </label>

                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-4 rounded-md border border-gray-300 bg-gray-50 p-4 text-sm text-gray-800">
                    <p className="mb-2 font-semibold">
                      {selectedFiles.length} Arquivo
                      {selectedFiles.length > 1
                        ? "s Selecionados :"
                        : " Selecionado :"}
                    </p>
                    <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                      {selectedFiles.map((file: File, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 truncate"
                          title={file.name}
                        >
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="truncate">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" ref={buttonCloseRef} type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
