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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDailyRequest } from "@/api/add-daily-request";

interface Option {
  id: number;
  name: string;
}

interface ModalActionProps {
  gravities?: Option[];
  statuses?: Option[];
  responsibles?: Option[];
}

const schema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  date: z.date(),
  gravityId: z.string().min(1, "Selecione a gravidade"),
  responsibleId: z.string().min(1, "Selecione o responsável"),
  statusId: z.string().min(1, "Selecione o status"),
  observation: z.string().optional(),
});

export type FormDataDailyRequest = z.infer<typeof schema>;

export function ModalAction({
  gravities,
  statuses,
  responsibles,
}: ModalActionProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataDailyRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      date: new Date(),
      gravityId: "",
      responsibleId: "",
      statusId: "",
      observation: "",
    },
  });

  async function onSubmit(data: FormDataDailyRequest) {
    await handleCreateTask(data);
    closeRef.current?.click();
    reset();
    queryClient.invalidateQueries({
      queryKey: ["daily", "registers"],
      exact: false,
    });
  }

  const queryClient = useQueryClient();
  const { mutateAsync: handleCreateTask } = useMutation({
    mutationFn: (form: FormDataDailyRequest) => addDailyRequest(form),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Nova Ação</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Ação</DialogTitle>
          <DialogDescription>Preencha as informações abaixo</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 py-4"
          noValidate
        >
          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            {/* Nome */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nome</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} className="col-span-3" />
                )}
              />
              {errors.name && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Data */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Data</Label>
              <Controller
                name="date"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DatePicker date={value} setDate={onChange} />
                )}
              />
            </div>

            {/* Gravidade */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Gravidade</Label>
              <Controller
                name="gravityId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {gravities?.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Responsável */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Responsável</Label>
              <Controller
                name="responsibleId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsibles?.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <Controller
                name="statusId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses?.map((s) => (
                        <SelectItem key={s.id} value={String(s.id)}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Observação */}
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right">Observação</Label>
              <Controller
                name="observation"
                control={control}
                render={({ field }) => (
                  <Textarea {...field} className="col-span-3" rows={3} />
                )}
              />
            </div>
          </fieldset>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" ref={closeRef} type="button">
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
