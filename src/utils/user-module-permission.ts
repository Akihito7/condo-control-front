import { ModulePermissionByRole } from "@/api/fetch-me";
import { useUserContext } from "@/providers/use-user-context"

export function userModulePermission({ moduleId, modules }: { moduleId: number, modules: ModulePermissionByRole[] }) {

  const module = modules
    ?.find(module => module.moduleId === moduleId);

  if (!module) return false;

  return module.read;
}