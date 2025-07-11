import { Skeleton } from "./ui/skeleton";

export function TableRowSkeleton() {
  return (
    <tr>
      <td colSpan={99} className="p-2">
        <Skeleton className="h-6 w-full" />
      </td>
    </tr>
  );
}
