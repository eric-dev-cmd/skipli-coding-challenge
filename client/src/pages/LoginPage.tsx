import { PhoneVerificationForm } from "@/features/auth/PhoneVerificationForm";
import { Fragment, useState } from "react";

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Request Access Code
  const handleRequestAccessCode = async (phoneNumber: string) => {
    setIsSubmitting(true);
    try {
      console.log("Requesting access code for:", phoneNumber);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
      // Assume success
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
      console.log("Verifying code:", accessCode, "for phone:", phoneNumber);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay
      // Assume success
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
