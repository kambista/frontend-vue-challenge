export function formatCurrency(amount: number, currency: 'USD' | 'PEN'): string {
  const prefix = currency === 'USD' ? '$ ' : 'S/ '
  return `${prefix}${amount.toFixed(2)}`
}

export function formatAccountNumber(account: string): string {
  return account
}
