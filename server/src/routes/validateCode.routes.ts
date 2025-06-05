import { validateAccessCode } from "../controller/accessCode.controller";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  await validateAccessCode(req, res);
});

export default router;
