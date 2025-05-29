import { githubAxios } from "../config/github.config";

export const searchGithubUsersService = async (
  q: string,
  page: number = 1,
  per_page: number = 10
) => {
  const response = await githubAxios.get("/search/users", {
    params: { q, page, per_page },
  });
  return response.data.items;
};
