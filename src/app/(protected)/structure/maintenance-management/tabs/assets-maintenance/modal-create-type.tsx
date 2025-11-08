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

  function onSubmit(data: TypeFormData) {
    console.log("Novo tipo criado:", data);
    reset();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-sm">
          Cadastrar Tipo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cadastrar Tipo</DialogTitle>
          <DialogDescription>
            Preencha o campo abaixo para adicionar um novo tipo de ativo.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
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
              <Button type="button" variant="ghost">
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
