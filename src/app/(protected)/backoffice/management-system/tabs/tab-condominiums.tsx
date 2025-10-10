import { Condominium } from "@/api/backoffice/fetch-condominiums";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import { useManagementSystemContext } from "../../contexts/management-system-context";

export function TabCondominiums() {
  const { condominiums, statusCondominiums } = useManagementSystemContext();
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Condomínios</h1>

        <Link href="condominiums/create">
          <Button variant="outline">Criar Condomínio</Button>
        </Link>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Lista de usuários
          </h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>CEP</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Gerente</TableHead>
                <TableHead>Regulamento Interno</TableHead>
                <TableHead>Data de Fundação</TableHead>
                <TableHead>Blocos</TableHead>
                <TableHead>Unidades</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {condominiums?.map((condominium, index) => (
                <TableRow key={index}>
                  <TableCell>{condominium.name ?? "-"}</TableCell>
                  <TableCell>{condominium.address ?? "-"}</TableCell>
                  <TableCell>{condominium.neighborhood ?? "-"}</TableCell>
                  <TableCell>{condominium.city ?? "-"}</TableCell>
                  <TableCell>{condominium.state ?? "-"}</TableCell>
                  <TableCell>{condominium.postalCode ?? "-"}</TableCell>
                  <TableCell>{condominium.contactEmail ?? "-"}</TableCell>
                  <TableCell>{condominium.contactPhone ?? "-"}</TableCell>
                  <TableCell>{condominium.manager ?? "-"}</TableCell>
                  <TableCell>
                    {condominium.internalRegulations ?? "-"}
                  </TableCell>
                  <TableCell>{condominium.foundationDate ?? "-"}</TableCell>
                  <TableCell>{condominium.numberOfBlocks ?? "-"}</TableCell>
                  <TableCell>{condominium.numberOfUnits ?? "-"}</TableCell>
                  <TableCell>{condominium.status ?? "-"}</TableCell>

                  <TableCell>
                    <Link href={`users/edit/${condominium.id}`}>
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
