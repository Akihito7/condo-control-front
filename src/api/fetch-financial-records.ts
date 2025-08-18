import { api } from "@/services/api";

interface FetchFinancialRecordsProps {
  selectedDate: string;
  condominiumId: number;
  incomeExpenseOptionsSelectedId: string[] | undefined
}

type CategoryType = {
  name: string;
  income_expense_types: any;
  income_expense_type_id: number;
};

export type FinancialRecord = {
  amount: number;
  amountPaid: number | null;
  categories: CategoryType;
  categoryId: number;
  categoryName: string;
  categoryTypeId: number;
  categoryTypeName: string;
  condominiumId: number;
  dueDate: string;
  id: number;
  isRecurring: boolean;
  notes: string | null;
  paymentDate: string | null;
  paymentMethodName: string;
  paymentStatusName: string;
  apartmentNumber: string;
  observation: string;
  apartmentId: number
  incomeExpenseTypeId: number;
  paymentMethodId: number;
  paymentStatusId: number;
  recordTypeId: number;
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
