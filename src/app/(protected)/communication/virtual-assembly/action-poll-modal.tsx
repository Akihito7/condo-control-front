"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PollWithStats } from "@/api/fetch-assembly-polls";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPoll } from "@/api/create-poll";
import { updatePoll } from "@/api/update-poll";
import { DatePickerWithHours } from "@/components/date-picker-with-hours";

interface CreatePollFormValues {
  title: string;
  description: string;
  endDate: Date | undefined;
}

interface ActionPollModalProps {
  pollSelected: PollWithStats | undefined;
  setPollSelected: React.Dispatch<
    React.SetStateAction<PollWithStats | undefined>
  >;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: "create" | "edit";
}

export function ActionPollModal({
  isOpen,
  setIsOpen,
  pollSelected,
  type,
  setPollSelected,
}: ActionPollModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreatePollFormValues>({
    defaultValues: {
      title: "",
      description: "",
      endDate: undefined,
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync: handleCreatePoll } = useMutation({
    mutationFn: async (data: CreatePollFormValues) => createPoll(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls"],
        exact: false,
      });
    },
  });

  const { mutateAsync: handleUpdatePoll } = useMutation({
    mutationFn: async (data: CreatePollFormValues) => {
      updatePoll({
        pollId: pollSelected!.id,
        ...data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls"],
        exact: false,
      });
    },
  });

  const onSubmit = async (data: CreatePollFormValues) => {
    if (type === "create") {
      await handleCreatePoll(data);
    } else {
      await handleUpdatePoll(data);
    }
    setIsOpen(false);
    setPollSelected(undefined);
    reset();
  };

  useEffect(() => {
    if (pollSelected && type === "edit") {
      reset({
        title: pollSelected.title,
        description: pollSelected.description,
        endDate: pollSelected.endDate
          ? new Date(pollSelected.endDate)
          : (null as any),
      });
    } else {
      reset({
        title: "",
        description: "",
        endDate: null as any,
      });
    }
  }, [pollSelected, reset, type]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setPollSelected(undefined);
          reset();
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Criar Enquete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {type === "create" ? "Nova Enquete" : "Editar Enquete"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {type === "create"
              ? "Preencha os dados abaixo para criar uma nova"
              : "Preencha os dados abaixo para editar"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Informações básicas
            </legend>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Digite o título da enquete"
                  {...register("title", { required: "Título obrigatório" })}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Detalhes sobre a enquete"
                  {...register("description")}
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">Data</legend>
            <div className="space-y-2">
              <Label>Data de Encerramento</Label>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DatePickerWithHours
                    date={field.value}
                    setDate={field.onChange}
                  />
                )}
              />
            </div>
          </fieldset>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="ghost" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              {type === "create" ? "Criar" : "Editar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
