export function formatCurrency(amount: number, currency = 'XAF'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
}

interface CurrencyProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function Currency({ amount, currency = 'XAF', className }: CurrencyProps) {
  return <span className={className}>{formatCurrency(amount, currency)}</span>;
}
