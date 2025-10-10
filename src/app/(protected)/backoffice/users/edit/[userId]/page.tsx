"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchUserById } from "@/api/backoffice/fetch-user-by-id";
import { useManagementSystemContext } from "../../../contexts/management-system-context";
import { FormEdit } from "./form-edit";

export default function EditUser({ params }: any) {
  const router = useRouter();
  const { userId } = React.use(params) as { userId: string };

  const { data: user, isSuccess } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });

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
        {user && <FormEdit user={user} />}
      </div>
    </div>
  );
}
