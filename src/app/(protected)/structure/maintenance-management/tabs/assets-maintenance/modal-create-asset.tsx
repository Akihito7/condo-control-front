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
import { useState } from "react";
import { Paperclip } from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { ModalCreateType } from "./modal-create-type";

const assetSchema = z.object({
  code: z.string().min(1, "Informe o código"),
  name: z.string().min(1, "Informe o nome"),
  frequency: z.string().min(1, "Selecione a frequência"),
  supplier: z.string().min(1, "Informe o fornecedor"),
  lifespan: z
    .number({ invalid_type_error: "Informe um número" })
    .positive("Deve ser positivo"),
  installationDate: z.date(),
  documents: z
    .any()
    .refine(
      (files) => !files || files.length <= 5,
      "Máximo de 5 documentos permitidos"
    )
    .optional(),
});

type AssetFormData = z.infer<typeof assetSchema>;

export function ModalCreateAsset() {
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
      documents: undefined,
    },
  });

  const [selectedDocs, setSelectedDocs] = useState<File[]>([]);

  function onSubmit(data: AssetFormData) {
    console.log("Ativo cadastrado:", data);
    reset();
    setSelectedDocs([]);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar Ativo</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cadastrar Ativo</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para adicionar um novo ativo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Code */}
          <div className="grid grid-cols-4 items-center gap-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Tipo</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="1">Bomba de água</SelectItem>
              </SelectContent>
            </Select>

            <div className="ml-4">
              <ModalCreateType />
            </div>
          </div>

          {/* Frequency */}
          <div className="grid grid-cols-4 items-center gap-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Fornecedor</Label>
            <Input
              {...register("supplier")}
              placeholder="Ex: ABC Equipamentos Ltda"
              className="col-span-3"
            />
          </div>
          {errors.supplier && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.supplier.message}
            </p>
          )}

          {/* Lifespan */}
          <div className="grid grid-cols-4 items-center gap-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Data de instalação</Label>
            <Controller
              name="installationDate"
              control={control}
              render={({ field }) => {
                return (
                  <DatePicker date={field.value} setDate={field.onChange} />
                );
              }}
            />
          </div>
          {errors.installationDate && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.installationDate.message}
            </p>
          )}

          {/* Documents */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Documentos</Label>
            <div className="col-span-3 flex flex-col gap-2">
              <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-6 hover:border-gray-600">
                <Paperclip />
                Clique para selecionar documentos (máx. 5)
                <Controller
                  name="documents"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (!files) return;
                        onChange(files);
                        setSelectedDocs(Array.from(files));
                      }}
                      className="hidden"
                    />
                  )}
                />
              </label>

              {/* Show file names */}
              {selectedDocs.length > 0 && (
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {selectedDocs.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              )}

              {errors.documents && (
                <p className="text-red-500 text-sm">
                  {errors.documents.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost">
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
