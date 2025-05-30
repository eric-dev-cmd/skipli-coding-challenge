import { ROUTES } from "@/constants/routes";
import { PhoneVerificationForm } from "@/features/auth/PhoneVerificationForm";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { authService } from "@/services/authService";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setPhoneNumberStorage] = useLocalStorage<string>("phoneNumber", "");

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
        setPhoneNumberStorage(phoneNumber);
        toast.success("Phone number verified successfully!");
        navigate(ROUTES.DASHBOARD);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Fragment>
      <PhoneVerificationForm
        onRequestAccessCode={handleRequestAccessCode}
        onVerifyAccessCode={handleVerifyAccessCode}
        isSubmitting={isSubmitting}
      />
    </Fragment>
  );
};

export default LoginPage;
