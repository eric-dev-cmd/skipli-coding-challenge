import { githubAxios } from "../config/github.config";

export const searchGithubUsersService = async (
  q: string,
  page: number = 1,
  per_page: number = 10
) => {
  const validatedPerPage = Math.min(Math.max(per_page, 1), 100);
  const validatedPage = Math.max(page, 1);

  if (validatedPage * validatedPerPage > 1000) {
    throw new Error(
      "GitHub API supports up to 1000 results only. Please reduce page or per_page value."
    );
  }

  try {
    const response = await githubAxios.get("/search/users", {
      params: { q, page: validatedPage, per_page: validatedPerPage },
    });

    const { total_count, items } = response.data;
    const total_pages = Math.ceil(total_count / validatedPerPage);

    return {
      success: true,
      total_count,
      page: validatedPage,
      per_page: validatedPerPage,
      total_pages,
      has_next_page: validatedPage < total_pages,
      has_prev_page: validatedPage > 1,
      users: items,
    };
  } catch (error: any) {
    console.error("Error fetching GitHub users:", error.message);
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
