"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addResidentRequest } from "@/api/add-resident-request";
import { updateGenericRegister } from "@/api/update-generic.register";
import snakecaseKeys from "snakecase-keys";
import { DatePickerWithHours } from "@/components/date-picker-with-hours";
import { subHours } from "date-fns";

const residentSchema = z.object({
  apartament_id: z.string().min(1, "Selecione o apartamento"),
  status_id: z.string().min(1, "Selecione o status"),
  gravity_id: z.string().min(1, "Selecione a gravidade"),
  description: z.string().min(1, "Descrição obrigatória"),
  observation: z.string().optional(),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
  attachments: z.any().optional(),
});

export type ResidentFormData = z.infer<typeof residentSchema>;

type Option = { id: number; name: string };

export function ModalActionResident({
  apartments,
  statusOptions,
  gravityOptions,
  isOpen,
  setModalIsOpen,
  children,
  requestSelected,
  setRequestSelected,
  type,
}: {
  apartments?: { id: number; apartmentNumber: string }[];
  statusOptions?: Option[];
  gravityOptions?: Option[];
  isOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  setRequestSelected: React.Dispatch<React.SetStateAction<any>>;
  requestSelected: any;
  type: "create" | "edit";
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ResidentFormData>({
    resolver: zodResolver(residentSchema),
  });

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const filesArray = Array.from(files);

    if (filesArray.length + selectedFiles.length > 5) {
      alert("Máximo de 5 arquivos permitidos");
      return;
    }

    const updatedFiles = [...selectedFiles, ...filesArray];
    setSelectedFiles(updatedFiles);
    setValue("attachments", updatedFiles as any);
  }

  const queryClient = useQueryClient();

  const { mutateAsync: handleAddResidentRequest } = useMutation({
    mutationFn: addResidentRequest,
  });

  const { mutateAsync: handleUpdateRegister } = useMutation({
    mutationFn: updateGenericRegister<any>,
  });

  async function onSubmit(data: ResidentFormData) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "attachments" && value?.length) {
        Array.from(value).forEach((file: any) =>
          formData.append("attachments", file),
        );
        return;
      }

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (type === "create") {
      await handleAddResidentRequest(formData);
    } else {
      await handleUpdateRegister({
        registerId: requestSelected.id,
        tableName: "resident_calls",
        data: snakecaseKeys(data, { deep: true }),
      });
    }

    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["resident-calls"],
    });

    closeRef.current?.click();
    reset();
    setSelectedFiles([]);
  }

  useEffect(() => {
    if (requestSelected) {
      const startDateFormatted = requestSelected.startDate
        ? subHours(new Date(requestSelected.startDate), 3)
        : undefined;

      const endDateFormatted = requestSelected.endDate
        ? subHours(new Date(requestSelected.endDate), 3)
        : undefined;
      reset({
        apartament_id: requestSelected.apartamentId.toString(),
        observation: requestSelected.observation,
        description: requestSelected.description,
        status_id: requestSelected.statusId.toString(),
        gravity_id: requestSelected.gravityId.toString(),
        start_date: startDateFormatted,
        end_date: endDateFormatted,
      });
    }
  }, [requestSelected]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset({
            apartament_id: "",
            attachments: [],
            description: "",
            gravity_id: "",
            observation: "",
            status_id: "",
          });
          setRequestSelected(undefined);
        }
        setModalIsOpen(open);
        setSelectedFiles([]);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Abrir Chamado</Button>
      </DialogTrigger>

      <DialogContent
        className="
    w-screen h-screen max-w-none max-h-none rounded-none
    md:w-auto md:h-auto md:max-w-[600px] md:rounded-lg
    flex flex-col
  "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">Criar Solicitação</DialogTitle>
          <DialogDescription>Preencha os dados abaixo</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          encType="multipart/form-data"
        >
          {/* Apartamento */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Apartamento</Label>
            <div className="col-span-3">
              <Controller
                name="apartament_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {apartments?.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.apartmentNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <div className="col-span-3">
              <Controller
                name="status_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions?.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Gravidade */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Gravidade</Label>
            <div className="col-span-3">
              <Controller
                name="gravity_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {gravityOptions?.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Início</Label>
            <div className="col-span-3">
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DatePickerWithHours
                    date={field.value}
                    setDate={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Fim</Label>
            <div className="col-span-3">
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <DatePickerWithHours
                    date={field.value}
                    setDate={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Descrição</Label>
            <Textarea {...register("description")} className="col-span-3" />
          </div>

          {/* Observação */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Observação</Label>
            <Textarea {...register("observation")} className="col-span-3" />
          </div>

          {/* Anexos */}
          {type === "create" && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Documentos</Label>

              <div className="col-span-3 space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-md h-[90px] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition"
                >
                  <span className="text-xl">📎</span>
                  <span className="text-sm text-muted-foreground">
                    Clique para selecionar documentos (máx. 5)
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                />

                {selectedFiles.length > 0 && (
                  <ul className="text-sm space-y-1">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-muted px-3 py-1 rounded"
                      >
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          className="text-red-500 text-xs"
                          onClick={() => {
                            const updated = selectedFiles.filter(
                              (_, i) => i !== index,
                            );
                            setSelectedFiles(updated);
                            setValue("attachments", updated as any);
                          }}
                        >
                          Remover
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button ref={closeRef} variant="ghost">
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
