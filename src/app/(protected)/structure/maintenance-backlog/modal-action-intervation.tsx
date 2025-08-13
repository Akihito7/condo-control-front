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
import { DatePickerWithHours } from "@/components/date-picker-with-hours";
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

// Atualiza o schema adicionando isInstallment (boolean) e numberOfInstallments (number)
const interventionSchema = z.object({
  priority: z.string().min(1, "Please select a priority"),
  type: z.string().min(1, "Please select a type"),
  area: z.string().min(1, "Please select an area"),
  description: z.string().min(3, "Please enter a description"),
  provider: z.string().optional(),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid amount"),
  paymentMethod: z.string().min(1, "Please select a payment method"),
  paymentDate: z.date().optional().nullable(),
  paymentCompletionDate: z.date().optional().nullable(),
  duration: z.string().optional(),
  plannedStart: z.date().optional().nullable(),
  plannedEnd: z.date().optional().nullable(),
  actualStart: z.date().optional().nullable(),
  actualEnd: z.date().optional().nullable(),
  status: z.string().min(1, "Please select a status"),
  isInstallment: z.boolean().optional(),
  numberOfInstallments: z.number().int().positive().optional(),
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
      duration: "",
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
    reset();
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
    }) => createIntervention(payload),
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
      ? "Add Intervention"
      : type === "edit"
      ? "Edit Intervention"
      : "View Intervention";
  const modalDescription =
    type === "create"
      ? "Fill out the form below to add a new intervention."
      : type === "edit"
      ? "Update the fields below to edit the intervention."
      : "View the details of the intervention.";

  const triggerButtonText =
    type === "create"
      ? "Add Intervention"
      : type === "edit"
      ? "Edit Intervention"
      : "View Intervention";

  useEffect(() => {
    if (interventionSelected && (type === "edit" || type === "view")) {
      reset({
        priority: interventionSelected.priorityId.toString(),
        type: interventionSelected.typeId.toString(),
        area: interventionSelected.condominiumAreaId.toString(),
        description: interventionSelected.description,
        provider: interventionSelected.supplier || "",
        value: interventionSelected.amount.toFixed(2),
        paymentMethod: interventionSelected.paymentMethod.toString(),
        paymentDate: interventionSelected.paymentDate
          ? new Date(interventionSelected.paymentDate)
          : null,
        paymentCompletionDate: interventionSelected.paymentCompletionDate
          ? new Date(interventionSelected.paymentCompletionDate)
          : null,
        duration: interventionSelected.executionTime ?? "",
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
      reset(); // limpa o formulário para criação
    }
  }, [interventionSelected, reset, type]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 py-4"
          // prevent submit on view mode if needed
        >
          {/* Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Priority</Label>
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
                      <SelectValue placeholder="Select priority" />
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
            <Label className="text-right">Type</Label>
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
                      <SelectValue placeholder="Select type" />
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
            <Label className="text-right">Area</Label>
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
                      <SelectValue placeholder="Select area" />
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
            <Label className="text-right">Description</Label>
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
            <Label className="text-right">Provider</Label>
            <Input
              {...register("provider")}
              className="col-span-3"
              disabled={isDisabled}
            />
          </div>

          {/* Value */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Value</Label>
            <Input
              {...register("value")}
              className="col-span-3"
              placeholder="E.g. 1000.00"
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
            <Label className="text-right">Payment Method</Label>
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
                      <SelectValue placeholder="Select payment method" />
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

          {/* Payment Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Payment Date</Label>
            <div className="col-span-3">
              <Controller
                name="paymentDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours
                    date={value as any}
                    setDate={onChange}
                    isDisabled={isDisabled}
                  />
                )}
              />
            </div>
          </div>

          {/* Payment Completion Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Payment Completion Date</Label>
            <div className="col-span-3">
              <Controller
                name="paymentCompletionDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours
                    date={value as any}
                    setDate={onChange}
                    isDisabled={isDisabled}
                  />
                )}
              />
            </div>
          </div>

          {/* Checkbox isInstallment */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Is Installment</Label>
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
              <Label className="text-right">Number of Installments</Label>
              <div className="col-span-3">
                <Input
                  type="number"
                  {...register("numberOfInstallments", { valueAsNumber: true })}
                  className="w-full"
                  disabled={isDisabled}
                  min={1}
                  step={1}
                  placeholder="Enter number of installments"
                />
                {errors.numberOfInstallments && !isDisabled && (
                  <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                    {errors.numberOfInstallments.message as string}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Duration</Label>
            <Input
              {...register("duration")}
              className="col-span-3"
              placeholder="E.g. 3 days"
              disabled={isDisabled}
            />
          </div>

          {/* Planned Start */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Planned Start</Label>
            <div className="col-span-3">
              <Controller
                name="plannedStart"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours
                    date={value as any}
                    setDate={onChange}
                    isDisabled={isDisabled}
                  />
                )}
              />
            </div>
          </div>

          {/* Planned End */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Planned End</Label>
            <div className="col-span-3">
              <Controller
                name="plannedEnd"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours
                    date={value as any}
                    setDate={onChange}
                    isDisabled={isDisabled}
                  />
                )}
              />
            </div>
          </div>

          {/* Actual Start */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Actual Start</Label>
            <div className="col-span-3">
              <Controller
                name="actualStart"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours
                    date={value as any}
                    setDate={onChange}
                    isDisabled={isDisabled}
                  />
                )}
              />
            </div>
          </div>

          {/* Actual End */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Actual End</Label>
            <div className="col-span-3">
              <Controller
                name="actualEnd"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours
                    date={value as any}
                    setDate={onChange}
                    isDisabled={isDisabled}
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
                      <SelectValue placeholder="Select status" />
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
                {type === "view" ? "Close" : "Cancel"}
              </Button>
            </DialogClose>
            {type !== "view" && (
              <Button type="submit">
                {type === "create" ? "Save" : "Update"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
