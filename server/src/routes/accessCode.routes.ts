import {
  createNewAccessCode,
  validateAccessCode,
} from "../controller/accessCode.controller";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/access-code", async (req: Request, res: Response) => {
  await createNewAccessCode(req, res);
});

router.post("/validate-code", async (req: Request, res: Response) => {
  await validateAccessCode(req, res);
});

export default router;
