"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ModalCreateAsset } from "./modal-create-asset";

const ATIVOS_MOCKED = [
  {
    code: "ELV-001",
    name: " Elevador Social Bloco A",
    type: "Elevador",
    supplier: "Atlas Schindler",
    contact: "(11) 98765-4321",
    frequency: "Mensal",
    installationDate: "15/08/2015",
    estimatedUsefulLife: "15 Anos",
    remainingUsefulLife: "5 Anos",
  },
];

export function AssetsMaintenance() {
  const [code, setCode] = useState<string>();
  const [usefulLifeLessThanTwoYears, setUsefulLifeLessThanTwoYears] =
    useState("2");
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <div className="w-[250px] space-y-2">
          <Label>Busca por Código</Label>
          <Input
            placeholder="Ex: ELV-001"
            onChange={(event) => {
              const code = event.target.value;
              setCode(code);
            }}
          />
        </div>

        <div className=" space-y-2">
          <Label>Tipo de ativo</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo do ativo" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>

        <div className="w-[250px] space-y-2">
          <Label>Apenas vida útil menor que 2 anos</Label>
          <Select
            value={usefulLifeLessThanTwoYears}
            onValueChange={(choice) => setUsefulLifeLessThanTwoYears(choice)}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Sim/Não" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Sim</SelectItem>
              <SelectItem value="2">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">Ativos</h2>

          <ModalCreateAsset />
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-left">Contato</TableHead>
                <TableHead className="text-center">Data Instalação</TableHead>
                <TableHead className="text-left">Frequência</TableHead>
                <TableHead>Vida Útil Estimada</TableHead>
                <TableHead>Vida Útil Restante</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ATIVOS_MOCKED.map((asset) => (
                <TableRow key={asset.code}>
                  <TableCell>{asset.code}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.type}</TableCell>
                  <TableCell>{asset.supplier}</TableCell>
                  <TableCell>{asset.contact}</TableCell>
                  <TableCell>{asset.installationDate}</TableCell>
                  <TableCell>{asset.frequency}</TableCell>
                  <TableCell>{asset.estimatedUsefulLife}</TableCell>
                  <TableCell>{asset.remainingUsefulLife}</TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                        <MoreHorizontal className="w-5 h-5 cursor-pointer text-gray-600" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Votar</DropdownMenuItem>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Excluir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
