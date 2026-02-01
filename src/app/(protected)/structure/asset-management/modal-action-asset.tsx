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
import { Eye, Paperclip } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAsset } from "@/api/create-asset";
import { useUserContext } from "@/providers/use-user-context";
import { Asset } from "@/api/fetch-assets";
import { updateAsset } from "@/api/update-asset";

const assetSchema = z.object({
  item: z.string().min(1, "Por favor, insira o item"),
  code: z.string().min(1, "Por favor, insira o código"),
  areaId: z.string().min(1, "Por favor, selecione a área"),
  categoryId: z.string().min(1, "Por favor, selecione a categoria"),
  statusId: z.string().min(1, "Por favor, selecione o status"),
  photo: z
    .any()
    .refine(
      (file) => file?.length === 1,
      "Por favor, envie exatamente uma foto",
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
  assetSelected?: Asset | undefined;
  setAssetSelected?: React.Dispatch<React.SetStateAction<Asset | undefined>>;
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
    getValues,
    formState: { errors },
    watch,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      item: "",
      code: "",
      areaId: "",
      categoryId: "",
      statusId: "",
      photo: undefined,
    },
  });

  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const isDisabled = type === "view";
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { user } = useUserContext();
  const { condominiumId } = user;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (assetSelected) {
      reset({
        areaId: assetSelected.areaId.toString(),
        categoryId: assetSelected.categoryId.toString(),
        code: assetSelected.categoryId.toString(),
        item: assetSelected.name,
        statusId: assetSelected.statusId.toString(),
      });
      /*     if (assetSelected.photo && typeof assetSelected.photo === "string") {
        setPreviewPhoto(assetSelected.photo);
      } */
    } else {
      reset({
        areaId: "",
        categoryId: "",
        code: "",
        item: "",
        photo: "",
        statusId: "",
      });
      setPreviewPhoto(null);
    }
  }, [assetSelected, reset, type]);

  async function onSubmit(data: AssetFormData) {
    const formData = new FormData();
    formData.append("code", data.code);
    formData.append("item", data.item);
    formData.append("areaId", data.areaId);
    formData.append("statusId", data.statusId);
    formData.append("categoryId", data.categoryId);
    formData.append("photo", data.photo?.[0]);

    if (type === "create") {
      await handleCreateAsset(formData);
    } else {
      await handleUpdateAsset(data);
    }

    reset();
    setPreviewPhoto(null);
    setAssetSelected && setAssetSelected(undefined);
    closeButtonRef.current?.click();
    setIsOpen(false);
  }

  const { mutateAsync: handleCreateAsset } = useMutation({
    mutationFn: (formData: FormData) =>
      createAsset({ form: formData, condominiumId }),
    onSuccess: async () => {
      await invalidQueries();
    },
  });

  const { mutateAsync: handleUpdateAsset } = useMutation({
    mutationFn: (data: AssetFormData) =>
      updateAsset({ assetId: assetSelected!.id, data }),
    onSuccess: async () => {
      await invalidQueries();
    },
  });
  async function invalidQueries() {
    await queryClient.invalidateQueries({
      exact: true,
      queryKey: [condominiumId],
    });
  }

  const modalTitle =
    type === "create"
      ? "Adicionar Patrimônio"
      : type === "edit"
        ? "Editar Patrimônio"
        : "Visualizar Patrimônio";

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

      <DialogContent
        className="
    w-screen h-screen max-w-none max-h-none rounded-none
    md:w-auto md:h-auto md:max-w-[600px] md:rounded-lg
    flex flex-col
  "
      >
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
              {...register("code")}
              className="col-span-3"
              disabled={isDisabled}
            />
          </div>
          {errors.code && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.code.message}
            </p>
          )}

          {/* Área */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Área</Label>
            <Controller
              name="areaId"
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
          {errors.areaId && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.areaId.message}
            </p>
          )}

          {/* Categoria */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Categoria</Label>
            <Controller
              name="categoryId"
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
          {errors.categoryId && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.categoryId.message}
            </p>
          )}

          {/* Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <Controller
              name="statusId"
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
          {errors.statusId && !isDisabled && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.statusId.message}
            </p>
          )}

          {/* Foto */}

          {type === "create" && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Foto</Label>
              <div className="col-span-3 flex flex-col gap-2">
                <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600">
                  <Paperclip />
                  Clique para selecionar anexos.
                  <Controller
                    name="photo"
                    control={control}
                    render={({ field: { onChange } }) => (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const files = e.target.files; // pega os arquivos
                          if (!files || files.length === 0) {
                            setPreviewPhoto(null);
                            onChange(undefined);
                            return;
                          }

                          onChange(files); // atualiza RHF com FileList
                          const file = files[0];
                          const previewUrl = URL.createObjectURL(file);
                          setPreviewPhoto(previewUrl);
                        }}
                        disabled={isDisabled}
                        className="file-input hidden"
                      />
                    )}
                  />
                </label>
                {errors.photo && !isDisabled && (
                  <p className="text-red-500 text-sm">
                    {errors.photo.message?.toString()}
                  </p>
                )}

                {previewPhoto && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="mt-1 w-fit" variant="outline">
                        Ver imagem <Eye className="ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 flex items-center justify-center">
                      <img
                        src={previewPhoto}
                        alt="Foto em tela cheia"
                        className="w-full h-full object-contain rounded-md"
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          )}

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
