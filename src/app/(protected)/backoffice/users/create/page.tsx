"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
import { useManagementSystemContext } from "../../contexts/management-system-context";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/api/backoffice/create-user";
import { AxiosError } from "axios";
const SchemaCreateUserForm = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  documentNumber: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  isSuper: z.boolean().optional(),

  apartment: z.string().optional(),
  condominium: z.string().optional(),
  role: z.string().optional(),
});

export type CreateUserFormValues = z.infer<typeof SchemaCreateUserForm>;

export default function UsersCreate() {
  const {
    apartaments,
    apartamentsStatus,
    condominiums,
    setCondominiumIdSelected,
    condominiumIdSelected,
  } = useManagementSystemContext();

  const router = useRouter();

  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(SchemaCreateUserForm),
  });

  const queryClient = useQueryClient();

  const { mutateAsync: mutateCreateUser } = useMutation({
    mutationFn: (data: CreateUserFormValues) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["users"],
      });
      router.back();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        const message =
          error?.response?.data?.message || error?.message || "Erro inesperado";

        return toast.error(message);
      }
      toast.error(error.message);
    },
  });

  async function handleCreateUser(data: CreateUserFormValues) {
    await mutateCreateUser(data);
  }

  useEffect(() => {
    setValue("apartment", undefined);
  }, [condominiumIdSelected]);

  return (
    <>
      <div className="space-y-4 mb-10">
        <div className="flex items-center mb-8 gap-2">
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
            Criar Usuário
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
                        setCondominiumIdSelected(Number(value));
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Selecione um condomínio" />
                      </SelectTrigger>
                      <SelectContent>
                        {condominiums?.map((condominium, index) => (
                          <SelectItem
                            key={index}
                            value={String(condominium.id)}
                          >
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
                      disabled={!condominiumIdSelected}
                    >
                      <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Selecione um apartamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {apartaments?.map((apartament, index) => (
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
    </>
  );
}
