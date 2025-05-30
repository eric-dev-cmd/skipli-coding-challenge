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

export const findGithubUserProfileService = async (github_user_id: string) => {
  const response = await githubAxios.get(`/user/${github_user_id}`);
  const { login, id, avatar_url, html_url, public_repos, followers } =
    response.data;

  return { login, id, avatar_url, html_url, public_repos, followers };
};
