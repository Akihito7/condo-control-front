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
import { useState } from "react";

export function ModalCreateDelinquency() {
  const [form, setForm] = useState({
    apartment: "",
    dueDate: "",
    amount: "",
    status: "Pendente",
    notes: "",
    documents: null as FileList | null,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelect(value: string, name: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, documents: e.target.files }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Inadimplência registrada com sucesso!");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Registrar Inadimplência</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Adicionar Inadimplência
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da inadimplência abaixo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <fieldset className="border border-gray-200 rounded-md p-4">
            <legend className="text-sm font-semibold mb-2">
              Dados da Inadimplência
            </legend>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="apartment" className="text-right">
                Apartamento
              </Label>
              <Input
                id="apartment"
                name="apartment"
                value={form.apartment}
                onChange={handleChange}
                className="col-span-3"
                placeholder="Ex: 202"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="dueDate" className="text-right">
                Data de Vencimento
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="amount" className="text-right">
                Valor (R$)
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mb-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(val) => handleSelect(val, "status")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Pago">Pago</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid items-start gap-4 mb-4">
              <Label htmlFor="notes" className="text-right pt-2">
                Observações
              </Label>
              <textarea
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="col-span-3 resize-none border rounded-md p-2"
                rows={3}
                placeholder="Escreva observacões aqui..."
              />
            </div>

            <div className="grid items-center gap-4">
              <Label htmlFor="documents" className="text-right">
                Documentos
              </Label>
              <label
                htmlFor="documents"
                className="col-span-3 flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600 transition select-none"
              >
                <Paperclip />
                Arraste ou clique para anexar
                <input
                  id="documents"
                  name="documents"
                  type="file"
                  onChange={handleFile}
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
