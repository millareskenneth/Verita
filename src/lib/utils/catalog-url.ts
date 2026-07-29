export function buildCatalogHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams();

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") {
        params.set(key, value);
      }
    }
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export type PageItem = number | "ellipsis";

export function buildPageItems(current: number, total: number): PageItem[] {
  if (total <= 1) return [1];
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) {
    items.push("ellipsis");
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < total - 1) {
    items.push("ellipsis");
  }

  items.push(total);
  return items;
}
