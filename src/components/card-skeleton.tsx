import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CardSkeletonProps {
  className?: string;
}
export function CardSkeleton({ className }: CardSkeletonProps) {
  return (
    <Card className="w-full">
      <CardContent className={`p-4 space-y-1 ${className}`}>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" /> {/* título */}
          <Skeleton className="h-6 w-6 rounded-full" /> {/* ícone */}
        </div>
        <Skeleton className="h-8 w-24" /> {/* valor */}
        <Skeleton className="h-4 w-16" /> {/* percentual */}
      </CardContent>
    </Card>
  );
}
