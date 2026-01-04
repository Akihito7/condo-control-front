"use client";

import React, { useRef } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/date-picker";
import { TrashIcon } from "lucide-react";
import { Apartment } from "@/api/fetch-apartaments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnitWorks } from "@/api/create-unit-works";

const workOrderSchema = z.object({
  apartment_id: z.string().min(1, "Selecione o apartamento"),
  status_id: z.string().min(1, "Selecione o status"),
  forecast_date: z.date(),
  description: z.string().min(1, "Descrição obrigatória"),
  has_art_rrt: z.boolean(),
  observations: z.string().optional(),
  attachments: z.any().optional(),

  employees: z.array(
    z.object({
      full_name: z.string().min(1, "Nome obrigatório"),
      cpf: z.string().min(11, "CPF inválido").max(14, "CPF inválido"),
    })
  ),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

export function ModalActionMaintenance({
  apartments,
  statusOptions,
}: {
  apartments?: Apartment[];
  statusOptions?: { id: number; name: string }[];
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      has_art_rrt: false,
      employees: [{ full_name: "", cpf: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  const employees = watch("employees");

  const { mutateAsync: handleCreateUnitWorks } = useMutation({
    mutationFn: (form: FormData) => createUnitWorks({ form }),
  });

  const queryClient = useQueryClient();

  async function onSubmit(data: WorkOrderFormData) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "employees") {
        formData.append("employees", JSON.stringify(value));
        return;
      }

      if (key === "attachments" && value?.length) {
        Array.from(value).forEach((file: any) =>
          formData.append("attachments", file)
        );
        return;
      }

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, String(value));
      }
    });
    await handleCreateUnitWorks(formData);
    closeRef.current?.click();
    reset();
    setSelectedFiles([]);
    queryClient.invalidateQueries({
      exact: false,
      queryKey: ["works"],
    });
  }

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

  return (
    <Dialog onOpenChange={(open) => !open && reset()}>
      <DialogTrigger asChild>
        <Button variant="outline">Nova Solicitação</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] max-h-[80vh] overflow-auto">
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
                name="apartment_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[250px]">
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
                    <SelectTrigger className="w-[250px]">
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

          {/* Data prevista */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data prevista</Label>
            <div className="col-span-3">
              <Controller
                name="forecast_date"
                control={control}
                render={({ field }) => (
                  <DatePicker date={field.value} setDate={field.onChange} />
                )}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Descrição</Label>
            <Textarea {...register("description")} className="col-span-3" />
          </div>

          {/* ART / RRT */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">ART/RRT</Label>
            <Controller
              name="has_art_rrt"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Observações */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right">Observações</Label>
            <Textarea {...register("observations")} className="col-span-3" />
          </div>

          {/* Funcionários */}
          <fieldset className="border rounded-xl p-4 space-y-4">
            <legend className="px-2 text-sm font-semibold">Funcionários</legend>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-10 gap-2 items-end">
                <Input
                  placeholder="Nome completo"
                  {...register(`employees.${index}.full_name`)}
                  className="col-span-5"
                />
                <Input
                  placeholder="CPF"
                  {...register(`employees.${index}.cpf`)}
                  className="col-span-4"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    const canRemove = employees.length > 1;
                    if (!canRemove) return;
                    remove(index);
                  }}
                >
                  <TrashIcon className="text-red-500" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => append({ full_name: "", cpf: "" })}
            >
              + Adicionar funcionário
            </Button>
          </fieldset>

          {/* Anexos */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Documentos</Label>

            <div className="col-span-3 space-y-2">
              {/* Área clicável */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-md h-[90px] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary transition"
              >
                <span className="text-xl">📎</span>
                <span className="text-sm text-muted-foreground">
                  Clique para selecionar documentos (máx. 5)
                </span>
              </div>

              {/* Input escondido */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFilesChange}
              />

              {/* Lista de arquivos */}
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
                            (_, i) => i !== index
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
