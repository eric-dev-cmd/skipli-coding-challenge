import axiosInstance from "@/config/axios";

export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  isLiked?: boolean;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total_count: number;
  total_pages: number;
}

export interface SearchGithubUsersResponse {
  users: GithubUser[];
  pagination: PaginationInfo;
}

export const searchGithubUsers = async (
  q: string,
  page: number = 1,
  per_page: number = 10
): Promise<SearchGithubUsersResponse> => {
  const response = await axiosInstance.get<SearchGithubUsersResponse>(
    "/github/users",
    {
      params: { q, page, per_page },
    }
  );
  return response.data;
};
