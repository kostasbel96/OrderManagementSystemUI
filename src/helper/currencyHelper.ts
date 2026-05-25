export const formatCurrency = (value: number, currency: string, locale: string): string =>
    new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: 'narrowSymbol'
    }).format(value);