import { useCart, type CartItem as CartItemType } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

/**
 * CartItem Component
 * Displays a single cart item with quantity controls
 * Used in the cart sidebar
 */
export function CartItem({ item }: CartItemProps) {
  const { incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  // Calculate subtotal for this item
  const subtotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0 px-2">
      {/* Product Thumbnail */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Item Details */}
      <div className="flex flex-1 flex-col">
        {/* Title and Remove Button */}
        <div className="flex items-start justify-between">
          <h4 className="font-medium line-clamp-2 pr-2">{item.title}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeFromCart(item.id)}
            aria-label={`Remove ${item.title} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Price */}
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>

        {/* Quantity Controls and Subtotal */}
        <div className="mt-2 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 rounded-lg border bg-muted/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => decrementQuantity(item.id)}
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => incrementQuantity(item.id)}
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Subtotal */}
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
