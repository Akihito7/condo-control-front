"use client";

import React, { useRef, useEffect } from "react";
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
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PriorityOption } from "@/api/fetch-priority-options";
import { PaymentMethod } from "@/api/fetch-payment-method.options";
import { AreasOptions } from "@/api/fetch-condominium-areas";
import { TypesOption } from "@/api/fetch-maintenances-types";
import { MaintenanceStatusOption } from "@/api/fetch-maintenances-status";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createIntervention } from "@/api/create-intervention";
import { useUserContext } from "@/providers/use-user-context";
import { Intervention } from "@/api/fetch-interventions";
import { updateIntervention } from "@/api/update-intervention";
import { DatePicker } from "@/components/date-picker";

const interventionSchema = z
  .object({
    priority: z.string().min(1, "Por favor, selecione uma prioridade"),
    type: z.string().min(1, "Por favor, selecione um tipo"),
    area: z.string().min(1, "Por favor, selecione uma área"),
    description: z.string().min(3, "Por favor, insira uma descrição"),
    provider: z.string().optional(),
    value: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, "Por favor, insira um valor válido")
      .optional()
      .or(z.literal("")),
    paymentMethod: z
      .string()
      .min(1, "Por favor, selecione um método de pagamento")
      .optional()
      .or(z.literal("")),
    paymentDate: z.date().optional().nullable(),
    paymentCompletionDate: z.date().optional().nullable(),
    plannedStart: z.date().optional().nullable(),
    plannedEnd: z.date().optional().nullable(),
    actualStart: z.date().optional().nullable(),
    actualEnd: z.date().optional().nullable(),
    status: z.string().min(1, "Por favor, selecione um status"),
    isInstallment: z.boolean().optional(),
    numberOfInstallments: z.any().nullish(),
  })
  .superRefine(({ isInstallment, numberOfInstallments }, ctx) => {
    if (isInstallment) {
      if (numberOfInstallments === null || numberOfInstallments === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Por favor, informe o número de parcelas",
          path: ["numberOfInstallments"],
        });
      }
    } else {
      if (
        numberOfInstallments !== null &&
        numberOfInstallments !== undefined &&
        !Number.isNaN(numberOfInstallments)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Número de parcelas só deve ser informado se for parcelado",
          path: ["numberOfInstallments"],
        });
      }
    }
  });

export type InterventionFormData = z.infer<typeof interventionSchema>;

interface ModalAddInterventionProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  priorityOptions: PriorityOption[] | undefined;
  paymentMethodsOptions: PaymentMethod[] | undefined;
  areasOptions: AreasOptions[] | undefined;
  typesOptions: TypesOption[] | undefined;
  statusOptions: MaintenanceStatusOption[] | undefined;
  interventionSelected: Intervention | undefined;
  setInterventionSelected: React.Dispatch<
    React.SetStateAction<Intervention | undefined>
  >;
  type?: "create" | "edit" | "view";
  setModalTypeAction: React.Dispatch<
    React.SetStateAction<"create" | "edit" | "view">
  >;
}

