"use client";

import { z } from "zod";
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
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Option } from "@/api/fetch-work-areas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUnit } from "@/api/add-unit";
import { updateGenericRegister } from "@/api/update-generic.register";
import { Plus, Trash2 } from "lucide-react";
import { updateUnit } from "@/api/update-unit";

export const unitSchema = z.object({
  status_id: z.string().min(1, "Informe o status"),
  apartment_id: z.string().min(1, "Informe o apartamento"),
  guest: z.string().min(1, "Informe o morador principal ou hóspede"),
  contact: z.string().min(1, "Informe o contato"),
  responsibles: z.array(
    z.object({
      responsibleId: z.number().nullable().optional(),
      name: z.string().min(2, "Informe um nome"),
      creci: z.string().min(8, "Informe um CRECI válido"),
    }),
  ),
});

export type UnitFormData = z.infer<typeof unitSchema>;

interface ModalActionUnitsProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type?: "create" | "edit" | "view";
  status?: Option[];
  apartaments?: Option[];
  unit?: any;
  setUnitSelected: React.Dispatch<React.SetStateAction<undefined>>;
}

export function ModalActionUnits({
  isOpen,
  setIsOpen,
  type = "create",
  apartaments,
  status,
  unit,
  setUnitSelected,
}: ModalActionUnitsProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
    control,
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      status_id: "",
      apartment_id: "",
      guest: "",
      contact: "",
      responsibles: [{ name: "", creci: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "responsibles",
  });

  const isDisabled = type === "view";

  const queryClient = useQueryClient();

  const { mutateAsync: handleCreateUnit } = useMutation({
    mutationFn: (data: UnitFormData) => addUnit(data),
  });

  const { mutateAsync: handleUpdateRegister } = useMutation({
    mutationFn: updateUnit,
  });

  async function onSubmit(data: UnitFormData) {
    if (type === "create") {
      await handleCreateUnit(data);
    } else {
      const apartament_id = data.apartment_id;
      const dataCloned: Partial<UnitFormData> = data;
      delete dataCloned.apartment_id;
      await handleUpdateRegister({
        unitId: unit.id,
        data: {
          ...dataCloned,
          apartament_id,
        },
      });
    }
    queryClient.invalidateQueries({ exact: false, queryKey: ["units"] });
    reset();
    closeButtonRef.current?.click();
    setIsOpen(false);
  }

  const modalTitle =
    type === "create"
      ? "Adicionar Unidade"
      : type === "edit"
        ? "Editar Unidade"
        : "Visualizar Unidade";

  const modalDescription =
    type === "create"
      ? "Preencha os campos para adicionar uma nova unidade."
      : type === "edit"
        ? "Atualize os dados da unidade."
        : "Visualize as informações da unidade.";

  useEffect(() => {
    if (type === "edit") {
      reset({
        apartment_id: unit.apartamentId.toString(),
        contact: unit.contact,
        guest: unit.guest,
        status_id: unit.statusId.toString(),
        responsibles: unit.unitResponsibles.map((responsible: any) => {
          return {
            responsibleId: responsible.id,
            name: responsible.name,
            creci: responsible.creci,
          };
        }),
      });
    }
  }, [unit]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset({
            apartment_id: "",
            contact: "",
            guest: "",
            responsibles: [{ name: "", creci: "" }],
            status_id: "",
          });
          setIsOpen(false);
          setUnitSelected(undefined);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Unidade</Button>
      </DialogTrigger>

      <DialogContent className="max-w-full sm:max-w-[700px] md:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* =========================
              Status
          ========================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label>Status</Label>
            <Select
              value={getValues("status_id")}
              disabled={isDisabled}
              onValueChange={(value) =>
                setValue("status_id", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>

              <SelectContent>
                {status?.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {errors.status_id && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.status_id.message}
            </p>
          )}

          {/* =========================
              Apartamento
          ========================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label>Apartamento</Label>
            <Select
              value={getValues("apartment_id")}
              disabled={isDisabled}
              onValueChange={(value) =>
                setValue("apartment_id", value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>

              <SelectContent>
                {apartaments?.map((ap) => (
                  <SelectItem key={ap.id} value={ap.id.toString()}>
                    {ap.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {errors.apartment_id && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.apartment_id.message}
            </p>
          )}

          {/* =========================
              Morador / Hóspede
          ========================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label>Morador Principal / Hóspede</Label>
            <Input
              {...register("guest")}
              placeholder="Nome"
              disabled={isDisabled}
            />
          </div>

          {errors.guest && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2">{errors.guest.message}</p>
          )}

          {/* =========================
              Contato
          ========================= */}
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label>Contato</Label>
            <Input
              {...register("contact")}
              placeholder="(00) 00000-0000"
              disabled={isDisabled}
            />
          </div>

          {errors.contact && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.contact.message}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Label> Corretor / Imobiliária</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append({ name: "", creci: "" })}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 bg-muted/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Responsável {index + 1}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      remove(index);
                    }}
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </Button>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>

                    <Input
                      placeholder="Ex: João Silva"
                      {...register(`responsibles.${index}.name`)}
                    />

                    {errors.responsibles?.[index]?.name && (
                      <p className="text-xs text-red-500">
                        {errors.responsibles[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>CRECI</Label>

                    <Input
                      placeholder="Ex: 12345678"
                      {...register(`responsibles.${index}.creci`)}
                    />

                    {errors.responsibles?.[index]?.creci && (
                      <p className="text-xs text-red-500">
                        {errors.responsibles[index]?.creci?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button ref={closeButtonRef} variant="ghost">
                {type === "view" ? "Fechar" : "Cancelar"}
              </Button>
            </DialogClose>

            {type !== "view" && <Button type="submit">Salvar Unidade</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
