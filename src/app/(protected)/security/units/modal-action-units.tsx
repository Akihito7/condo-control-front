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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Option } from "@/api/fetch-work-areas";
import { Apartament } from "@/api/backoffice/fetch-apartaments";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addUnit } from "@/api/add-unit";
import { updateGenericRegister } from "@/api/update-generic.register";

/* =========================
   Schema
========================= */
export const unitSchema = z.object({
  status_id: z.string().min(1, "Informe o status"),
  apartment_id: z.string().min(1, "Informe o apartamento"),
  guest: z.string().min(1, "Informe o morador principal ou hóspede"),
  contact: z.string().min(1, "Informe o contato"),
  responsible: z.string().min(1, "Informe o responsável"),
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

/* =========================
   Component
========================= */
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
  } = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      status_id: "",
      apartment_id: "",
      guest: "",
      contact: "",
      responsible: "",
    },
  });

  const isDisabled = type === "view";

  const queryClient = useQueryClient();

  const { mutateAsync: handleCreateUnit } = useMutation({
    mutationFn: (data: UnitFormData) => addUnit(data),
  });

  const { mutateAsync: handleUpdateRegister } = useMutation({
    mutationFn: updateGenericRegister<any>,
  });

  async function onSubmit(data: UnitFormData) {
    if (type === "create") {
      await handleCreateUnit(data);
    } else {
      const apartament_id = data.apartment_id;
      const dataCloned: Partial<UnitFormData> = data;
      delete dataCloned.apartment_id;
      await handleUpdateRegister({
        registerId: unit.id,
        tableName: "units",
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
        responsible: unit.responsible,
        status_id: unit.statusId.toString(),
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
            responsible: "",
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

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* =========================
              Status
          ========================= */}
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
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
          <div className="flex flex-col gap-2">
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

          {/* =========================
              Corretor / Imobiliária
          ========================= */}
          <div className="flex flex-col gap-2">
            <Label>Corretor / Imobiliária</Label>
            <Input
              {...register("responsible")}
              placeholder="Nome do responsável"
              disabled={isDisabled}
            />
          </div>

          {errors.responsible && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2">
              {errors.responsible.message}
            </p>
          )}

          {/* =========================
              Footer
          ========================= */}
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
