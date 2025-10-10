import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useManagementSystemContext } from "../../contexts/management-system-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

export function TabPlans() {
  const { plans } = useManagementSystemContext();
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Planos</h1>
        <Button variant="outline">
          <Link href="plans/create">Criar Plano</Link>
        </Button>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Lista de planos</h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Preco</TableHead>
                <TableHead>Descricao</TableHead>
                <TableHead>Data de criacao</TableHead>
                <TableHead></TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans?.map((plan) => (
                <TableRow>
                  <TableCell>{plan.id}</TableCell>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>{plan.description ?? "-"}</TableCell>
                  <TableCell>{plan.createdAt ?? "-"}</TableCell>
                  <TableCell>
                    <Link href={`plans/edit/${plan.id}`}>
                      <Edit size={16} className="text-gray-700" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Trash size={16} className="text-red-400" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
