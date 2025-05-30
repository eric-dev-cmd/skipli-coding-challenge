import {
  createNewAccessCodeService,
  validateAccessCodeService,
} from "../services/accessCode.service";
import { Request, Response } from "express";

export const createNewAccessCode = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber || typeof phoneNumber !== "string") {
    return res.status(400).json({ error: "Missing or invalid phoneNumber" });
  }

  try {
    const code = await createNewAccessCodeService(phoneNumber);
    return res.status(200).json({ code });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const validateAccessCode = async (req: Request, res: Response) => {
  const { phoneNumber, accessCode } = req.body;

  if (!phoneNumber || !accessCode) {
    return res.status(400).json({ error: "Missing phoneNumber or accessCode" });
  }

  try {
    await validateAccessCodeService(phoneNumber, accessCode);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    const message =
      error.message === "Access code expired"
        ? "Your access code has expired. Please request a new one."
        : error.message;
    return res.status(400).json({ error: message });
  }
};
