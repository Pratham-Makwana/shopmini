import { useState, useEffect, useCallback } from "react";
import { useMetadata } from "@/hooks/use-metadata";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { productsService, type Product } from "@/services/api";
import { Search, AlertCircle, RefreshCw, Package } from "lucide-react";

/**
 * ProductsPage Component
 * Displays a polished grid of products with a gradient hero header and search
 */
export function ProductsPage() {
  useMetadata({
    title: "Products - ShopMini",
    description: "Browse our curated collection of products, fresh drops, and unbeatable deals.",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productsService.getAll();
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }
    const query = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
      )
    );
  }, [searchQuery, products]);

  return (
    <main className="min-h-screen">
      {/* ── Hero Header ── */}
      <div className="border-b border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background px-4 py-10">
        <div className="container mx-auto">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Catalogue
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  All Products
                </span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-md">
                Browse our curated collection — fresh drops, top-rated picks,
                and unbeatable deals.
              </p>
            </div>

            {/* Search */}
            <div className="sm:w-72 lg:w-80">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search products, brands…"
                  className="pl-9 h-10 bg-background shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-8">
        {/* Error state */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchProducts}
                className="ml-4 shrink-0"
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {isLoading && <ProductGridSkeleton count={8} />}

        {/* Products */}
        {!isLoading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Try a different search term or clear the query
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Result count */}
                <div className="mb-5 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-semibold">
                    {filteredProducts.length}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {filteredProducts.length === products.length
                      ? "products available"
                      : `of ${products.length} products`}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
