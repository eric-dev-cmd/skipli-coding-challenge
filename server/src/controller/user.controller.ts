import { Request, Response } from "express";
import {
  likeGithubUserService,
  getUserProfileService,
} from "../services/user.service";

export const likeGithubUser = async (req: Request, res: Response) => {
  const { phone_number, github_user_id } = req.body;

  if (!phone_number || !github_user_id) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    await likeGithubUserService(phone_number, github_user_id);
    return res.sendStatus(200);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  const { phone_number } = req.query;

  if (!phone_number || typeof phone_number !== "string") {
    return res.status(400).json({ error: "Missing or invalid phone_number" });
  }

  try {
    const user = await getUserProfileService(phone_number);
    return res.status(200).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
