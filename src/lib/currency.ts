export const CURRENCIES = {
  XAF: { symbol: 'FCFA', name: 'Franc CFA', locale: 'fr-CM' },
  EUR: { symbol: '€', name: 'Euro', locale: 'fr-FR' },
  USD: { symbol: '$', name: 'Dollar US', locale: 'en-US' },
} as const;

export type Currency = keyof typeof CURRENCIES;

export function formatCurrency(amount: number, currency: Currency = 'XAF'): string {
  const currencyInfo = CURRENCIES[currency];
  
  if (!currencyInfo) {
    return `${amount.toLocaleString()} FCFA`;
  }
  
  if (currency === 'XAF') {
    return `${amount.toLocaleString('fr-CM')} ${currencyInfo.symbol}`;
  }
  
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
}