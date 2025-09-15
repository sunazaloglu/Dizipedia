import type { Show } from "../services/api";

export function Paginate(
  items: Show[],
  currentPage: number,
  pageSize: number = 30
) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return { totalPages, pageItems };
}

export function calculateNewPage(
  currentPage: number,
  totalPages: number,
  delta: number,
): number {
  return Math.min(totalPages, Math.max(1, currentPage + delta));
}
//delta kac sayfa ileri ya da geri gitmek istiyorsak 1 ileri -1 geri gibi