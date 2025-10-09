"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
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
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { fetchUserById } from "@/api/backoffice/fetch-user-by-id";

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
export default function EditUser({ params }: any) {
  const router = useRouter();

  const { userId } = React.use(params) as { userId: string };

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(SchemaCreateUserForm),
    defaultValues: {
      apartment: "",
      condominium: "",
      documentNumber: "",
      email: "",
      isSuper: false,
      name: "",
      password: undefined,
      phone: "",
      role: "",
    },
  });

  const { data: user, status: statusUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserById(userId),
  });

  useEffect(() => {
    if (statusUser === "success") {
      const setUserForm = () => {
        const apartamentId = user.userAssociationApartmentId
          ? String(user.userAssociationApartmentId)
          : "";

        const condominiumId = user.userAssociationCondominiumId
          ? String(user.userAssociationCondominiumId)
          : "";
        reset({
          name: user.name ?? "",
          email: user.email ?? "",
          apartment: apartamentId,
          condominium: condominiumId,
          isSuper: !!user.isSuper,
          documentNumber: user.cpf ?? "",
          phone: user.phone ?? "",
          role: user.userAssociationRole ?? "",
        });
      };
      setUserForm();
    }
  }, [statusUser]);

  async function handleCreateUser(data: CreateUserFormValues) {
    console.log("USUARIO EDITADO ", data);
  }

  //buscar os dados do user, e setar como default value

  return (
    <div className="p-6">
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["home", "backoffice", "create user"]} />
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-100 rounded-md p-2 cursor-pointer">
            <ChevronLeft
              className="text-gray-600"
              size={24}
              onClick={() => router.back()}
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Editar Usuário
          </h1>
        </div>
      </div>

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
                    <Input
                      placeholder="Digite o número de telefone"
                      {...field}
                    />
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
                        if (value.length === 0)
                          return field.onChange(undefined);
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
                name="apartment"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Apartamento</Label>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um apartamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="101">Apartamento 101</SelectItem>
                        <SelectItem value="102">Apartamento 102</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="condominium"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Condomínio</Label>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um condomínio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residencial">
                          Residencial Central
                        </SelectItem>
                        <SelectItem value="premium">Premium Towers</SelectItem>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="sindico">Síndico</SelectItem>
                        <SelectItem value="porteiro">Porteiro</SelectItem>
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
    </div>
  );
}
