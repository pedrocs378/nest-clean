export type PaginationParams = {
  page: number
}

export const DEFAULT_LIMIT = 20

export function getPageRange(page: number, limit = DEFAULT_LIMIT) {
  return {
    start: (page - 1) * limit,
    end: page * limit,
  }
}
