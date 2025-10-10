import { User } from "@/api/backoffice/fetch-users";
import { Button } from "@/components/ui/button";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/api/backoffice/delete-user";
import { useManagementSystemContext } from "../../contexts/management-system-context";

export function TabUsers() {
  const queryClient = useQueryClient();
  const { users, statusUsers, apartaments, condominiums } =
    useManagementSystemContext();

  function getApartament(apartamentId: number) {
    const currentApartament = apartaments?.find(
      (apartament) => apartament.id === apartamentId
    );

    return currentApartament;
  }

  function getCondominium(condominiumId: number) {
    const currentCondominium = condominiums?.find(
      (condominium) => condominium.id === condominiumId
    );

    return currentCondominium;
  }

  function getRole(role: string) {
    const rolesMapper = {
      resident: "Morador",
      admin: "Administrador",
      employee: "Funcionário",
    };

    return rolesMapper[role as keyof typeof rolesMapper];
  }

  const { mutateAsync: handleDeleteUser } = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ["users"],
      });
    },
  });
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
        <Button variant="outline">
          <Link href="users/create">Criar Usuário</Link>
        </Button>
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
                <TableHead>Email</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Apartamento</TableHead>
                <TableHead>Condominio</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{user.name ?? "-"}</TableCell>
                    <TableCell>{user.email ?? "-"}</TableCell>
                    <TableCell>{user.cpf ?? "-"}</TableCell>
                    <TableCell>{user.phone ?? "-"}</TableCell>
                    <TableCell>
                      {user?.userAssociationApartmentId
                        ? getApartament(user.userAssociationApartmentId)
                            ?.apartmentNumber
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {user?.userAssociationCondominiumId
                        ? getCondominium(user.userAssociationCondominiumId)
                            ?.name
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {user?.userAssociationRole
                        ? getRole(user?.userAssociationRole)
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Link href={`users/edit/${user.id}`}>
                        <Edit size={16} className="text-gray-700" />
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Trash
                        onClick={async () => {
                          await handleDeleteUser(user.id);
                        }}
                        size={16}
                        className="text-red-400"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </>
  );
}
