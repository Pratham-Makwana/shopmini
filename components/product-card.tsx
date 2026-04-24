import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/services/api";

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard Component
 * Polished product card with category chip, brand, stock indicator,
 * hover lift effect, and quantity controls
 */
export function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    isInCart,
    getItemQuantity,
    incrementQuantity,
    decrementQuantity,
  } = useCart();

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock === 0;
  const discountedOriginal =
    product.discountPercentage > 0
      ? product.price / (1 - product.discountPercentage / 100)
      : null;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  };

  return (
    <Card className="group flex flex-col overflow-hidden border border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8 hover:border-primary/20">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/50">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 5 && (
          <div className="absolute top-2.5 left-2.5 rounded-full bg-destructive px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}

        {/* Category chip */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="inline-flex items-center rounded-md bg-white/80 dark:bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-foreground/70 backdrop-blur-sm shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <CardContent className="flex-1 p-4 space-y-2">
        {/* Brand */}
        {product.brand && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
            {product.brand}
          </p>
        )}

        {/* Title */}
        <h3 className="font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {discountedOriginal && product.discountPercentage > 5 && (
            <span className="text-sm text-muted-foreground/70 line-through">
              ${discountedOriginal.toFixed(2)}
            </span>
          )}
        </div>

        {/* Rating + Stock */}
        <div className="flex items-center justify-between">
          {/* Stars */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : i < product.rating
                      ? "text-amber-400 fill-amber-200"
                      : "text-muted-foreground/25 fill-muted-foreground/10"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)}
            </span>
          </div>

          {/* Stock indicator */}
          {isOutOfStock ? (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 text-destructive">
              Out of stock
            </Badge>
          ) : isLowStock ? (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Only {product.stock} left
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              In stock
            </span>
          )}
        </div>
      </CardContent>

      {/* Cart Actions */}
      <CardFooter className="p-4 pt-0">
        {inCart ? (
          <div className="flex w-full items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => decrementQuantity(product.id)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="font-bold text-base min-w-[2rem] text-center text-primary">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => incrementQuantity(product.id)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <Button
            className="w-full font-semibold"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
