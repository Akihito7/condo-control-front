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
import { CurrencyInput } from "@/components/currency-input";
import React, { useEffect, useRef, useState } from "react";
import { Option } from "@/api/fetch-work-areas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/api/create-employee";
import { useUserContext } from "@/providers/use-user-context";
import { OptionEmployee } from "@/api/fetch-employee-roles";
import { Employee } from "@/api/fetch-employees-structure";
import { updateEmployeeStructure } from "@/api/update-employee-structure";

const employeeSchema = z
  .object({
    name: z.string().min(3, "Informe o nome completo"),
    cpf: z.string().min(11, "CPF inválido"),
    workAreaId: z.string().min(1, "Informe a área"),
    employeeRoleId: z.string().min(1, "Informe o cargo"),
    salary: z.string().min(1, "Informe o salário"),
    status: z.string().min(1, "Informe o status"),
    phoneNumber: z.string().min(9, "Informe um numero valido"),
    email: z.string().optional(),
    password: z.string().optional(),
    hasLogin: z.boolean(),
    type: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.hasLogin) {
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email é obrigatório.",
          path: ["email"],
        });
      }

      if (data.type === "create") {
        if (!data.password || data.password?.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Senha deve ter no mínimo 8 caracteres.",
            path: ["password"],
          });
        }
      }
      if (data.type === "edit") {
        if (data.password && data.password.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Senha deve ter no mínimo 8 caracteres.",
            path: ["password"],
          });
        }
      }
    }
  });

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface ModalActionEmployeeProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  employeeRoles: OptionEmployee[] | undefined;
  employeeStatus: Option[] | undefined;
  workAreas: Option[] | undefined;
  employeeSelected: Employee | undefined;
  setEmployeeSelected: React.Dispatch<
    React.SetStateAction<Employee | undefined>
  >;
  type?: "create" | "edit";
}

export function ModalActionEmployee({
  isOpen,
  setIsOpen,
  employeeRoles = [],
  employeeStatus = [],
  workAreas = [],
  employeeSelected,
  type = "create",
  setEmployeeSelected,
}: ModalActionEmployeeProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      cpf: "",
      workAreaId: "",
      employeeRoleId: "",
      salary: "",
      status: "",
      phoneNumber: "",
      email: "",
      password: "",
      hasLogin: false,
      type,
    },
  });

  const { user } = useUserContext();
  const condominiumId = user.condominiumId;
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  async function onSubmit(data: EmployeeFormData) {
    if (type === "create") {
      await handleCreateEmployee(data);
    } else {
      await handleUpdateEmployee(data);
    }
    reset();
    closeButtonRef.current?.click();
  }

  const { mutateAsync: handleCreateEmployee } = useMutation({
    mutationFn: async (formData: EmployeeFormData) =>
      createEmployee({
        ...formData,
        condominiumId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });

  const { mutateAsync: handleUpdateEmployee } = useMutation({
    mutationFn: async (formData: EmployeeFormData) =>
      updateEmployeeStructure({
        ...formData,
        condominiumId,
        employeeId: employeeSelected!.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });
    },
  });
  const roleSelectedId = watch("employeeRoleId");
  const hasLogin = watch("hasLogin");

  useEffect(() => {
    const currentRoleSelected = employeeRoles.find(
      (role) => String(role.id) === String(roleSelectedId)
    );

    if (!currentRoleSelected) return;

    setValue("hasLogin", currentRoleSelected.has_login);
  }, [roleSelectedId]);

  useEffect(() => {
    if (employeeSelected) {
      const {
        cpf,
        employeeRoleId,
        name,
        phoneNumber,
        salary,
        statusId,
        email,
        workAreaId,
      } = employeeSelected;
      reset({
        name,
        cpf,
        employeeRoleId: String(employeeRoleId),
        salary: String(salary),
        phoneNumber,
        status: String(statusId),
        workAreaId: String(workAreaId),
        email,
        type: "edit",
      });
    }
  }, [employeeSelected]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          reset({
            cpf: "",
            email: "",
            hasLogin: false,
            employeeRoleId: "",
            name: "",
            password: "",
            phoneNumber: "",
            salary: "",
            status: "",
            workAreaId: "",
            type: "create",
          });
          setIsOpen(false);
          setEmployeeSelected(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Adicionar Funcionário</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {type === "create" ? "Adicionar Funcionário" : "Editar Funcionário"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar um novo colaborador.
            {type === "create"
              ? "Preencha os dados abaixo para cadastrar um novo colaborador."
              : "Preencha os dados abaixo para editar um novo colaborador."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Dados Pessoais */}
          <fieldset className="space-y-4 border border-gray-200 p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700 px-1">
              Informações Pessoais
            </legend>

            {/* Nome */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Nome Completo</Label>
              <Input {...register("name")} className="col-span-3" />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                {errors.name.message}
              </p>
            )}

            {/* CPF */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">CPF</Label>
              <Input {...register("cpf")} className="col-span-3 w-[200px]" />
            </div>
            {errors.cpf && (
              <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                {errors.cpf.message}
              </p>
            )}

            {/* Número */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Número</Label>
              <Input
                {...register("phoneNumber")}
                className="col-span-3 w-[200px]"
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                {errors.phoneNumber.message}
              </p>
            )}
          </fieldset>

          {/* Profissional */}
          <fieldset className="space-y-4 border border-gray-200 p-4 rounded-md">
            <legend className="text-sm font-medium text-gray-700 px-1">
              Informações Profissionais
            </legend>

            {/* Área */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Área</Label>
              <div className="col-span-3">
                <Controller
                  name="workAreaId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Selecione a área" />
                      </SelectTrigger>
                      <SelectContent>
                        {workAreas.map((area) => (
                          <SelectItem key={area.id} value={area.id.toString()}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            {errors.workAreaId && (
              <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                {errors.workAreaId.message}
              </p>
            )}

            {/* Cargo */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Cargo</Label>
              <div className="col-span-3">
                <Controller
                  name="employeeRoleId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Selecione o cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeRoles.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            {errors.employeeRoleId && (
              <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                {errors.employeeRoleId.message}
              </p>
            )}

            {/* Salário */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Salário</Label>
              <div className="col-span-3">
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
            {errors.salary && (
              <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                {errors.salary.message}
              </p>
            )}

            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Status</Label>
              <div className="col-span-3">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="min-w-40">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeStatus.map((status) => (
                          <SelectItem
                            key={status.id}
                            value={status.id.toString()}
                          >
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            {errors.status && (
              <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                {errors.status.message}
              </p>
            )}
          </fieldset>

          {/* Login */}
          {hasLogin && (
            <fieldset className="space-y-4 border border-gray-200 p-4 rounded-md">
              <legend className="text-sm font-medium text-gray-700 px-1">
                Acesso ao Sistema
              </legend>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <Input
                  {...register("email")}
                  className="col-span-3 w-[200px]"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                  {errors.email.message}
                </p>
              )}

              {/* Password */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Senha</Label>
                <Input
                  {...register("password")}
                  className="col-span-3 w-[200px]"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm -mt-2 ml-[145px]">
                  {errors.password.message}
                </p>
              )}
            </fieldset>
          )}

          {/* Ações */}
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button ref={closeButtonRef} variant="ghost">
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
