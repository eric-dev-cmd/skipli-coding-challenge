import { searchGithubUsersService } from "../services/github.service";
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

  if (pageNum * perPageNum > 1000) {
    return res.status(400).json({
      error:
        "Too many results requested. GitHub API only allows up to 1000 results. Please reduce 'page' or 'per_page'.",
    });
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
