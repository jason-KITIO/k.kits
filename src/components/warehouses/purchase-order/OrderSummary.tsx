import { Card, CardContent } from "@/components/ui/card";

interface OrderSummaryProps {
  items: Array<{ quantity: number; unitPrice: number }>;
  formatCurrency: (amount: number) => string;
}

export function OrderSummary({ items, formatCurrency }: OrderSummaryProps) {
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0 || totalAmount === 0) return null;

  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {items.length} article(s) - {totalQuantity} unité(s)
          </div>
          <div className="text-lg font-semibold text-foreground">
            Total: {formatCurrency(totalAmount)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
