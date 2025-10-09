import { Button } from "@/components/ui/button";

export function TabPlans() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Planos</h1>
      <Button variant="outline">Criar Plano</Button>
    </div>
  );
}
