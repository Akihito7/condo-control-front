"use client";

import { Paperclip } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export function ModalCreateEntry() {
  const categoriasDespesa = ["Água", "Energia", "Multa"];
  const categoriasReceita = ["Aluguel", "Venda", "Outros"];

  const tipoPorCategoria: Record<string, "Fixo" | "Variável"> = {
    Água: "Fixo",
    Energia: "Fixo",
    Multa: "Variável",
    Aluguel: "Fixo",
    Venda: "Variável",
    Outros: "Variável",
  };

  const formasPagamento = [
    "Dinheiro",
    "Transferência",
    "Boleto",
    "Cartão",
    "Pix",
  ];

  const statusPagamentoDespesa = ["Pendente", "Pago"];
  const statusPagamentoReceita = ["Pendente", "Recebido"];

  const apartamentos = ["101", "102", "103", "201", "202", "203"];

  const [form, setForm] = useState({
    data: "",
    tipoRegistro: "Despesa",
    categoria: "",
    apartamento: "",
    tipo: "",
    formaPagamento: "",
    statusPagamento: "",
    dataQuitacao: "",
    observacoes: "",
    documentos: null as FileList | null,
  });

  useEffect(() => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();
    const dataFormatada = `${ano}-${mes}-${dia}`;
    setForm((prev) => ({ ...prev, data: dataFormatada }));
  }, []);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      categoria: "",
      tipo: "",
      statusPagamento: "",
    }));
  }, [form.tipoRegistro]);

  useEffect(() => {
    if (form.categoria) {
      setForm((prev) => ({
        ...prev,
        tipo: tipoPorCategoria[form.categoria] || "",
      }));
    } else {
      setForm((prev) => ({ ...prev, tipo: "" }));
    }
  }, [form.categoria]);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectChange(value: string, name: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, documentos: e.target.files }));
  }

  function validarCampos() {
    if (
      !form.data ||
      !form.tipoRegistro ||
      !form.categoria ||
      !form.formaPagamento ||
      !form.statusPagamento
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return false;
    }
    return true;
  }

  function salvarRegistro() {
    if (!validarCampos()) return;

    console.log("Salvando registro:", form);
    alert("Registro salvo com sucesso!");

    setForm((prev) => ({
      data: prev.data,
      tipoRegistro: "Despesa",
      categoria: "",
      apartamento: "",
      tipo: "",
      formaPagamento: "",
      statusPagamento: "",
      dataQuitacao: "",
      observacoes: "",
      documentos: null,
    }));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Adicionar registro</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            Adicionar registro financeiro
          </DialogTitle>
          <DialogDescription>
            Preencha o formulário para cadastrar uma nova movimentação.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            salvarRegistro();
          }}
          className="space-y-6 py-4"
        >
          {/* Bloco 1: Dados básicos */}
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Dados Básicos
            </legend>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="data" className="text-right">
                Data
              </Label>
              <Input
                type="date"
                id="data"
                name="data"
                value={form.data}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tipoRegistro" className="text-right">
                Tipo de Registro
              </Label>
              <Select
                value={form.tipoRegistro}
                onValueChange={(value) =>
                  handleSelectChange(value, "tipoRegistro")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Despesa">Despesa</SelectItem>
                  <SelectItem value="Receita">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </fieldset>

          {/* Bloco 2: Categoria e apartamento */}
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Categoria e Unidade
            </legend>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="categoria" className="text-right">
                Categoria
              </Label>
              <Select
                value={form.categoria}
                onValueChange={(value) =>
                  handleSelectChange(value, "categoria")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(form.tipoRegistro === "Despesa"
                    ? categoriasDespesa
                    : categoriasReceita
                  ).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="apartamento" className="text-right">
                Apartamento
              </Label>
              <Select
                value={form.apartamento}
                onValueChange={(value) =>
                  handleSelectChange(value, "apartamento")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o apartamento (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  {apartamentos.map((apt) => (
                    <SelectItem key={apt} value={apt}>
                      {apt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </fieldset>

          {/* Bloco 3: Tipo e pagamentos */}
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Tipo e Pagamentos
            </legend>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="tipo" className="text-right">
                Tipo (Fixo ou Variável)
              </Label>
              <Select
                value={form.tipo}
                onValueChange={(value) => handleSelectChange(value, "tipo")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixo">Fixo</SelectItem>
                  <SelectItem value="Variável">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="formaPagamento" className="text-right">
                Forma de Pagamento
              </Label>
              <Select
                value={form.formaPagamento}
                onValueChange={(value) =>
                  handleSelectChange(value, "formaPagamento")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {formasPagamento.map((forma) => (
                    <SelectItem key={forma} value={forma}>
                      {forma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="statusPagamento" className="text-right">
                Status de Pagamento
              </Label>
              <Select
                value={form.statusPagamento}
                onValueChange={(value) =>
                  handleSelectChange(value, "statusPagamento")
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {(form.tipoRegistro === "Despesa"
                    ? statusPagamentoDespesa
                    : statusPagamentoReceita
                  ).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dataQuitacao" className="text-right">
                Data de Quitação
              </Label>
              <Input
                type="date"
                id="dataQuitacao"
                name="dataQuitacao"
                value={form.dataQuitacao}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </fieldset>

          {/* Bloco 4: Observações e documentos */}
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Informações Adicionais
            </legend>

            <div className="grid  items-start gap-4 mb-4">
              <Label htmlFor="observacoes" className="text-right pt-2">
                Observações
              </Label>
              <textarea
                id="observacoes"
                name="observacoes"
                value={form.observacoes}
                onChange={handleInputChange}
                className="col-span-3 resize-none border rounded-md p-2"
                rows={3}
                placeholder="Escreva observações aqui..."
              />
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="documentos" className="text-right">
                Upload de Documentos
              </Label>
              <label
                htmlFor="documentos"
                className="col-span-3 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600 transition select-none"
              >
                <Paperclip />
                Arraste e solte arquivos aqui ou clique para selecionar.
                <input
                  id="documentos"
                  name="documentos"
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
              </label>
            </div>
          </fieldset>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
