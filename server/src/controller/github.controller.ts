import {
  findGithubUserProfileService,
  searchGithubUsersService,
} from "../services/github.service";
import { Request, Response } from "express";

export const searchGithubUsers = async (req: Request, res: Response) => {
  const { q, page = 1, per_page = 10 } = req.query;

  if (!q || typeof q !== "string" || q.trim() === "") {
    return res
      .status(400)
      .json({ error: "Missing or invalid query parameter: q" });
  }

  if (q.length > 100) {
    return res.status(400).json({ error: "Search query too long" });
  }

  const pageNum = Number(page);
  const perPageNum = Number(per_page);

  if (!Number.isInteger(pageNum) || pageNum < 1) {
    return res.status(400).json({ error: "Invalid page number" });
  }

  try {
    const users = await searchGithubUsersService(q, pageNum, perPageNum);
    return res.status(200).json(users);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Failed to fetch GitHub users";
    return res.status(status).json({ error: message });
  }
};

export const findGithubUserProfile = async (req: Request, res: Response) => {
  const { github_user_id } = req.params;

  if (!github_user_id || typeof github_user_id !== "string") {
    return res.status(400).json({ error: "Missing or invalid github_user_id" });
  }

  try {
    const user = await findGithubUserProfileService(github_user_id);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Error fetching GitHub user profile:", error.message);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message || "Failed to fetch GitHub user profile";
    return res.status(status).json({ error: message });
  }
};
