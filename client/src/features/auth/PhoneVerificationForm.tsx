import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { KeyIcon, PhoneIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidAccessCode, isValidPhoneNumber } from "@/utils/validations";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface PhoneVerificationFormProps {
  onRequestAccessCode: (phoneNumber: string) => Promise<void>;
  onVerifyAccessCode: (
    phoneNumber: string,
    accessCode: string
  ) => Promise<void>;
  isSubmitting?: boolean;
}

const CODE_EXPIRATION_SECONDS = 5 * 60;

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
    if (step === 1) {
      if (!isValidPhoneNumber(phoneNumber)) {
        toast.error(
          " Please enter a valid Vietnamese phone number (e.g., +84337934563)"
        );
        return;
      }

      await onRequestAccessCode(phoneNumber);
      setStep(2);
      setResendTimer(60);
      setOtpExpirationTimer(CODE_EXPIRATION_SECONDS);
    } else if (step === 2) {
      if (!isValidAccessCode(accessCode)) {
        toast.error("Please enter a 6-digit access code.");
        return;
      }

      await onVerifyAccessCode(phoneNumber, accessCode);
    }
  };

  const handleResendCode = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error(
        " Please enter a valid Vietnamese phone number (e.g., +84337934563)"
      );
      return;
    }
    await onRequestAccessCode(phoneNumber);
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
      className="w-[28%] max-w-3xl mx-auto space-y-6 p-6 bg-white shadow-lg rounded-xl border border-gray-200"
      aria-labelledby="phone-form-title"
    >
      <div className="flex justify-start mb-2">
        <Link
          to={ROUTES.HOME}
          className="
      inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200
    "
        >
          <span className="text-lg">←</span> Back to Search
        </Link>
      </div>

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
            placeholder="Enter Vietnamese phone number (e.g., +84987111999)"
            className="pl-10 focus:border-primary focus:ring-primary transition-all duration-200"
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
              aria-live="polite"
              maxLength={6}
              inputMode="numeric"
              pattern="\d*"
            />
          </div>

          {/* Countdown for OTP expiration */}
          {otpExpirationTimer > 0 ? (
            <p className="mt-2 text-sm text-gray-500">
              This code will expire in{" "}
              <b className="font-semibold text-black">
                {formatTime(otpExpirationTimer)}
              </b>
              .
            </p>
          ) : (
            <p className="mt-2 text-sm text-red-500 font-semibold">
              The code has expired. Please request a new one.
            </p>
          )}

          <div className="flex justify-between items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer"
              onClick={handleResendCode}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend Code"}
            </Button>
          </div>
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
