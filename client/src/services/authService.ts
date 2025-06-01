import axiosInstance from "@/config/axios";

// ================== Types ==================
export interface AccessCodeResponse {
  code: string;
  message?: string;
}

export interface VerifyAccessCodeResponse {
  success: boolean;
}

// ================== API: Request Access Code ==================
const requestAccessCode = async (
  phoneNumber: string
): Promise<AccessCodeResponse> => {
  const response = await axiosInstance.post<AccessCodeResponse>(
    "/auth/access-code",
    { phoneNumber }
  );
  return response.data;
};

// ================== API: Verify Access Code ==================
const verifyAccessCode = async (
  phoneNumber: string,
  accessCode: string
): Promise<VerifyAccessCodeResponse> => {
  const response = await axiosInstance.post<VerifyAccessCodeResponse>(
    "/auth/validate-code",
    {
      phoneNumber,
      accessCode,
    }
  );
  return response.data;
};

// ================== Combine all services ==================
const authService = {
  requestAccessCode,
  verifyAccessCode,
};

export default authService;
