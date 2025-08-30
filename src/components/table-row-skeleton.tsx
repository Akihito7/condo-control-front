import { Skeleton } from "./ui/skeleton";

interface TableRowSkeletonProps {
  className?: string;
}
export function TableRowSkeleton({ className }: TableRowSkeletonProps) {
  return (
    <tr>
      <td colSpan={99} className="p-2">
        <Skeleton className={`h-6 w-full ${className}`} />
      </td>
    </tr>
  );
}
