import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProductSkeleton Component
 * Loading placeholder for product cards
 * Matches the structure of ProductCard for smooth transitions
 */
export function ProductSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content Skeleton */}
      <CardContent className="flex-1 p-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        {/* Description */}
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
        {/* Price */}
        <Skeleton className="mt-3 h-7 w-24" />
        {/* Rating */}
        <Skeleton className="mt-2 h-4 w-32" />
      </CardContent>

      {/* Footer Skeleton */}
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

/**
 * ProductGridSkeleton Component
 * Displays a grid of product skeletons for loading state
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
