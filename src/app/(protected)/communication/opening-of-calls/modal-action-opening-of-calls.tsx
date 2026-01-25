"use client";

import React, { useEffect, useRef } from "react";
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
import { DatePicker } from "@/components/date-picker";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { OpeningCall } from "@/api/get-opening-calls-records";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "@/providers/use-user-context";
import { Employee } from "@/api/fetch-employees";
import { parseISO } from "date-fns";
import { createRecordOpening } from "@/api/create-record-opening";
import { updateOpeningCallsRecord } from "@/api/update-opening-calls-record";
import { DatePickerWithHours } from "@/components/date-picker-with-hours";
import { toLocalISOString } from "@/lib/to-local-iso-string";
import { FileText, Paperclip } from "lucide-react";

interface ProblemType {
  id: number;
  name: string;
}

interface StatusType {
  id: number;
  name: string;
}

interface ModalActionOpeningOfCallsProps {
  modalIsOpen: boolean;
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  problemTypes: ProblemType[];
  statuses: StatusType[];
  responsibles: Employee[];
  openingRecordSelected: OpeningCall | null;
  setOpeningRecordSelectted: React.Dispatch<
    React.SetStateAction<OpeningCall | null>
  >;
  type: "create" | "edit";
}

const schema = z.object({
  date: z.date(),
  problemTypeId: z.string().min(1, "Selecione o tipo de problema"),
  description: z.string().min(3, "Descrição muito curta"),
  statusId: z.string().min(1, "Selecione o status"),
  startDate: z.date().optional().nullable(),
  responsibleName: z.string().min(1, "Atribua um responsavel"),
  resolutionDate: z.date().optional().nullable(),
  document: z.any().optional(),
});

type FormDataType = z.infer<typeof schema>;

