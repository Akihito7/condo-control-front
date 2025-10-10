"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const SchemaCreateCondominiumForm = z.object({
  tenantId: z.string().min(1, "O locatário é obrigatório"),
  managerId: z.string().min(1, "O síndico é obrigatório"),
  name: z.string().min(1, "O nome é obrigatório"),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().length(2, "O estado deve ter 2 letras").optional(),
  postal_code: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido")
    .optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email("E-mail inválido").optional(),
  foundation_date: z.string().optional(),
  number_of_blocks: z.coerce.number().optional(),
  number_of_units: z.coerce.number().optional(),
  description: z.string().optional(),
  internal_regulations: z.string().optional(),
  status: z.string().optional(),
});

export type CreateCondominiumFormValues = z.infer<
  typeof SchemaCreateCondominiumForm
>;

export default function CondominiumsCreate() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCondominiumFormValues>({
    resolver: zodResolver(SchemaCreateCondominiumForm),
  });

  // Mock de tenants e managers (substitua depois por dados reais)
  const tenants = [
    { id: "1", name: "Empresa Alpha LTDA" },
    { id: "2", name: "Condomínio Beta" },
  ];

  const managers = [
    { id: "10", name: "João Silva" },
    { id: "11", name: "Maria Oliveira" },
  ];

  async function handleCreateCondominium(data: CreateCondominiumFormValues) {
    console.log("CREATE CONDOMINIUM", data);
    // await mutateCreateCondominium(data);
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["home", "backoffice", "create condominium"]} />
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
            Criar Condomínio
          </h1>
        </div>
      </div>

      {/* Form */}
      <form
        className="rounded-xl space-y-10"
        onSubmit={handleSubmit(handleCreateCondominium)}
      >
        {/* Informações principais */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Informações Gerais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nome */}
            <div className="space-y-2">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Nome</Label>
                    <Input
                      placeholder="Digite o nome do condomínio"
                      {...field}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Cidade</Label>
                    <Input placeholder="Digite a cidade" {...field} />
                    {errors.city && (
                      <p className="text-red-500 text-sm">
                        {errors.city.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Controller
                name="state"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>UF</Label>
                    <Input placeholder="Ex: SP" maxLength={2} {...field} />
                    {errors.state && (
                      <p className="text-red-500 text-sm">
                        {errors.state.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Endereço</Label>
                    <Input
                      placeholder="Rua, número, complemento..."
                      {...field}
                    />
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="neighborhood"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Bairro</Label>
                    <Input placeholder="Digite o bairro" {...field} />
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="postal_code"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>CEP</Label>
                    <Input placeholder="00000-000" {...field} />
                    {errors.postal_code && (
                      <p className="text-red-500 text-sm">
                        {errors.postal_code.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Contato e administração */}
        <div className="border-t pt-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Contato e Administração
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Controller
                name="contact_phone"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Telefone de Contato</Label>
                    <Input placeholder="(00) 00000-0000" {...field} />
                  </>
                )}
              />
            </div>

            <div className="space-y-2">
              <Controller
                name="contact_email"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>E-mail de Contato</Label>
                    <Input placeholder="email@exemplo.com" {...field} />
                    {errors.contact_email && (
                      <p className="text-red-500 text-sm">
                        {errors.contact_email.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* ManagerId Select */}
            <div className="space-y-2">
              <Controller
                name="managerId"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Síndico / Responsável</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o síndico" />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.managerId && (
                      <p className="text-red-500 text-sm">
                        {errors.managerId.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* TenantId Select */}
          <div className="w-[250px] space-y-2">
            <Controller
              name="tenantId"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Locatário / Tenant</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o locatário" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          {tenant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tenantId && (
                    <p className="text-red-500 text-sm">
                      {errors.tenantId.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
        </div>

        {/* Detalhes adicionais */}
        <div className="border-t pt-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Detalhes do Condomínio
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Controller
              name="foundation_date"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Data de Fundação</Label>
                  <Input type="date" {...field} />
                </div>
              )}
            />

            <Controller
              name="number_of_blocks"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Nº de Blocos</Label>
                  <Input type="number" {...field} />
                </div>
              )}
            />

            <Controller
              name="number_of_units"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Nº de Unidades</Label>
                  <Input type="number" {...field} />
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Informações adicionais sobre o condomínio..."
                    rows={4}
                    {...field}
                  />
                </div>
              )}
            />

            <Controller
              name="internal_regulations"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Regulamento Interno</Label>
                  <Textarea
                    placeholder="Regras e observações internas..."
                    rows={4}
                    {...field}
                  />
                </div>
              )}
            />
          </div>

          <div className="space-y-2 w-[250px]">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <>
                  <Label>Status</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            />
          </div>
        </div>

        {/* Botão */}
        <div className="pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-base rounded-lg">
            Salvar Condomínio
          </Button>
        </div>
      </form>
    </>
  );
}
