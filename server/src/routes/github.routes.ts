import { Router, Request, Response } from "express";
import { searchGithubUsers } from "../controller/github.controller";

const router = Router();

router.get("/users", async (req: Request, res: Response) => {
  await searchGithubUsers(req, res);
});

export default router;
