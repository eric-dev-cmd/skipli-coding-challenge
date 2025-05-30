import { Router, Request, Response } from "express";
import {
  findGithubUserProfile,
  searchGithubUsers,
} from "../controller/github.controller";

const router = Router();

router.get("/users", async (req: Request, res: Response) => {
  await searchGithubUsers(req, res);
});

router.get("/user/:github_user_id", async (req: Request, res: Response) => {
  await findGithubUserProfile(req, res);
});

export default router;
