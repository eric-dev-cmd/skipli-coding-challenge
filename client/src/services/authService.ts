import axiosInstance from "@/config/axios";

export interface AccessCodeResponse {
  code: string;
  message?: string;
}

export interface VerifyAccessCodeResponse {
  success: boolean;
}
export const authService = {
  requestAccessCode: (phoneNumber: string) => {
    return axiosInstance
      .post<AccessCodeResponse>("/auth/access-code", { phoneNumber })
      .then((res) => res.data);
  },
  verifyAccessCode: (phoneNumber: string, accessCode: string) => {
    return axiosInstance
      .post<VerifyAccessCodeResponse>("/auth/validate-code", {
        phoneNumber,
        accessCode,
      })
      .then((res) => res.data);
  },
};
