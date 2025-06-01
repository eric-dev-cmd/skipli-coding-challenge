import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN!;
export const BASE_URL = "https://api.github.com";

/**
 * 🚨 NOTE:
 * By default, GitHub API limits unauthenticated requests to 60 requests/hour per IP address.
 * This can be hit quickly with search or detail calls, leading to:
 *   "API rate limit exceeded for {IP}..."
 *
 * To avoid this, we strongly recommend using a GitHub Personal Access Token
 * or a GitHub App token, which increases the rate limit to 5000 requests/hour per token.
 *
 * 1️⃣ Create a GitHub token at: https://github.com/settings/tokens
 * 2️⃣ Add it to your .env file:
 *
 *    GITHUB_API_TOKEN=your_personal_access_token_here
 *
 * 3️⃣ Then, uncomment the Authorization header below to enable token usage.
 *
 * Reference: https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting
 */
export const githubAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/vnd.github.v3+json",
    ...(GITHUB_API_TOKEN
      ? { Authorization: `Bearer ${GITHUB_API_TOKEN}` }
      : {}),
  },
  timeout: 10000,
});

githubAxios.interceptors.response.use(
  (response) => {
    const limit = response.headers["x-ratelimit-limit"];
    const remaining = response.headers["x-ratelimit-remaining"];
    const reset = response.headers["x-ratelimit-reset"];

    if (limit && remaining && reset) {
      console.info(
        `📊 GitHub API Rate Limit — Limit: ${limit}, Remaining: ${remaining}, Resets at: ${new Date(
          Number(reset) * 1000
        ).toISOString()}`
      );
    }

    return response;
  },
  (error) => {
    if (error.response) {
      const limit = error.response.headers["x-ratelimit-limit"];
      const remaining = error.response.headers["x-ratelimit-remaining"];
      const reset = error.response.headers["x-ratelimit-reset"];

      if (limit && remaining && reset) {
        console.warn(
          `⚠️ GitHub API Rate Limit — Limit: ${limit}, Remaining: ${remaining}, Resets at: ${new Date(
            Number(reset) * 1000
          ).toISOString()}`
        );
      }
    }

    return Promise.reject(error);
  }
);
