"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPlanById } from "@/api/backoffice/fetch-plan-by-id";
import { FormEditPlan } from "./form-edit-plan";
import { Plan } from "@/api/backoffice/fetch-plans";
import { useManagementSystemContext } from "../../../contexts/management-system-context";
import { ChevronLeft } from "lucide-react";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { useRouter } from "next/navigation";

export default function EditPlans({ params }: any) {
  const { planId } = React.use(params) as { planId: string };

  const router = useRouter();

  const { data: plan } = useQuery({
    queryKey: ["plans", planId],
    queryFn: () => fetchPlanById(planId),
  });

  const { pages } = useManagementSystemContext();

  return (
    <>
      <div className="space-y-2">
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
      {plan && pages && <FormEditPlan plan={plan} pages={pages} />}
    </>
  );
}
