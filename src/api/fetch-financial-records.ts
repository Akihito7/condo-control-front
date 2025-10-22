import { api } from "@/services/api";

interface FetchFinancialRecordsProps {
  selectedDate: string;
  condominiumId: number;
  incomeExpenseOptionsSelectedId: string[] | undefined
}

export type Attachment = {
  id: number;
  bucketName: string;
  condominiumId: number;
  createdAt: string;
  updatedAt: string;
  date: string;
  originalName: string;
  path: string;
  relatedId: number;
  relatedType: string;
  screenOrigin: string;
  supabaseId: string;
};

export type CategoryType = {
  name: string;
  income_expense_types?: any;
  income_expense_type_id?: number;
};

export type FinancialRecord = {
  id: number;
  condominiumId: number;
  categoryId: number;
  categoryName: string;
  apartmentId: number | null;
  apartmentNumber: string | null;
  amount: string;
  amountPaid: string | null;
  isRecurring: boolean;
  notes: string | null;
  observation: string | null;
  paymentDate: string | null;
  paymentMethodId: number | null;
  paymentMethodName: string | null;
  paymentStatusId: number | null;
  paymentStatusName: string | null;
  status: number | null;
  recordTypeId?: number;
  incomeExpenseTypeId?: number;
  effectiveDate: string;
  delinquencyRecordId: number | null;
  isDeleted: boolean;
  attachments: Attachment[];
};

export async function fetchFinancialRecords(
  { condominiumId, selectedDate, incomeExpenseOptionsSelectedId }: FetchFinancialRecordsProps)
  : Promise<FinancialRecord[]> {
  const response = await api.get(
    `/finance/registers/${condominiumId}/${selectedDate}`, {
    params: {
      incomeExpenseOptionsSelectedId
    }
  }
  );
  return response.data;
}