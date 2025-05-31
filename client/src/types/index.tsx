export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  isLiked: boolean;
}
