import { validatePaginationParams } from "@/utils/validateHelper";
import { githubAxios } from "../config/github";
import { getUserDetails } from "@/utils/githubHelper";

export const searchGithubUsersService = async (
  q: string,
  page: number = 1,
  per_page: number = 10
) => {
  const { validatedPerPage, validatedPage, maxResults } =
    validatePaginationParams(per_page, page);

  try {
    const response = await githubAxios.get("/search/users", {
      params: { q, page: validatedPage, per_page: validatedPerPage },
    });

    const { items, total_count } = response.data;

    const cappedTotalCount = Math.min(total_count, maxResults);
    const totalPages = Math.ceil(cappedTotalCount / validatedPerPage);

    const users = await getUserDetails(items);

    return {
      users,
      pagination: {
        current_page: validatedPage,
        per_page: validatedPerPage,
        total_count: cappedTotalCount,
        total_pages: totalPages,
      },
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch GitHub users"
    );
  }
};

export const findGithubUserProfileService = async (github_user_id: string) => {
  const response = await githubAxios.get(`/user/${github_user_id}`);
  const { login, id, avatar_url, html_url, public_repos, followers } =
    response.data;

  return { login, id, avatar_url, html_url, public_repos, followers };
};
