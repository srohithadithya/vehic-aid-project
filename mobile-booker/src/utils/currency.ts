export const formatCurrency = (amount: number, currency: string = 'INR', locale: string = 'en-IN') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export const convertCurrency = (amount: number, from: string, to: string) => {
    const rates: Record<string, number> = {
        'INR': 1,
        'USD': 0.012, // Dummy rate
    };

    if (from === to) return amount;
    return (amount / rates[from]) * rates[to];
};
