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
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createTenant } from "@/api/backoffice/create-tenant";
import { useEffect } from "react";

// === Schema ===
export const SchemaCreateTenantForm = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  plan_id: z.string().min(1, "O plano é obrigatório"),
  owner_id: z.string().min(1, "O proprietário é obrigatório"),
  last_payment_at: z.string().optional(),
  is_active: z.boolean().optional(),
});

export type CreateTenantFormValues = z.infer<typeof SchemaCreateTenantForm>;

export default function CreateTenants() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Simulação de dados — substitua depois por suas queries reais
  const owners = [
    { id: 1, name: "Carlos Souza" },
    { id: 2, name: "Marina Oliveira" },
    { id: 3, name: "Guilherme Iha" },
  ];

  const plans = [
    { id: 1, name: "Plano Básico" },
    { id: 2, name: "Plano Premium" },
    { id: 3, name: "Plano Empresarial" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTenantFormValues>({
    resolver: zodResolver(SchemaCreateTenantForm),
  });

  /* const { mutateAsync: mutateCreateTenant } = useMutation({
    mutationFn: (data: CreateTenantFormValues) => createTenant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["tenants"],
      });
      router.back();
    },
  }); */

  async function handleCreateTenant(data: CreateTenantFormValues) {
    console.log("CREATE TENANT", data);
    // await mutateCreateTenant(data);
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["home", "backoffice", "create tenant"]} />
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
            Criar Tenant
          </h1>
        </div>
      </div>

      {/* Form */}
      <form
        className="rounded-xl space-y-10"
        onSubmit={handleSubmit(handleCreateTenant)}
      >
        {/* Seção: Informações Gerais */}
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
                    <Input placeholder="Digite o nome do tenant" {...field} />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Proprietário (owner_id) */}
            <div className="space-y-2">
              <Controller
                name="owner_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Proprietário (Owner)</Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o proprietário" />
                      </SelectTrigger>
                      <SelectContent>
                        {owners.map((owner) => (
                          <SelectItem key={owner.id} value={String(owner.id)}>
                            {owner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.owner_id && (
                      <p className="text-red-500 text-sm">
                        {errors.owner_id.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Plano (plan_id) */}
            <div className="space-y-2">
              <Controller
                name="plan_id"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Plano</Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={String(plan.id)}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.plan_id && (
                      <p className="text-red-500 text-sm">
                        {errors.plan_id.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Seção: Status e Pagamento */}
        <div className="border-t pt-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Status e Pagamento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Último pagamento */}
            <div className="space-y-2">
              <Controller
                name="last_payment_at"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Último Pagamento</Label>
                    <Input type="date" {...field} />
                  </>
                )}
              />
            </div>

            {/* Status (ativo/inativo) */}
            <div className="space-y-2 w-[250px]">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Status</Label>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                      value={
                        field.value !== undefined
                          ? field.value
                            ? "true"
                            : "false"
                          : undefined
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Ativo</SelectItem>
                        <SelectItem value="false">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Botão */}
        <div className="pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-base rounded-lg">
            Salvar Tenant
          </Button>
        </div>
      </form>
    </div>
  );
}
