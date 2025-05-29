import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN!;
export const BASE_URL = "https://api.github.com";

export const githubAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
    Accept: "application/vnd.github+json",
  },
});
