export function validatePaginationParams(perPage: number, page: number) {
  const validatedPerPage = Math.min(Math.max(perPage, 1), 100);
  const validatedPage = Math.max(page, 1);
  const maxResults = 1000;
  const maxPages = Math.ceil(maxResults / validatedPerPage);

  if (validatedPage > maxPages) {
    throw new Error(
      "GitHub API supports up to 1000 results only. Please reduce page or per_page value."
    );
  }

  return { validatedPerPage, validatedPage, maxResults };
}
