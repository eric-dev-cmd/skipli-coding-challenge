import { ROUTES } from "@/constants/routes";
import { PhoneVerificationForm } from "@/features/auth/PhoneVerificationForm";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Request Access Code
  const handleRequestAccessCode = async (phoneNumber: string) => {
    setIsSubmitting(true);
    try {
      const response = await authService.requestAccessCode(phoneNumber);
      toast.success(response.message || "Access code sent successfully!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Verify Access Code
  const handleVerifyAccessCode = async (
    phoneNumber: string,
    accessCode: string
  ) => {
    setIsSubmitting(true);
    try {
      const response = await authService.verifyAccessCode(
        phoneNumber,
        accessCode
      );

      if (response.success) {
        login(phoneNumber);
        toast.success("Phone number verified successfully!");
        navigate(ROUTES.HOME);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <PhoneVerificationForm
        onRequestAccessCode={handleRequestAccessCode}
        onVerifyAccessCode={handleVerifyAccessCode}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default LoginPage;
