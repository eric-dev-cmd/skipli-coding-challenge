import { Router, Request, Response } from "express";
import { getUserProfile, likeGithubUser } from "../controller/user.controller";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  await getUserProfile(req, res);
});

router.post("/like", async (req: Request, res: Response) => {
  await likeGithubUser(req, res);
});

export default router;
