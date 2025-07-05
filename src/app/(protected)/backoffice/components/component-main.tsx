"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ComponentMain() {
  return (
    <div className="bg-white rounded-lg shadow-sm mt-8">
      <Tabs defaultValue="users" className="p-4">
        <TabsList className="bg-gray-50 p-1.5 rounded-lg border border-gray-200">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Usuários
          </TabsTrigger>
          <TabsTrigger
            value="condominium"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 px-4 py-2 rounded-md font-medium text-gray-600 transition-all"
          >
            Condomínios
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="users">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Criar usuário
              </button>
            </div>

            <Table>
              <TableCaption>Lista de usuários cadastrados</TableCaption>
              <TableHeader>
                <TableRow className="border-b border-[#e9e9ec]">
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-[#e9e9ec]">
                  <TableCell>1</TableCell>
                  <TableCell>Maria Silva</TableCell>
                  <TableCell>maria@email.com</TableCell>
                  <TableCell className="text-right">
                    <button className="cursor-pointer px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                      Editar
                    </button>
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-[#e9e9ec]">
                  <TableCell>2</TableCell>
                  <TableCell>João Souza</TableCell>
                  <TableCell>joao@email.com</TableCell>
                  <TableCell className="text-right">
                    <button className="cursor-pointer px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                      Editar
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="condominium">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Condomínios</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Criar condomínio
              </button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
