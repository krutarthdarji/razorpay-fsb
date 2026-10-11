/** Every path in one place */
export const paths = {
  landing: '/',
  home: '/app',
  kosh: '/app/kosh',
  order: '/app/order',
  portfolio: '/app/portfolio',
  revenue: '/app/revenue',
  expenses: '/app/expenses',
  liquidity: '/app/liquidity',
  fund: (id: string) => `/app/fund/${id}`,
} as const;
