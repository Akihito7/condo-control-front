"use client";

import { User } from "@/api/backoffice/fetch-users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import React, { useEffect } from "react";
import { useManagementSystemContext } from "../../../contexts/management-system-context";

export const SchemaCreateUserForm = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  documentNumber: z.string().min(1, "O número do documento é obrigatório"),
  phone: z.string().min(1, "O telefone é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres")
    .optional(),
  isSuper: z.boolean().optional(),

  apartment: z.string().optional(),
  condominium: z.string().optional(),
  role: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof SchemaCreateUserForm>;

export function FormEdit({ user }: { user: User }) {
  const { apartaments, condominiums } = useManagementSystemContext();
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(SchemaCreateUserForm),
    defaultValues: {
      name: user.name,
      documentNumber: user.cpf,
      phone: user.phone,
      email: user.email,
      password: undefined,
      isSuper: !!user.isSuper,
      apartment: String(user?.userAssociationApartmentId ?? ""),
      condominium: String(user?.userAssociationCondominiumId ?? ""),
      role: user.userAssociationRole,
    },
  });

  const condominiumSelectedId = watch("condominium");

  async function handleCreateUser(data: CreateUserFormValues) {
    console.log("USUARIO CRIADO", data);
  }

  useEffect(() => {
    setValue("apartment", undefined);
  }, [condominiumSelectedId]);

  return (
    <form
      className="rounded-xl space-y-10"
      onSubmit={handleSubmit(handleCreateUser)}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Nome</Label>
                  <Input placeholder="Digite o nome" {...field} />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="documentNumber"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Nº de Documento</Label>
                  <Input placeholder="Digite o documento" {...field} />
                  {errors.documentNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.documentNumber.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Telefone</Label>
                  <Input placeholder="Digite o número de telefone" {...field} />
                  {errors.phone && (
                    <p className="text-red-500 text-sm">
                      {errors.phone.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <Label>E-mail</Label>
                  <Input
                    type="email"
                    placeholder="Digite o e-mail"
                    {...field}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    placeholder="Digite a senha"
                    {...field}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.length === 0) return field.onChange(undefined);
                      field.onChange(value);
                    }}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div className="flex items-center gap-3 mt-6">
            <Controller
              name="isSuper"
              control={control}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="isSuper"
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="isSuper"
                    className="text-sm font-medium text-gray-700"
                  >
                    Is Super
                  </label>
                </>
              )}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-8 space-y-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Associações do Usuário
        </h2>

        <div className="flex gap-6 flex-wrap">
          <div className="space-y-2">
            <Controller
              name="condominium"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Condomínio</Label>
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione um condomínio" />
                    </SelectTrigger>
                    <SelectContent>
                      {condominiums?.map((condominium, index) => (
                        <SelectItem key={index} value={String(condominium.id)}>
                          {condominium.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Controller
              name="apartment"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Apartamento</Label>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value}
                    /* disabled={!condominiumSelectedId} */
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione um apartamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {apartaments
                        ?.filter(
                          (apartament) =>
                            apartament.condominiumId ===
                            Number(condominiumSelectedId)
                        )
                        .map((apartament, index) => (
                          <SelectItem key={index} value={String(apartament.id)}>
                            {apartament.apartmentNumber}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Função (Role)</Label>
                  <Select
                    {...field}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="employee">Funcionario</SelectItem>
                      <SelectItem value="resident">Morador</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-base rounded-lg">
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
