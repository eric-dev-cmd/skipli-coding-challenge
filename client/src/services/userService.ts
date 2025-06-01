import axiosInstance from "@/config/axios";

// ================== Types ==================
export interface GithubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  isLiked?: boolean;
}

interface LikeGithubUserResponse {
  success: boolean;
  action: "liked" | "unliked";
}

interface GetFavoriteIdsResponse {
  phone_number: string;
  favorite_github_users: GithubUser[];
}

// ================== API: Like/Unlike User ==================
export const likeGithubUser = async (
  phone_number: string,
  github_user_id: number
): Promise<"liked" | "unliked"> => {
  const response = await axiosInstance.post<LikeGithubUserResponse>(
    "/user/like",
    {
      phone_number,
      github_user_id,
    }
  );
  return response.data.action;
};

// ================== API: Get Favorite IDs ==================
export const getFavoriteIdsByPhone = async (
  phone_number: string
): Promise<GithubUser[]> => {
  const response = await axiosInstance.get<GetFavoriteIdsResponse>("/user", {
    params: { phone_number },
  });
  return response.data.favorite_github_users;
};

// ================== Combine all services ==================
const userService = {
  likeGithubUser,
  getFavoriteIdsByPhone,
};

export default userService;
