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
    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
});
