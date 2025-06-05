import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { KeyIcon, PhoneIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidAccessCode, isValidPhoneNumber } from "@/utils/validations";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { normalizePhoneNumber } from "@/utils/normalizePhoneNumber";

interface PhoneVerificationFormProps {
  onRequestAccessCode: (phoneNumber: string) => Promise<void>;
  onVerifyAccessCode: (
    phoneNumber: string,
    accessCode: string
  ) => Promise<void>;
  isSubmitting?: boolean;
}

const CODE_EXPIRATION_SECONDS = 5 * 60;
const PHONE_NUMBER_ERROR = "Please enter a valid Vietnamese phone number!";

export function PhoneVerificationForm({
  onRequestAccessCode,
  onVerifyAccessCode,
  isSubmitting = false,
}: PhoneVerificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [accessCode, setAccessCode] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);
  const [resendTimer, setResendTimer] = useState<number>(0);
  const [otpExpirationTimer, setOtpExpirationTimer] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    let expirationInterval: NodeJS.Timeout;
    if (step === 2 && otpExpirationTimer > 0) {
      expirationInterval = setInterval(() => {
        setOtpExpirationTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(expirationInterval);
  }, [otpExpirationTimer, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedPhone = normalizePhoneNumber(phoneNumber, "VN");
    if (step === 1) {
      if (!isValidPhoneNumber(normalizedPhone)) {
        toast.error(PHONE_NUMBER_ERROR);
        return;
      }

      await onRequestAccessCode(normalizedPhone);
      setStep(2);
      setResendTimer(60);
      setOtpExpirationTimer(CODE_EXPIRATION_SECONDS);
    } else if (step === 2) {
      if (!isValidAccessCode(accessCode)) {
        toast.error("Please enter a 6-digit access code.");
        return;
      }

      await onVerifyAccessCode(normalizedPhone, accessCode);
    }
  };

  const handleResendCode = async () => {
    const normalizedPhone = normalizePhoneNumber(phoneNumber, "VN");

    if (!isValidPhoneNumber(normalizedPhone)) {
      toast.error(PHONE_NUMBER_ERROR);
      return;
    }
    await onRequestAccessCode(normalizedPhone);
    setResendTimer(60);
    setOtpExpirationTimer(CODE_EXPIRATION_SECONDS);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-6 bg-white shadow-lg rounded-xl border border-gray-200 m-4"
      aria-labelledby="phone-form-title"
    >
      <div className="flex justify-start mb-2">
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
        >
          <span className="text-lg">←</span> Back to Search
        </Link>
      </div>

      <div className="space-y-2 sm:space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-primary">
          Skipli Frontend Coding Challenge
        </h1>
        <h2
          id="phone-form-title"
          className="text-lg sm:text-xl font-semibold text-center text-gray-800"
        >
          Phone Verification
        </h2>
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-primary" />
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter Vietnamese phone number"
            className="pl-10 sm:pl-12 text-sm sm:text-base focus:border-primary focus:ring-primary border-gray-300 hover:border-primary transition duration-200"
            value={phoneNumber}
            onChange={(e) => {
              const sanitized = e.target.value.replace(/[^\d+]/g, "");
              setPhoneNumber(sanitized);
            }}
            required
            aria-required="true"
            aria-live="polite"
            inputMode="numeric"
            pattern="\+?\d{10,15}"
            maxLength={16}
            disabled={step === 2}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          Enter a valid Vietnamese phone number. Supported formats:{" "}
          <span className="block sm:inline mt-1 sm:mt-0">
            <b className="text-black">0337934563</b>,{" "}
            <b className="text-black">84337934563</b>, and{" "}
            <b className="text-black">+84337934563</b>
          </span>
        </p>
      </div>

      {/* Access Code */}
      {step === 2 && (
        <div className="space-y-2">
          <label
            htmlFor="accessCode"
            className="block text-sm font-medium text-gray-700"
          >
            Access Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-primary" />
            </div>
            <Input
              id="accessCode"
              type="text"
              placeholder="6-digit code"
              className="pl-10 sm:pl-12 text-sm sm:text-base text-center sm:text-left focus:border-primary focus:ring-primary transition-all duration-200"
              value={accessCode}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setAccessCode(onlyNumbers);
              }}
              required
              aria-required="true"
              aria-live="polite"
              maxLength={6}
              inputMode="numeric"
              pattern="\d*"
            />
          </div>

          {/* Countdown for OTP expiration */}
          {otpExpirationTimer > 0 ? (
            <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              This code will expire in{" "}
              <span className="font-semibold text-red-600">
                {formatTime(otpExpirationTimer)}
              </span>
            </p>
          ) : (
            <p className="mt-2 text-xs sm:text-sm text-red-500 font-semibold text-center sm:text-left">
              The code has expired. Please request a new one.
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-2 mt-3">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 h-10 sm:h-auto border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer text-sm sm:text-base"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:flex-1 h-10 sm:h-auto border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer text-sm sm:text-base"
              onClick={handleResendCode}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend Code"}
            </Button>
          </div>
        </div>
      )}

      <Button
        aria-label={step === 1 ? "Send Access Code" : "Verify Access Code"}
        type="submit"
        className="w-full h-12 sm:h-auto bg-primary hover:bg-primary-dark text-white font-semibold py-3 sm:py-2 rounded-md transition-all duration-200 cursor-pointer text-sm sm:text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <span className="loader mr-2"></span> Submitting...
          </span>
        ) : step === 1 ? (
          "Send Access Code"
        ) : (
          "Verify Access Code"
        )}
      </Button>

      <p className="text-xs text-center text-gray-500 leading-relaxed px-2">
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
