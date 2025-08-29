"use client";

import React, { useRef, useEffect, useState } from "react";
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
import { Option } from "@/api/fetch-work-areas";

const assetSchema = z.object({
  item: z.string().min(1, "Por favor, insira o item"),
  codigo: z.string().min(1, "Por favor, insira o código"),
  area: z.string().min(1, "Por favor, selecione a área"),
  categoria: z.string().min(1, "Por favor, selecione a categoria"),
  status: z.string().min(1, "Por favor, selecione o status"),
  photo: z
    .any()
    .refine(
      (file) => file?.length === 1,
      "Por favor, envie exatamente uma foto"
    )
    .optional(),
});

export type AssetFormData = z.infer<typeof assetSchema>;

interface ModalActionAssetProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  areasOptions?: Option[] | undefined;
  categoriasOptions?: Option[] | undefined;
  statusOptions?: Option[] | undefined;
  assetSelected?: AssetFormData;
  setAssetSelected?: React.Dispatch<
    React.SetStateAction<AssetFormData | undefined>
  >;
  type?: "create" | "edit" | "view";
}

export function ModalActionAsset({
  isOpen,
  setIsOpen,
  areasOptions = [],
  categoriasOptions = [],
  statusOptions = [],
  assetSelected,
  setAssetSelected,
  type = "create",
}: ModalActionAssetProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      item: "",
      codigo: "",
      area: "",
      categoria: "",
      status: "",
      photo: undefined,
    },
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const isDisabled = type === "view";
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (assetSelected && (type === "edit" || type === "view")) {
      reset(assetSelected);
      if (assetSelected.photo && typeof assetSelected.photo === "string") {
        setPreviewPhoto(assetSelected.photo);
      }
    } else if (type === "create") {
      reset();
      setPreviewPhoto(null);
    }
  }, [assetSelected, reset, type]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    setValue("photo", e.target.files);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewPhoto(url);
    } else {
      setPreviewPhoto(null);
    }
  }

  async function onSubmit(data: AssetFormData) {
    // Submeter os dados do formulário
    console.log("Dados do asset:", data);
    reset();
    setPreviewPhoto(null);
    setAssetSelected && setAssetSelected(undefined);
    closeButtonRef.current?.click();
    setIsOpen(false);
  }

  const modalTitle =
    type === "create"
      ? "Adicionar Asset"
      : type === "edit"
      ? "Editar Asset"
      : "Visualizar Asset";

  const modalDescription =
    type === "create"
      ? "Preencha os campos para adicionar um novo asset."
      : type === "edit"
      ? "Atualize os campos abaixo para editar o asset."
      : "Visualize os detalhes do asset.";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          setAssetSelected && setAssetSelected(undefined);
          setIsOpen(false);

          setPreviewPhoto(null);
        } else {
          setIsOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" disabled={false}>
          {modalTitle}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Item */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Item</Label>
            <Input
              {...register("item")}
              className="col-span-3"
              disabled={isDisabled}
            />
          </div>
          {errors.item && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.item.message}
            </p>
          )}

          {/* Código */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Código</Label>
            <Input
              {...register("codigo")}
              className="col-span-3"
              disabled={isDisabled}
            />
          </div>
          {errors.codigo && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.codigo.message}
            </p>
          )}

          {/* Área */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Área</Label>
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
                      <SelectItem key={id} value={String(id)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.area && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.area.message}
            </p>
          )}

          {/* Categoria */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Categoria</Label>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isDisabled}
                >
                  <SelectTrigger className="min-w-[200px]">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasOptions.map(({ id, name }) => (
                      <SelectItem key={id} value={String(id)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.categoria && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.categoria.message}
            </p>
          )}

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
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
                      <SelectItem key={id} value={String(id)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {errors.status && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.status.message}
            </p>
          )}

          {/* Foto */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Foto</Label>
            <div className="col-span-3">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                disabled={isDisabled}
                className="file-input"
              />
              {errors.photo && !isDisabled && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.photo.message?.toString()}
                </p>
              )}
              {previewPhoto && (
                <img
                  src={previewPhoto}
                  alt="Preview da foto"
                  className="mt-2 max-h-40 rounded-md"
                />
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button ref={closeButtonRef} variant="ghost">
                {type === "view" ? "Fechar" : "Cancelar"}
              </Button>
            </DialogClose>
            {type !== "view" && <Button type="submit">Salvar</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
