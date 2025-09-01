"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { Paperclip, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Asset } from "@/api/fetch-assets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReportAsset } from "@/api/create-report-asset";
import { useUserContext } from "@/providers/use-user-context";

export interface ReportFormData {
  description: string;
  photo?: FileList;
}

interface ModalReportProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  assetSelected: Asset | undefined;
  setAssetSelected: React.Dispatch<React.SetStateAction<Asset | undefined>>;
}

export function ModalReport({
  isOpen,
  setIsOpen,
  assetSelected,
  setAssetSelected,
}: ModalReportProps) {
  const { register, handleSubmit, control, reset, getValues } =
    useForm<ReportFormData>();
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const { condominiumId } = user;

  const { mutateAsync: handleCreateReport } = useMutation({
    mutationFn: (formData: FormData) =>
      createReportAsset({
        assetId: assetSelected!.id,
        formData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: [condominiumId],
      });
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    const formData = new FormData();
    formData.append("description", data.description);
    if (data.photo) {
      Array.from(data.photo).forEach((file) => formData.append("photos", file));
    }
    await handleCreateReport(formData);

    reset();
    setPreviewPhotos([]);
    setCurrentIndex(0);
    closeButtonRef.current?.click();
    setIsOpen(false);
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setPreviewPhotos([]);
      return;
    }
    setPreviewPhotos(
      Array.from(files).map((file) => URL.createObjectURL(file))
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? previewPhotos.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === previewPhotos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset();
          setPreviewPhotos([]);
          setCurrentIndex(0);
          setAssetSelected(undefined);
          setIsOpen(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Reportar Problema</DialogTitle>
          <DialogDescription>
            Item: {assetSelected?.name} ({assetSelected?.codeItem})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Descrição */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Descrição</Label>
            <Textarea
              {...register("description", { required: true })}
              className="col-span-3"
              placeholder="Descreva o problema"
            />
          </div>

          {/* Foto */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Foto (Opcional)</Label>
            <div className="col-span-3 flex flex-col gap-2">
              <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600">
                <Paperclip />
                Clique para selecionar fotos
                <Controller
                  name="photo"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        onChange(files || undefined);
                        handleFileChange(files);
                        setCurrentIndex(0);
                      }}
                      className="hidden"
                    />
                  )}
                />
              </label>

              {/* Nomes dos arquivos selecionados */}
              {getValues("photo") && getValues("photo")!.length > 0 && (
                <div className="flex flex-col gap-1">
                  {Array.from(getValues("photo")!).map(
                    (file: File, index: number) => (
                      <span key={index} className="text-sm text-gray-700">
                        {file.name}
                      </span>
                    )
                  )}
                </div>
              )}

              {/* Botão para ver imagens */}
              {previewPhotos.length > 0 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-1 w-fit" variant="outline">
                      Ver imagens <Eye className="ml-1" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <ChevronLeft />
                    </button>
                    <img
                      src={previewPhotos[currentIndex]}
                      alt={`Preview ${currentIndex + 1}`}
                      className="w-full h-full object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <ChevronRight />
                    </button>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button ref={closeButtonRef} variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Reportar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
