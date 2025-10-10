"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export const SchemaCreatePlanForm = z.object({
  name: z.string().min(1, "O nome do plano é obrigatório"),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .min(0, "O preço deve ser maior ou igual a zero")
    .optional(),
  is_custom: z.boolean().optional(),
});

export type CreatePlanFormValues = z.infer<typeof SchemaCreatePlanForm>;

export default function CreatePlans() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePlanFormValues>({
    resolver: zodResolver(SchemaCreatePlanForm),
  });

  /* const { mutateAsync: mutateCreatePlan } = useMutation({
    mutationFn: (data: CreatePlanFormValues) => createPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["plans"],
      });
      router.back();
    },
  }); */

  async function handleCreatePlan(data: CreatePlanFormValues) {
    console.log("CREATE PLAN", data);
    // await mutateCreatePlan(data);
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["home", "backoffice", "create plan"]} />
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-100 rounded-md p-2 cursor-pointer">
            <ChevronLeft
              className="text-gray-600"
              size={24}
              onClick={() => router.back()}
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Criar Plano</h1>
        </div>
      </div>

      {/* Form */}
      <form
        className="rounded-xl space-y-10"
        onSubmit={handleSubmit(handleCreatePlan)}
      >
        {/* Informações do Plano */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Informações do Plano
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
                    <Input placeholder="Digite o nome do plano" {...field} />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Preço</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm">
                        {errors.price.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>

            {/* Is Custom */}
            <div className="flex items-center gap-3 mt-6">
              <Controller
                name="is_custom"
                control={control}
                render={({ field }) => (
                  <>
                    <Checkbox
                      id="is_custom"
                      checked={field.value || false}
                      onCheckedChange={field.onChange}
                    />
                    <label
                      htmlFor="is_custom"
                      className="text-sm font-medium text-gray-700"
                    >
                      Personalizado
                    </label>
                  </>
                )}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <>
                    <Label>Descrição</Label>
                    <Textarea
                      placeholder="Descrição do plano..."
                      rows={4}
                      {...field}
                    />
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Botão */}
        <div className="pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-base rounded-lg">
            Salvar Plano
          </Button>
        </div>
      </form>
    </>
  );
}
