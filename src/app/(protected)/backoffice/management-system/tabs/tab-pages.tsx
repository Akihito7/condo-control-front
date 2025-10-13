import { Button } from "@/components/ui/button";
import { useManagementSystemContext } from "../../contexts/management-system-context";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";

export function TabPages() {
  const { pages, modules } = useManagementSystemContext();

  function getModuleDetails(moduleId: number) {
    return modules?.find((module) => module.id === moduleId);
  }
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paginas</h1>
        <Button variant="outline">Criar Pagina</Button>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Lista de Paginas
          </h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Modulo</TableHead>
                <TableHead>Nome Icone</TableHead>
                <TableHead>Nome Pagina</TableHead>
                <TableHead>Path</TableHead>
                <TableHead className="text-center">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages?.map((page, index) => (
                <TableRow key={index}>
                  <TableCell>{page.id}</TableCell>
                  <TableCell>
                    {page.moduleId
                      ? getModuleDetails(page.moduleId)?.name
                      : "-"}
                  </TableCell>
                  <TableCell>{page.iconName ?? "-"}</TableCell>
                  <TableCell>{page.name}</TableCell>
                  <TableCell>{page.routePath}</TableCell>

                  <TableCell className="flex space-x-4 items-center justify-center">
                    <Link href={`pages/edit/${page.id}`}>
                      <Edit size={16} className="text-gray-700" />
                    </Link>

                    <Trash size={16} className="text-red-400 cursor-pointer" />
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
