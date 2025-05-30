import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import { PhoneIcon, KeyIcon } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { useNavigate } from "react-router-dom";
import { isValidAccessCode, isValidPhoneNumber } from "@/utils/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PhoneVerificationFormProps {
  onRequestAccessCode: (phoneNumber: string) => Promise<void>;
  onVerifyAccessCode: (
    phoneNumber: string,
    accessCode: string
  ) => Promise<void>;
  isSubmitting?: boolean;
}

export function PhoneVerificationForm({
  onRequestAccessCode,
  onVerifyAccessCode,
  isSubmitting = false,
}: PhoneVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!isValidPhoneNumber(phoneNumber)) {
        toast.error(
          "Please enter a valid phone number in E.164 format (e.g., +84337934563)."
        );
        return;
      }
      try {
        await onRequestAccessCode(phoneNumber);
        toast.success("Access code sent to your phone number!");
        setStep(2);
        setResendTimer(60);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to send access code. Please try again.");
      }
    } else if (step === 2) {
      if (!isValidAccessCode(accessCode)) {
        toast.error("Please enter a 6-digit access code.");
        return;
      }
      try {
        await onVerifyAccessCode(phoneNumber, accessCode);
        toast.success("Phone number verified!");
        navigate(ROUTES.DASHBOARD);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Invalid access code. Please try again.");
      }
    }
  };

  const handleResendCode = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error(
        "Please enter a valid phone number in E.164 format (e.g., +84337934563)."
      );
      return;
    }
    try {
      await onRequestAccessCode(phoneNumber);
      toast.success("Access code resent!");
      setResendTimer(60);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to resend access code. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200"
      aria-labelledby="phone-form-title"
    >
      <h1 className="text-2xl font-bold text-center text-primary mb-2">
        Skipli Frontend Coding Challenge
      </h1>
      <h2
        id="phone-form-title"
        className="text-xl font-semibold text-center text-gray-800"
      >
        Phone Verification
      </h2>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-5 w-5 text-gray-400 group-hover:text-primary" />
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="+84337934563"
            className="pl-10 focus:border-primary focus:ring-primary transition-all duration-200"
            value={phoneNumber}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[^\d+]/g, "");
              setPhoneNumber(sanitized);
            }}
            required
            aria-required="true"
            inputMode="numeric"
            pattern="\+?\d{10,15}"
            maxLength={16}
            disabled={step === 2}
          />
        </div>
      </div>

      {/* Access Code */}
      {step === 2 && (
        <div>
          <label
            htmlFor="accessCode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Access Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-5 w-5 text-gray-400 group-hover:text-primary" />
            </div>
            <Input
              id="accessCode"
              type="text"
              placeholder="6-digit code"
              className="pl-10 focus:border-primary focus:ring-primary transition-all duration-200"
              value={accessCode}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setAccessCode(onlyNumbers);
              }}
              required
              aria-required="true"
              maxLength={6}
              inputMode="numeric"
              pattern="\d*"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full mt-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
            onClick={handleResendCode}
            disabled={resendTimer > 0}
          >
            {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend Code"}
          </Button>
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded-md transition-all duration-200 cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Submitting..."
          : step === 1
          ? "Send Access Code"
          : "Verify Access Code"}
      </Button>

      <p className="text-xs text-center text-gray-500">
        By continuing, you agree to our{" "}
        <span className="underline cursor-pointer hover:text-primary">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="underline cursor-pointer hover:text-primary">
          Privacy Policy
        </span>
        .
      </p>
    </form>
  );
}
