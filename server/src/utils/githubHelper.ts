import { githubAxios } from "@/config/github";

export async function getUserDetails(items: any[]) {
  return Promise.all(
    items.map(async (user) => {
      const userDetails = await githubAxios.get(`/users/${user.login}`);
      return {
        id: user.id,
        login: user.login,
        avatar_url: user.avatar_url,
        html_url: user.html_url,
        public_repos: userDetails.data.public_repos,
        followers: userDetails.data.followers,
      };
    })
  );
}
