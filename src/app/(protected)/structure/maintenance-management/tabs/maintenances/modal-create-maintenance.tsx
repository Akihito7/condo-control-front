"use client";

import React, { useEffect, useRef } from "react";
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
import { useUserContext } from "@/providers/use-user-context";
import { DatePicker } from "@/components/date-picker";
import { createIntervention } from "@/api/create-intervention";
import { PriorityOption } from "@/api/fetch-priority-options";
import { MaintenanceStatusOption } from "@/api/fetch-maintenances-status";
import { Asset } from "@/api/fetch-maintenance-management-assets";
import { DatePickerWithHours } from "@/components/date-picker-with-hours";

const interventionSchema = z.object({
  assetType: z.string().min(1, "Por favor, selecione um ativo"),
  provider: z.string().optional(),
  typeMaintenance: z.string().min(1, "Por favor, selecione um tipo"),
  contact: z.string(),
  type: z.string(),
  value: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Por favor, insira um valor válido")
    .optional()
    .or(z.literal("")),
  paymentDate: z.date().optional().nullable(),
  paymentCompletionDate: z.date().optional().nullable(),
  plannedStart: z.date().optional().nullable(),
  nextMaintenance: z.date().optional().nullable(),
  status: z.string().min(1, "Por favor, selecione um status"),
  documents: z.any().optional(),
});

export type InterventionFormData = z.infer<typeof interventionSchema>;

interface ModalCreateMaintenancesProps {
  priorityOptions: PriorityOption[] | undefined;
  maintenancesStatusOptions: MaintenanceStatusOption[] | undefined;
  assets: Asset[] | undefined;
}