export function ModalActionOpeningOfCalls({
  modalIsOpen,
  setModalIsOpen,
  problemTypes,
  statuses,
  openingRecordSelected,
  setOpeningRecordSelectted,
  responsibles,
  type,
}: ModalActionOpeningOfCallsProps) {
  const buttonCloseRef = useRef<HTMLButtonElement>(null);
  const { user } = useUserContext();
  const condominiumId = user.condominiumId;
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormDataType>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      problemTypeId: "",
      description: "",
      statusId: "",
      startDate: null,
      resolutionDate: null,
      document: undefined,
    },
  });

  async function handleFormSubmit({
    date,
    description,
    problemTypeId,
    statusId,
    document,
    resolutionDate,
    startDate,
    responsibleName,
  }: FormDataType) {
    const formData = new FormData();

    formData.append("date", date.toISOString());

    formData.append("description", description);

    formData.append("issueTypeId", problemTypeId);

    formData.append("responsibleName", responsibleName);

    if (startDate) {
      formData.append("startedDate", toLocalISOString(startDate));
    }

    if (resolutionDate) {
      formData.append("resolvedDate", toLocalISOString(resolutionDate));
    }

    formData.append("statusId", statusId);

    if (type === "create") {
      if (Array.isArray(document)) {
        document?.forEach((file: File) => {
          formData.append("attachment", file);
        });
      }
      await handleCreateOpeningCallRecord(formData);
    }

    if (type === "edit") {
      await handleUpdateOpeningCallRecord({
        recordId: openingRecordSelected?.id,
        data: {
          date,
          description,
          issueTypeId: problemTypeId,
          statusId,
          resolvedDate: resolutionDate
            ? toLocalISOString(resolutionDate)
            : null,
          startedDate: startDate ? toLocalISOString(startDate) : null,
          responsibleName,
        },
      });
    }

    buttonCloseRef.current?.click();
    setOpeningRecordSelectted(null);
    reset({
      date: new Date(),
      description: "",
      document: "",
      problemTypeId: "",
      resolutionDate: null,
      responsibleName: "",
      startDate: null,
      statusId: "",
    });
  }

  const selectedFiles = useWatch({
    control,
    name: "document",
  });

  const { mutateAsync: handleCreateOpeningCallRecord } = useMutation({
    mutationFn: (formData: any) =>
      createRecordOpening({ condominiumId, formData }),
    onSuccess: () => {
      invalidOpeningCallRecords();
    },
  });

  const { mutateAsync: handleUpdateOpeningCallRecord } = useMutation({
    mutationFn: ({ recordId, data }: any) =>
      updateOpeningCallsRecord({ recordId, data }),
    onSuccess: () => {
      invalidOpeningCallRecords();
    },
  });

  function invalidOpeningCallRecords() {
    queryClient.invalidateQueries({
      queryKey: ["openingCallsRecords"],
      exact: false,
    });
    queryClient.invalidateQueries({
      queryKey: ["openingCards"],
      exact: false,
    });
  }

  useEffect(() => {
    if (openingRecordSelected) {
      const resolutionDateFormmated = openingRecordSelected.resolvedAt
        ? parseISO(openingRecordSelected.resolvedAt)
        : null;
      const startedDateFormmated = openingRecordSelected.startedAt
        ? parseISO(openingRecordSelected.startedAt)
        : null;
      reset({
        date: parseISO(openingRecordSelected.date),
        description: openingRecordSelected.description,
        problemTypeId: String(openingRecordSelected.issueTypeId),
        responsibleName: String(openingRecordSelected.responsibleName),
        resolutionDate: resolutionDateFormmated,
        startDate: startedDateFormmated,
        statusId: String(openingRecordSelected.statusId),
      });
    }
  }, [openingRecordSelected]);

  return (
    <Dialog
      open={modalIsOpen}
      onOpenChange={(open) => {
        setModalIsOpen(open);
        if (!open) {
          setOpeningRecordSelectted(null);
          reset({
            date: new Date(),
            description: "",
            document: "",
            problemTypeId: "",
            resolutionDate: null,
            responsibleName: "",
            startDate: null,
            statusId: "",
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Abrir Chamado</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Abrir Chamado" : "Editar Chamado"}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações do chamado para abertura.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 py-4"
          noValidate
        >
          <fieldset className="border border-gray-200 rounded-md p-4 space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Data
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker date={value!} setDate={onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="problemTypeId" className="text-right">
                Tipo de problema
              </Label>
              <Controller
                name="problemTypeId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Selecione o tipo de problema" />
                    </SelectTrigger>
                    <SelectContent>
                      {problemTypes.map((type) => (
                        <SelectItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.problemTypeId && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.problemTypeId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descrição
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Descreva o problema"
                    className="col-span-3"
                  />
                )}
              />
              {errors.description && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsibleId" className="text-right">
                Responsável
              </Label>
              <Controller
                name="responsibleName"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    value={value}
                    onChange={(event) => {
                      const value = event.target.value;
                      onChange(value);
                    }}
                  />
                )}
              />
              {errors.responsibleName && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.responsibleName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="statusId" className="text-right">
                Status
              </Label>
              <Controller
                name="statusId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger className="col-span-3 w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.id} value={String(status.id)}>
                          {status.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.statusId && (
                <p className="col-start-2 col-span-3 text-sm text-red-600">
                  {errors.statusId.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Data início atuação
              </Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours date={value!} setDate={onChange} />
                )}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resolutionDate" className="text-right">
                Data resolução
              </Label>
              <Controller
                name="resolutionDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePickerWithHours date={value!} setDate={onChange} />
                )}
              />
            </div>

            {type === "create" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4 mt-4">
                  <label className="flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-gray-400 text-gray-600 cursor-pointer p-8 hover:border-gray-600">
                    <Paperclip />
                    Clique para selecionar anexos.
                    <Controller
                      name="document"
                      control={control}
                      render={({ field }) => (
                        <input
                          multiple
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e) => {
                            const files = e.target.files;
                            const fileArray = files ? Array.from(files) : [];
                            field.onChange(fileArray);
                          }}
                          className="hidden"
                        />
                      )}
                    />
                  </label>

                  {selectedFiles && selectedFiles.length > 0 && (
                    <div className="mt-4 rounded-md border border-gray-300 bg-gray-50 p-4 text-sm text-gray-800">
                      <p className="mb-2 font-semibold">
                        {selectedFiles.length} arquivo
                        {selectedFiles.length > 1 ? "s" : ""} selecionado
                        {selectedFiles.length > 1 ? "s" : ""}:
                      </p>
                      <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                        {selectedFiles.map((file: File, index: number) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 truncate"
                            title={file.name}
                          >
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="truncate">{file.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </fieldset>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" ref={buttonCloseRef} type="button">
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
