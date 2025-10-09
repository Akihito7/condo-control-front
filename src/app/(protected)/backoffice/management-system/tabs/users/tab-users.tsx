import { Button } from "@/components/ui/button";
import Link from "next/link";
export function TabUsers() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
      <Button variant="outline">
        <Link href="users/create">Criar Usuário</Link>
      </Button>
    </div>
  );
}