export function ModalActionIntervention({
  isOpen,
  setIsOpen,
  priorityOptions = [],
  paymentMethodsOptions = [],
  areasOptions = [],
  typesOptions = [],
  statusOptions = [],
  interventionSelected,
  setInterventionSelected,
  type = "create",
  setModalTypeAction,
}: ModalAddInterventionProps) {
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
      priority: "",
      type: "",
      area: "",
      description: "",
      provider: "",
      value: "",
      paymentMethod: "",
      paymentDate: null,
      paymentCompletionDate: null,
      plannedStart: null,
      plannedEnd: null,
      actualStart: null,
      actualEnd: null,
      status: "",
      isInstallment: false,
      numberOfInstallments: undefined,
    },
  });

  const isInstallment = useWatch({
    control,
    name: "isInstallment",
  });

  const closeButtonRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: InterventionFormData) {
    if (type === "create") {
      await handleCreateIntervention({ condominiumId, data });
    } else {
      await handleUpdateIntervention(data);
    }
    cleanFormFields();
    setInterventionSelected(undefined);
    closeButtonRef.current?.click();
    queryClient.invalidateQueries({
      queryKey: ["interventions"],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["interventionsCards"],
      exact: false,
    });
  }

  const { mutateAsync: handleCreateIntervention } = useMutation({
    mutationFn: async (payload: {
      condominiumId: number;
      data: InterventionFormData;
    }) => createIntervention<InterventionFormData>(payload),
  });

  const { mutateAsync: handleUpdateIntervention } = useMutation({
    mutationFn: async (data: InterventionFormData) =>
      updateIntervention({
        interventionId: interventionSelected!.id,
        data: data,
      }),
  });
  const isDisabled = type === "view";

  const modalTitle =
    type === "create"
      ? "Adicionar Intervenção"
      : type === "edit"
      ? "Editar Intervenção"
      : "Visualizar Intervenção";
  const modalDescription =
    type === "create"
      ? "Preencha o formulário abaixo para adicionar uma nova intervenção."
      : type === "edit"
      ? "Atualize os campos abaixo para editar a intervenção."
      : "Visualize os detalhes da intervenção.";

  const triggerButtonText =
    type === "create"
      ? "Adicionar Intervenção"
      : type === "edit"
      ? "Editar Intervenção"
      : "Visualizar Intervenção";

  useEffect(() => {
    if (interventionSelected && (type === "edit" || type === "view")) {
      reset({
        priority: interventionSelected.priorityId.toString(),
        type: interventionSelected.typeId.toString(),
        area: interventionSelected.condominiumAreaId.toString(),
        description: interventionSelected.description,
        provider: interventionSelected.supplier || "",
        value: interventionSelected.amount.toFixed(2),
        paymentMethod: interventionSelected?.paymentMethod?.toString(),
        paymentDate: interventionSelected.paymentDate
          ? new Date(interventionSelected.paymentDate)
          : null,
        paymentCompletionDate: interventionSelected.paymentCompletionDate
          ? new Date(interventionSelected.paymentCompletionDate)
          : null,
        plannedStart: interventionSelected.plannedStart
          ? new Date(interventionSelected.plannedStart)
          : null,
        plannedEnd: interventionSelected.plannedEnd
          ? new Date(interventionSelected.plannedEnd)
          : null,
        actualStart: interventionSelected.actualStart
          ? new Date(interventionSelected.actualStart)
          : null,
        actualEnd: interventionSelected.actualEnd
          ? new Date(interventionSelected.actualEnd)
          : null,
        status: interventionSelected.statusId.toString(),
        isInstallment: interventionSelected.isInstallment ?? false,
        numberOfInstallments:
          interventionSelected.numberOfInstallments ?? undefined,
      });
    } else if (type === "create") {
      cleanFormFields();
    }
  }, [interventionSelected, reset, type]);

  function cleanFormFields() {
    reset({
      priority: "",
      type: "",
      area: "",
      description: "",
      provider: "",
      value: "",
      paymentMethod: "",
      paymentDate: null,
      paymentCompletionDate: null,
      plannedStart: null,
      plannedEnd: null,
      actualStart: null,
      actualEnd: null,
      status: "",
      isInstallment: false,
      numberOfInstallments: undefined,
    });
  }

  const isInstallmentRef = useRef<boolean>(isInstallment);

  const watchIsInstallmentFormField = watch("isInstallment");
  useEffect(() => {
    if (isInstallmentRef.current && !watchIsInstallmentFormField) {
      isInstallmentRef.current = false;
      setValue("numberOfInstallments", "");
    }

    if (!isInstallmentRef.current && watchIsInstallmentFormField) {
      isInstallmentRef.current = true;
    }
  }, [watchIsInstallmentFormField]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          cleanFormFields();
          setInterventionSelected(undefined);
          setIsOpen(false);
          setModalTypeAction("create");
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setModalTypeAction("create");
          }}
          variant="outline"
          disabled={false}
        >
          {triggerButtonText}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Prioridade</Label>
            <div className="col-span-3">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(({ id, name }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.priority && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.priority.message}
            </p>
          )}

          {/* Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tipo</Label>
            <div className="col-span-3">
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {typesOptions.map(({ id, name }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.type && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.type.message}
            </p>
          )}

          {/* Area */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Área</Label>
            <div className="col-span-3">
              <Controller
                name="area"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      {areasOptions.map(({ id, name }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.area && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.area.message}
            </p>
          )}

          {/* Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Descrição</Label>
            <textarea
              {...register("description")}
              className="col-span-3 border rounded-md p-2"
              rows={3}
              disabled={isDisabled}
            />
          </div>
          {errors.description && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.description.message}
            </p>
          )}

          {/* Provider */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Fornecedor</Label>
            <Input
              {...register("provider")}
              className="col-span-3"
              disabled={isDisabled}
            />
          </div>

          {/* Value */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Valor</Label>
            <Input
              {...register("value")}
              className="col-span-3"
              placeholder="Ex: 1000,00"
              disabled={isDisabled}
            />
          </div>
          {errors.value && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.value.message}
            </p>
          )}

          {/* Payment Method */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Método de Pagamento</Label>
            <div className="col-span-3">
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione o método de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethodsOptions.map(({ id, name }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.paymentMethod && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.paymentMethod.message}
            </p>
          )}

          {/* Checkbox isInstallment */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">É Parcelado</Label>
            <div className="col-span-3 flex items-center">
              <input
                type="checkbox"
                {...register("isInstallment")}
                disabled={isDisabled}
                className="w-5 h-5 mr-2"
              />
            </div>
          </div>

          {/* Number of Installments */}
          {isInstallment && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Número de Parcelas</Label>
              <div className="col-span-3">
                <Input
                  type="number"
                  {...register("numberOfInstallments", { valueAsNumber: true })}
                  className="w-full"
                  disabled={isDisabled}
                  min={1}
                  step={1}
                  placeholder="Insira o número de parcelas"
                />
                {errors.numberOfInstallments && !isDisabled && (
                  <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                    {errors.numberOfInstallments.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payment Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data do Pagamento</Label>
            <div className="col-span-3">
              <Controller
                name="paymentDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={(value) => {
                      if (!isInstallment) {
                        setValue("paymentCompletionDate", value);
                      }
                      onChange(value);
                    }}
                    disabled={isDisabled}
                    label="Data do Pagamento"
                  />
                )}
              />
            </div>
          </div>

          {/* Payment Completion Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Dt. Conclusão Pgto</Label>
            <div className="col-span-3">
              <Controller
                name="paymentCompletionDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={(value) => {
                      if (isInstallment) {
                        onChange(value);
                      }
                    }}
                    disabled={isDisabled || !isInstallment}
                    label="Data de Conclusão do Pagamento"
                  />
                )}
              />
            </div>
          </div>

          {/* Planned Start */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Início Planejado</Label>
            <div className="col-span-3">
              <Controller
                name="plannedStart"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={onChange}
                    disabled={isDisabled}
                    label="Início Planejado"
                  />
                )}
              />
            </div>
          </div>

          {/* Planned End */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Término Planejado</Label>
            <div className="col-span-3">
              <Controller
                name="plannedEnd"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={onChange}
                    disabled={isDisabled}
                    label="Término Planejado"
                  />
                )}
              />
            </div>
          </div>

          {/* Actual Start */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Início Real</Label>
            <div className="col-span-3">
              <Controller
                name="actualStart"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={onChange}
                    disabled={isDisabled}
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
                name="actualEnd"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    date={value as any}
                    setDate={onChange}
                    disabled={isDisabled}
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
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(({ id, name }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.status && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[145px]">
              {errors.status.message}
            </p>
          )}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button ref={closeButtonRef} variant="ghost">
                {type === "view" ? "Fechar" : "Cancelar"}
              </Button>
            </DialogClose>
            {type !== "view" && (
              <Button type="submit">
                {type === "create" ? "Salvar" : "Atualizar"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
