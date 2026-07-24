export const catalogEndpoints = {
  list: "/api/catalog",
  detail: (slug: string) => `/api/catalog/${slug}`,
  security: (slug: string) => `/api/catalog/${slug}/security`,
  test: (slug: string) => `/api/catalog/${slug}/test`,
} as const;
