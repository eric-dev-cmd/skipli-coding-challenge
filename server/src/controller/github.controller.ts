import {
  findGithubUserProfileService,
  searchGithubUsersService,
} from "../services/github.service";
import { Request, Response } from "express";

export const searchGithubUsers = async (req: Request, res: Response) => {
  const { q, page = 1, per_page = 10 } = req.query;

  if (!q || typeof q !== "string" || q.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Please enter a search term to look up GitHub users.",
      errorCode: "INVALID_QUERY",
    });
  }

  if (q.length > 100) {
    return res.status(400).json({
      success: false,
      message: "Your search term is too long. Please shorten it and try again.",
      errorCode: "QUERY_TOO_LONG",
    });
  }

  const pageNum = Number(page);
  const perPageNum = Number(per_page);

  if (!Number.isInteger(pageNum) || pageNum < 1) {
    return res.status(400).json({
      success: false,
      message: "The page number must be a positive whole number.",
      errorCode: "INVALID_PAGE",
    });
  }

  try {
    const result = await searchGithubUsersService(q, pageNum, perPageNum);
    return res.status(200).json(result);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "Sorry, something went wrong while searching for GitHub users. Please try again.";
    const errorCode =
      error.response?.status === 403
        ? "RATE_LIMIT_EXCEEDED"
        : "INTERNAL_SERVER_ERROR";

    return res.status(status).json({
      success: false,
      message,
      errorCode,
    });
  }
};

export const findGithubUserProfile = async (req: Request, res: Response) => {
  const { github_user_id } = req.params;

  if (!github_user_id || typeof github_user_id !== "string") {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid GitHub user ID.",
      errorCode: "INVALID_GITHUB_USER_ID",
    });
  }

  try {
    const user = await findGithubUserProfileService(github_user_id);
    return res.status(200).json(user);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      "Sorry, something went wrong while retrieving the GitHub user profile. Please try again.";
    const errorCode =
      error.response?.status === 403
        ? "RATE_LIMIT_EXCEEDED"
        : "INTERNAL_SERVER_ERROR";

    return res.status(status).json({
      success: false,
      message,
      errorCode,
    });
  }
};
