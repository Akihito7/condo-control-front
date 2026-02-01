"use client";

import React, { useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateVisit } from "@/api/create-visit";
import { useUserContext } from "@/providers/use-user-context";
import { Apartment } from "@/api/fetch-apartaments";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const personSchema = z.object({
  fullName: z.string().min(3, "Nome muito curto"),
  cpf: z.string().min(11, "CPF inválido"),
});

const schema = z.object({
  unit: z.string().min(1, "Unidade/Apartamento obrigatória"),
  vehicle: z.string().optional(),
  visitorType: z.string().min(1, "Selecione o tipo de visitante"),
  people: z
    .array(personSchema)
    .min(1, "Pelo menos uma pessoa deve ser registrada"),
});

type FormData = z.infer<typeof schema>;

interface ModalRegisterVisitorProps {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  apartaments: Apartment[] | undefined;
}

export function ModalRegisterVisitor({
  modalIsOpen,
  setModalIsOpen,
  apartaments,
}: ModalRegisterVisitorProps) {
  const queryClient = useQueryClient();
  const { user } = useUserContext();
  const condominiumId = user.condominiumId;
  const buttonCloseRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      unit: "",
      people: [{ fullName: "", cpf: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  async function onSubmit(data: FormData) {
    await handleCreateVisit(data);
    buttonCloseRef.current?.click();
    reset();
  }

  const { mutateAsync: handleCreateVisit } = useMutation({
    mutationFn: (formData: FormData) =>
      CreateVisit({
        condominiumId,
        people: formData.people,
        visitType: formData.visitorType,
        apartamentNumber: formData.unit,
        vehiclePlate: formData.vehicle,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["visitors"],
        exact: false,
      });
    },
  });

  return (
    <Dialog
      open={modalIsOpen}
      onOpenChange={(open) => {
        setModalIsOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Registrar Visitante</Button>
      </DialogTrigger>

      <DialogContent
        className="
    w-screen h-screen max-w-none max-h-none rounded-none
    md:w-auto md:h-auto md:max-w-[600px] md:rounded-lg
    flex flex-col
  "
      >
        <DialogHeader>
          <DialogTitle>Registro de Visitantes</DialogTitle>
          <DialogDescription>
            Preencha as informações da unidade e das pessoas vinculadas à
            visita.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 py-4"
          noValidate
        >
          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">
                Unidade/Apto
              </Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione um apartamento." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {apartaments?.map((apartament) => (
                          <SelectItem value={String(apartament.id)}>
                            {apartament.apartmentNumber}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.unit && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.unit.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visitorType" className="text-right">
                Tipo de visitante
              </Label>
              <Input
                {...register(`visitorType`)}
                placeholder="Ex: Visitante, Prestador"
                className="col-span-3"
              />
              {errors.visitorType && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.visitorType?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vehicle" className="text-right">
                Veículo
              </Label>
              <Input
                {...register(`vehicle`)}
                placeholder="Opcional"
                className="col-span-3"
              />
            </div>
          </fieldset>

          {fields.map((field, index) => (
            <fieldset
              key={field.id}
              className="border border-gray-300 rounded-md p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <legend className="text-md font-semibold">
                  Pessoa {index + 1}
                </legend>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    Remover
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor={`people.${index}.fullName`}
                  className="text-right"
                >
                  Nome completo
                </Label>
                <Input
                  {...register(`people.${index}.fullName`)}
                  className="col-span-3"
                />
                {errors.people?.[index]?.fullName && (
                  <p className="col-start-2 col-span-3 text-sm text-red-600">
                    {errors.people[index]?.fullName?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`people.${index}.cpf`} className="text-right">
                  CPF
                </Label>
                <Input
                  {...register(`people.${index}.cpf`)}
                  className="col-span-3"
                />
                {errors.people?.[index]?.cpf && (
                  <p className="col-start-2 col-span-3 text-sm text-red-600">
                    {errors.people[index]?.cpf?.message}
                  </p>
                )}
              </div>
            </fieldset>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={() => append({ fullName: "", cpf: "" })}
          >
            Adicionar Pessoa
          </Button>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" ref={buttonCloseRef} type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Registrar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
