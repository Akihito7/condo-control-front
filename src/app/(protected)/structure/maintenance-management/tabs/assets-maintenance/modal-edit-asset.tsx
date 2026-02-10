"use client";

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
import { useEffect, useRef, useState } from "react";
import { ModalCreateType } from "./modal-create-type";
import { Type } from "@/api/fetch-maintenance-management-assets-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMaintenanceManagementAssets } from "@/api/create-maintenance-management-assets";
import { CalendarCustom } from "@/components/calendar";
import { AssetMaintenanceReport } from "@/api/get-asset-maintenances-details";
import { Asset } from "@/api/fetch-maintenance-management-assets";
import { updateMaintenanceManagementAssets } from "@/api/update-maintenance-managament-asset";

const assetSchema = z.object({
  code: z.string().min(1, "Informe o código"),
  name: z.string().min(1, "Informe o nome"),
  type: z.string().min(1, "Informe um  tipo valido."),
  frequency: z.string().min(1, "Selecione a frequência"),
  contact: z.string().min(1, "Contato e obrigatorio"),
  supplier: z.string().min(1, "Informe o fornecedor"),
  lifespan: z
    .number({ invalid_type_error: "Informe um número" })
    .positive("Deve ser positivo"),
  installationDate: z.date(),
});

export type AssetFormData = z.infer<typeof assetSchema>;

interface ModalEditAssetProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  assetSelected: Asset;
  assetsTypes: Type[] | undefined;
}

export function ModalEditAsset({
  isOpen,
  setIsOpen,
  assetSelected,
  assetsTypes,
}: ModalEditAssetProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      code: "",
      name: "",
      frequency: "",
      supplier: "",
      lifespan: 0,
      installationDate: new Date(),
      contact: "",
    },
  });

  const buttonCloseRef = useRef<HTMLButtonElement>(null);

  async function onSubmit(data: AssetFormData) {
    await handleUpdateMaintenanceManagementAsset({
      assetId: assetSelected.id,
      data,
    });
  }

  const query = useQueryClient();

  const { mutateAsync: handleUpdateMaintenanceManagementAsset } = useMutation({
    mutationFn: updateMaintenanceManagementAssets,
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["assets"],
        exact: false,
      });
      reset({
        code: "",
        frequency: "",
        installationDate: new Date(),
        lifespan: 0,
        type: "",
        name: "",
        supplier: "",
      });
      buttonCloseRef.current?.click();
    },
  });

  useEffect(() => {
    if (!assetSelected) return;

    const estimatedUsefulLifeFormated = Number(
      assetSelected.estimatedUsefulLife.split(" ")[0],
    );

    reset({
      code: assetSelected.code,
      contact: assetSelected.contact,
      frequency: assetSelected.maintenanceFrequency,
      installationDate: new Date(`${assetSelected.installationDate} 21:00:00`),
      lifespan: estimatedUsefulLifeFormated,
      name: assetSelected.name,
      supplier: assetSelected.supplier,
      type: String(assetSelected.type),
    });
  }, [assetSelected]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset({
            code: "",
            contact: "",
            frequency: "",
            installationDate: undefined,
            lifespan: undefined,
            name: "",
            supplier: undefined,
            type: "",
          });
        }
        setIsOpen(open);
      }}
    >
      <DialogContent className="max-w-full sm:max-w-[700px] md:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Ativo</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para editar um ativo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Code */}

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right">Codigo</Label>
            <Input
              {...register("code")}
              placeholder="Ex: A-123"
              className="col-span-3"
            />
          </div>
          {errors.code && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.code.message}
            </p>
          )}

          {/* Name */}

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right">Nome</Label>
            <Input
              {...register("name")}
              placeholder="Ex: Extintor de incêndio"
              className="col-span-3"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.name.message}
            </p>
          )}

          {/* Type */}

          <div className="flex flex-col gap-4 mb-4 sm:grid sm:grid-cols-3 md:grid-cols-4 sm:items-center">
            <Label className="text-left sm:text-right">Tipo</Label>

            <div className="col-span-2 md:col-span-3 flex items-center gap-2">
              <Controller
                name="type"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>

                    <SelectContent>
                      {assetsTypes?.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Botão de criar sempre ao lado */}
              <div className="flex-shrink-0">
                <ModalCreateType />
              </div>
            </div>
          </div>

          {/* Frequency */}

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right">Frequência</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-w-[200px]">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="bimestral">Bimestral</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.frequency && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.frequency.message}
            </p>
          )}

          {/* Supplier */}

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right">Fornecedor</Label>
            <Input
              {...register("supplier")}
              placeholder="Nome"
              className="col-span-3"
            />
          </div>
          {errors.supplier && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.supplier.message}
            </p>
          )}

          {/* Contact */}

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right">Contato</Label>
            <Input
              {...register("contact")}
              placeholder="Ex : Email, nome ou número."
              className="col-span-3"
            />
          </div>
          {errors.supplier && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.supplier.message}
            </p>
          )}

          {/* Lifespan */}

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right col-span-1">
              Vida útil est. (anos)
            </Label>
            <Input
              type="number"
              {...register("lifespan", { valueAsNumber: true })}
              placeholder="Ex: 5"
              className="col-span-3"
            />
          </div>
          {errors.lifespan && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.lifespan.message}
            </p>
          )}

          {/* Installation Date */}

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right">Data de instalação</Label>
            <Controller
              name="installationDate"
              control={control}
              render={({ field }) => {
                return (
                  <CalendarCustom
                    date={field.value}
                    setDate={field.onChange}
                    label="Data de instalação"
                  />
                );
              }}
            />
          </div>
          {errors.installationDate && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.installationDate.message}
            </p>
          )}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost" ref={buttonCloseRef}>
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
