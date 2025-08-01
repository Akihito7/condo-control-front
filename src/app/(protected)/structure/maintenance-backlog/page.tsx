"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { ButtonOpenSidebar } from "@/components/button-open-sidebar";
import { DatePickRange } from "@/components/date-pick-ranger";
import { Button } from "@/components/ui/button";
import { CreditCard, FileDown, Pencil, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { CardMaintenance } from "./card-maintenance";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_DATA = [
  {
    prioridade: "Alta",
    tipo: "Serviço",
    descricao: "Conserto do portão da garagem",
    fornecedor: "Portões Silva",
    valor: 1200.0,
    formaPagamento: "Transferência",
    dataPagamento: "2025-08-05",
    conclusaoPagamento: "2025-08-06",
    status: "Pago",
    acoes: ["Visualizar", "Editar"],
  },
  {
    prioridade: "Média",
    tipo: "Produto",
    descricao: "Compra de lâmpadas LED",
    fornecedor: "Eletrônica Lima",
    valor: 350.0,
    formaPagamento: "Boleto",
    dataPagamento: "2025-08-07",
    conclusaoPagamento: null,
    status: "Pendente",
    acoes: ["Visualizar", "Cancelar"],
  },
  {
    prioridade: "Baixa",
    tipo: "Serviço",
    descricao: "Limpeza da caixa d'água",
    fornecedor: "Água Limpa Ltda",
    valor: 700.0,
    formaPagamento: "Pix",
    dataPagamento: "2025-08-10",
    conclusaoPagamento: null,
    status: "Aguardando Pagamento",
    acoes: ["Visualizar", "Confirmar"],
  },
  {
    prioridade: "Alta",
    tipo: "Produto",
    descricao: "Compra de extintores",
    fornecedor: "Segurança Total",
    valor: 890.0,
    formaPagamento: "Cartão",
    dataPagamento: "2025-07-30",
    conclusaoPagamento: "2025-07-30",
    status: "Pago",
    acoes: ["Visualizar"],
  },
  {
    prioridade: "Média",
    tipo: "Serviço",
    descricao: "Dedetização das áreas comuns",
    fornecedor: "Controle Pragas BR",
    valor: 980.0,
    formaPagamento: "Transferência",
    dataPagamento: "2025-08-03",
    conclusaoPagamento: null,
    status: "Em Processamento",
    acoes: ["Visualizar", "Editar", "Cancelar"],
  },
];

export default function MaintenanceBacklog() {
  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  });
  return (
    <main className="bg-gray-50 min-h-screen w-full p-0 py-8 px-2 sm:p-8 flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center mb-8 gap-2">
          <ButtonOpenSidebar />
          <Breadcrumb paths={["Início", "Estrutura e operações"]} />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Backlog de Manutenções
        </h1>
      </div>

      <div className="flex  flex-col gap-4 md:items-end md:flex-row ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecione o período
          </label>
          <DatePickRange range={range} setRange={setRange} />
        </div>

        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 h-10 cursor-pointer"
        >
          <FileDown className="w-6 h-6" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        <CardMaintenance
          amount={15000}
          title="Saldo Atual"
          icon={<Wallet className="text-blue-400" />}
        />
        <CardMaintenance
          amount={8500}
          title="Custo Melhorias Aprov./Inic."
          icon={<TrendingUp className="text-orange-400" />}
        />
        <CardMaintenance
          amount={15000}
          title="Saldo Futuro Projetado"
          icon={<Wallet className="text-purple-400" />}
        />
        <CardMaintenance
          amount={15000}
          title="Novos Custos Fixos Mensais"
          icon={<CreditCard className="text-green-400" />}
        />
      </div>

      <section className="rounded-xl overflow-auto border">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-gray-800 text-lg">
            Registros de Inadimplência
          </h2>
        </div>

        <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded">
          <Table className="min-w-full border-collapse">
            <TableHeader className="sticky top-0 bg-white shadow-md z-10">
              <TableRow>
                <TableHead>Prioridade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-left">Valor</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Data de Pagamento</TableHead>
                <TableHead>Conclusão do Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_DATA.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.prioridade === "Alta"
                          ? "text-red-500 bg-red-100"
                          : item.prioridade === "Média"
                          ? "text-yellow-600 bg-yellow-100"
                          : "text-green-600 bg-green-100"
                      }`}
                    >
                      {item.prioridade}
                    </span>
                  </TableCell>

                  <TableCell>{item.tipo}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>{item.fornecedor}</TableCell>

                  <TableCell className="text-left">
                    {item.valor.toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>

                  <TableCell>{item.formaPagamento}</TableCell>
                  <TableCell>{item.dataPagamento}</TableCell>
                  <TableCell>{item.conclusaoPagamento || "-"}</TableCell>

                  <TableCell>{item.status}</TableCell>

                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none ring-0 focus:outline-none focus:ring-0 cursor-pointer">
                        <Pencil className="w-4 h-4 text-gray-700" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.acoes.map((acao, i) => (
                          <DropdownMenuItem key={i}>{acao}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
