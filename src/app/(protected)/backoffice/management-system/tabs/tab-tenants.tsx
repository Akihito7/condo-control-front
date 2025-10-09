import { Button } from "@/components/ui/button";

export function TabTenants() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
      <Button variant="outline">Criar Tenant</Button>
    </div>
  );
}
