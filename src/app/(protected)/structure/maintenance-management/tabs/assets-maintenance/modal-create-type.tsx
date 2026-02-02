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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { maintenanceManagementAssetsTypesCreate } from "@/api/maintenance-management-assets-types-create";

const typeSchema = z.object({
  name: z.string().min(1, "Informe o nome do tipo"),
});

type TypeFormData = z.infer<typeof typeSchema>;

export function ModalCreateType() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TypeFormData>({
    resolver: zodResolver(typeSchema),
    defaultValues: { name: "" },
  });

  const buttonCloseRef = useRef<HTMLButtonElement>(null);
  const query = useQueryClient();

  async function onSubmit(form: TypeFormData) {
    const { name } = form;
    await handleCreateAsset(name);
  }

  const { mutateAsync: handleCreateAsset } = useMutation({
    mutationFn: (name: string) => maintenanceManagementAssetsTypesCreate(name),
    onSuccess: (data) => {
      reset({ name: "" });
      query.invalidateQueries({
        queryKey: ["assets-types"],
        exact: false,
      });
      buttonCloseRef.current?.click();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          Cadastrar Tipo
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-full sm:max-w-[700px] md:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cadastrar Tipo</DialogTitle>
          <DialogDescription>
            Preencha o campo abaixo para adicionar um novo tipo de ativo.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4 items-center">
            <Label className="text-right">Nome</Label>
            <Input
              {...register("name")}
              placeholder="Ex: Fire Extinguisher"
              className="col-span-3"
            />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm -mt-2 ml-[100px]">
              {errors.name.message}
            </p>
          )}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="ghost" ref={buttonCloseRef}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSubmit(onSubmit)}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