export function ModalCreateMaintenance({
  priorityOptions,
  maintenancesStatusOptions,
  assets,
}: ModalCreateMaintenancesProps) {
  const { user } = useUserContext();
  const { condominiumId } = user;
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InterventionFormData>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      assetType: "",
      provider: "",
      type: "1",
      value: "",
      paymentDate: null,
      paymentCompletionDate: null,
      plannedStart: new Date(),
      status: "",
    },
  });

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: handleCreateIntervention } = useMutation({
    mutationFn: async (payload: { condominiumId: number; data: FormData }) =>
      createIntervention<FormData>(payload),
  });

  async function onSubmit(data: InterventionFormData) {
    const formData = new FormData();

    // adiciona todos os campos comuns
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== "documents" &&
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // adiciona arquivos, se houver
    if (data.documents && data.documents.length > 0) {
      for (let i = 0; i < data.documents.length; i++) {
        formData.append("attachment", data.documents[i]);
      }
    }

    await handleCreateIntervention({ condominiumId, data: formData });
    queryClient.invalidateQueries({
      queryKey: ["maintenances"],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["summary"],
      exact: false,
    });
    queryClient.refetchQueries({
      queryKey: ["summary"],
    });
    queryClient.invalidateQueries({
      queryKey: ["maintenances-calendar"],
      exact: false,
    });
    queryClient.refetchQueries({
      queryKey: ["maintenances-calendar"],
    });
    queryClient.invalidateQueries({
      queryKey: ["asset-details"],
      exact: false,
    });
    queryClient.refetchQueries({
      queryKey: ["asset-details"],
      exact: false,
    });
    closeButtonRef?.current?.click();
    reset();
  }

  const assetType = watch("assetType");
  const plannedStart = watch("plannedStart");
  const typeMaintenance = watch("typeMaintenance");
  const assetSelected = assets?.find((asset) => String(asset.id) === assetType);

  useEffect(() => {
    if (
      assetSelected?.maintenanceFrequency &&
      plannedStart &&
      typeMaintenance === "1"
    ) {
      const nextDate = new Date(plannedStart);

      const freq = assetSelected.maintenanceFrequency.toLowerCase();

      if (freq.includes("mensal")) nextDate.setMonth(nextDate.getMonth() + 1);
      if (freq.includes("bimestral"))
        nextDate.setMonth(nextDate.getMonth() + 2);
      if (freq.includes("trimestral"))
        nextDate.setMonth(nextDate.getMonth() + 3);
      if (freq.includes("semestral"))
        nextDate.setMonth(nextDate.getMonth() + 6);
      if (freq.includes("anual"))
        nextDate.setFullYear(nextDate.getFullYear() + 1);

      setValue("nextMaintenance", nextDate);
    }
  }, [
    assetSelected?.maintenanceFrequency,
    plannedStart,
    setValue,
    typeMaintenance,
  ]);

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Manutenção</Button>
      </DialogTrigger>

      <DialogContent
        className="
    w-screen h-screen max-w-none max-h-none rounded-none
    md:w-auto md:h-auto md:max-w-[700px] md:rounded-lg
    flex flex-col
  "
      >
        {/* HEADER */}
        <DialogHeader className="shrink-0 border-b pb-4">
          <DialogTitle className="text-xl md:text-2xl">
            Criar manutenção
          </DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar uma manutenção
          </DialogDescription>
        </DialogHeader>

        {/* CONTEÚDO COM SCROLL */}
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 py-4"
            encType="multipart/form-data"
          >
            {/* Asset */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Ativo</Label>
              <div className="md:col-span-3">
                <Controller
                  name="assetType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o ativo" />
                      </SelectTrigger>
                      <SelectContent>
                        {assets?.map(({ id, name }) => (
                          <SelectItem key={id} value={String(id)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {errors.assetType && (
              <p className="text-red-500 text-sm">{errors.assetType.message}</p>
            )}

            {/* Provider */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Fornecedor</Label>
              <Input
                {...register("provider")}
                className="md:col-span-3 w-full"
              />
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Contato</Label>
              <Input
                {...register("contact")}
                className="md:col-span-3 w-full"
              />
            </div>

            {/* Tipo manutenção */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Tipo de manutenção</Label>
              <div className="md:col-span-3">
                <Controller
                  name="typeMaintenance"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Preventiva</SelectItem>
                        <SelectItem value="2">Corretiva</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Valor */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Valor</Label>
              <Input
                {...register("value")}
                className="md:col-span-3 w-full"
                placeholder="Ex: 1000,00"
              />
            </div>

            {/* Data */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Data</Label>
              <div className="md:col-span-3">
                <Controller
                  name="plannedStart"
                  control={control}
                  render={({ field }) => (
                    <DatePickerWithHours
                      date={field.value!}
                      setDate={field.onChange}
                    />
                  )}
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Status</Label>
              <div className="md:col-span-3">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {maintenancesStatusOptions?.map(({ id, name }) => (
                          <SelectItem key={id} value={String(id)}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
              <Label className="md:text-right">Documentos</Label>
              <Input
                type="file"
                {...register("documents")}
                multiple
                className="md:col-span-3 w-full"
              />
            </div>

            {/* Próxima manutenção */}
            {assetSelected?.maintenanceFrequency && typeMaintenance === "1" && (
              <fieldset className="border border-muted-foreground/20 rounded-xl p-4 space-y-4">
                <legend className="px-2 text-sm font-semibold text-muted-foreground">
                  Próxima Manutenção Preventiva
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 md:gap-4">
                  <Label className="md:text-right">Data prevista</Label>
                  <div className="md:col-span-3">
                    <Controller
                      name="nextMaintenance"
                      control={control}
                      render={({ field }) => (
                        <DatePickerWithHours
                          date={field.value!}
                          setDate={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  A data foi calculada automaticamente, mas pode ser ajustada.
                </p>
              </fieldset>
            )}
          </form>
        </div>

        {/* FOOTER FIXO */}
        <DialogFooter className="shrink-0 border-t pt-4 flex flex-col-reverse sm:flex-row gap-2">
          <DialogClose asChild>
            <Button ref={closeButtonRef} variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
