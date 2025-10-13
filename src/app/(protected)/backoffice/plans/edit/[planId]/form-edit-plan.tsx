import React, { useEffect, useState } from "react";
import { useManagementSystemContext } from "../../../contexts/management-system-context";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plan } from "@/api/backoffice/fetch-plan-by-id";
import { Page } from "@/api/backoffice/fetch-pages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePlan } from "@/api/backoffice/update-plan";
import { useRouter } from "next/navigation";

interface FormEditPlanProps {
  plan: Plan;
  pages: Page[];
}

const SchemeUpdatePlan = z.object({
  name: z.string().min(1, "O nome do plano é obrigatório"),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .min(0, "O preço deve ser maior ou igual a zero")
    .optional(),
  is_custom: z.boolean().optional(),
  pages: z.array(
    z.object({
      pageId: z.number(),
      pageName: z.string(),
    })
  ),
});

export type FormUpdatePlanValues = z.infer<typeof SchemeUpdatePlan>;

export function FormEditPlan({ plan, pages }: FormEditPlanProps) {
  const [pagesSelectedToDetach, setPagesSelectedToDetach] = useState<number[]>(
    []
  );
  const [pagesSelectedToAttach, setPagesSelectedToAttach] = useState<number[]>(
    []
  );

  function getPageDetails(pageId: number) {
    return pages?.find((page) => page.id === pageId);
  }

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormUpdatePlanValues>({
    resolver: zodResolver(SchemeUpdatePlan),
    defaultValues: {
      name: plan.name,
      description: plan.description ?? "",
      is_custom: !!plan.isCustom,
      price: plan.price,
      pages: plan.planPage?.map((page) => ({
        pageId: page.pageId,
        pageName: getPageDetails(page.pageId)?.name ?? "",
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "pages",
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: mutateUpdatePlan } = useMutation({
    mutationFn: (data: FormUpdatePlanValues) => updatePlan(plan.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["plans"],
      });
      router.back();
    },
  });

  async function handleUpdatePlan(data: FormUpdatePlanValues) {
    await mutateUpdatePlan(data);
  }

  function pageIncludesToDetach(pageId: number) {
    return pagesSelectedToDetach.includes(pageId);
  }

  function pageIncludesToAttach(pageId: number) {
    return pagesSelectedToAttach.includes(pageId);
  }

  const availablePages =
    pages?.filter(
      (page) => !fields.map((field) => field.pageId).includes(page.id)
    ) || [];

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <form className="rounded-xl">
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
      </form>

      <h2 className="text-xl font-semibold mb-4 mt-6">
        Relacionamento do Plano com Páginas
      </h2>

      <div className="flex gap-4">
        {/* Coluna da esquerda - Páginas disponíveis */}
        <div className="w-1/2 border rounded-md p-4 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              {availablePages.length} página(s) disponíveis
            </span>
          </div>
          <div className="text-sm text-gray-500 mb-2">
            {pagesSelectedToAttach.length} selecionada(s)
          </div>

          <div className="flex-1 overflow-auto divide-y divide-gray-200">
            {availablePages.map((page) => {
              const isSelected = pageIncludesToAttach(page.id);
              return (
                <button
                  key={page.id}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm transition-all
                      rounded 
                      ${
                        isSelected
                          ? "bg-gray-100 border border-gray-300"
                          : "hover:bg-gray-50"
                      }
                    `}
                  onClick={() => {
                    setPagesSelectedToAttach((prev) =>
                      isSelected
                        ? prev.filter((id) => id !== page.id)
                        : [...prev, page.id]
                    );
                  }}
                >
                  {page.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col justify-center items-center gap-4">
          <button
            onClick={() => {
              const newPages = pagesSelectedToAttach.map((pageId) => {
                const page = getPageDetails(pageId);
                return {
                  pageId,
                  pageName: page?.name ?? "",
                };
              });

              setValue("pages", [...fields, ...newPages]);

              setPagesSelectedToAttach([]);
            }}
            className="flex items-center gap-2 bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
          >
            <ArrowRight size={16} />
            Relacionar
          </button>

          <button
            onClick={() => {
              const pagesFiltered = fields.filter(
                (field) => !pagesSelectedToDetach.includes(field.pageId)
              );

              const mappedPages = pagesFiltered.map((page) => ({
                pageId: page.pageId,
                pageName: getPageDetails(page.pageId)?.name ?? "",
              }));

              setValue("pages", mappedPages);
              setPagesSelectedToDetach([]);
            }}
            className="flex items-center gap-2 bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
          >
            <ArrowLeft size={16} />
            Desvincular
          </button>
        </div>

        {/* Coluna da direita - Páginas relacionadas */}
        <div className="w-1/2 border rounded-md p-4 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">
              {fields.length} página(s) relacionadas
            </span>
          </div>

          <div className="text-sm text-gray-500 mb-2">
            {pagesSelectedToDetach.length} selecionada(s)
          </div>

          <div className="flex-1 overflow-auto divide-y divide-gray-200">
            {fields.map((page) => {
              const isSelected = pageIncludesToDetach(page.pageId);
              return (
                <button
                  key={page.pageId}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm transition-all
                      rounded
                      ${
                        isSelected
                          ? "bg-gray-100 border border-gray-300"
                          : "hover:bg-gray-50"
                      }
                    `}
                  onClick={() => {
                    setPagesSelectedToDetach((prev) =>
                      isSelected
                        ? prev.filter((id) => id !== page.pageId)
                        : [...prev, page.pageId]
                    );
                  }}
                >
                  {page.pageName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={handleSubmit(handleUpdatePlan)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-base rounded-lg"
        >
          Salvar
        </Button>
      </div>
    </>
  );
}
