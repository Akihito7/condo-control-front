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

const interventionSchema = z.object({
  assetType: z.string().min(1, "Por favor, selecione um ativo"),
  priority: z.string().min(1, "Por favor, selecione uma prioridade"),
  description: z.string().min(3, "Por favor, insira uma descrição"),
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
  plannedEnd: z.date().optional().nullable(),
  status: z.string().min(1, "Por favor, selecione um status"),
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
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<InterventionFormData>({
    resolver: zodResolver(interventionSchema),
    defaultValues: {
      assetType: "",
      priority: "",
      description: "",
      provider: "",
      type: "2",
      value: "",
      paymentDate: null,
      paymentCompletionDate: null,
      plannedStart: null,
      plannedEnd: null,
      status: "",
    },
  });
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: InterventionFormData) {
    await handleCreateIntervention({ condominiumId, data });
    cleanFormFields();
    queryClient.invalidateQueries({
      queryKey: ["maintenances"],
      exact: false,
    });
    closeButtonRef?.current?.click();
  }

  const { mutateAsync: handleCreateIntervention } = useMutation({
    mutationFn: async (payload: {
      condominiumId: number;
      data: InterventionFormData;
    }) => createIntervention<InterventionFormData>(payload),
  });

  function cleanFormFields() {
    reset({
      assetType: "",
      contact: "",
      typeMaintenance: "",
      priority: "",
      description: "",
      provider: "",
      value: "",
      type: "2",
      paymentCompletionDate: null,
      plannedStart: null,
      plannedEnd: null,
      status: "",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => {}} variant="outline" disabled={false}>
          Adicionar Manutenção
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Criar manutenção</DialogTitle>
          <DialogDescription>
            Preencha os campos para adicionar uma manutenção
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Asset */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Ativo</Label>
            <div className="col-span-3">
              <Controller
                name="assetType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {assets?.map(({ id, name }) => (
                        <SelectItem value={String(id)}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.assetType && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.assetType.message}
            </p>
          )}

          {/* Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Prioridade</Label>
            <div className="col-span-3">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions?.map(({ id, name }) => (
                        <SelectItem value={String(id)}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.priority && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.priority.message}
            </p>
          )}

          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Descrição</Label>
            <textarea
              {...register("description")}
              className="col-span-3 border rounded-md p-2"
              rows={3}
            />
          </div>
          {errors.description && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.description.message}
            </p>
          )}

          {/* Provider */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Fornecedor</Label>
            <Input {...register("provider")} className="col-span-3" />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Contato</Label>
            <Input {...register("contact")} className="col-span-3" />
          </div>

          {/* Maintenance Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tipo de manutenção</Label>
            <div className="col-span-3">
              <Controller
                name="typeMaintenance"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione o status" />
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
          {errors.status && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.status.message}
            </p>
          )}

          {/* Value */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Valor</Label>
            <Input
              {...register("value")}
              className="col-span-3"
              placeholder="Ex: 1000,00"
            />
          </div>
          {errors.value && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.value.message}
            </p>
          )}

          {/* Actual Start */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Início Real</Label>
            <div className="col-span-3">
              <Controller
                name="plannedStart"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={onChange}
                    label="Início Real"
                  />
                )}
              />
            </div>
          </div>

          {/* Actual End */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Término Real</Label>
            <div className="col-span-3">
              <Controller
                name="plannedEnd"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={onChange}
                    label="Término Real"
                  />
                )}
              />
            </div>
          </div>

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <div className="col-span-3">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {maintenancesStatusOptions?.map(({ id, name }) => (
                        <SelectItem value={String(id)}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.status.message}
            </p>
          )}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button ref={closeButtonRef} variant="ghost">
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
