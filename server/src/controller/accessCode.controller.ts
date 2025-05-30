import {
  createNewAccessCodeService,
  validateAccessCodeService,
} from "../services/accessCode.service";
import { Request, Response } from "express";

export const createNewAccessCode = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || typeof phoneNumber !== "string") {
    return res.status(400).json({
      success: false,
      message:
        "The phone number is missing or invalid. Please check and try again.",
      errorCode: "INVALID_PHONE_NUMBER",
    });
  }

  try {
    const code = await createNewAccessCodeService(phoneNumber);
    return res.status(200).json({
      success: true,
      message: "A verification code has been sent to your phone number.",
      data: { code },
    });
  } catch (error: any) {
    console.error("Error creating access code:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error.",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const validateAccessCode = async (req: Request, res: Response) => {
  const { phoneNumber, accessCode } = req.body;

  if (!phoneNumber || !accessCode) {
    return res.status(400).json({
      success: false,
      message:
        "Both phone number and access code are required. Please double-check your input.",
      errorCode: "MISSING_PARAMETERS",
    });
  }

  try {
    await validateAccessCodeService(phoneNumber, accessCode);

    return res.status(200).json({
      success: true,
      message: "Access code verified successfully!",
    });
  } catch (error: any) {
    console.error("validateAccessCode error:", error);

    let errorCode = "INVALID_ACCESS_CODE";
    let message =
      error.message ||
      "The access code you entered is incorrect. Please double-check and try again.";

    if (error.message === "Access code expired") {
      errorCode = "ACCESS_CODE_EXPIRED";
      message = "Your access code has expired. Please request a new one.";
    }

    return res.status(400).json({
      success: false,
      message,
      errorCode,
    });
  }
};
