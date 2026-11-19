export const PAGE_SIZE = 3

export const pageCount = (total: number, size = PAGE_SIZE): number =>
  Math.max(1, Math.ceil(total / size))

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE): T[] {
  const start = (page - 1) * size
  return items.slice(start, start + size)
}
