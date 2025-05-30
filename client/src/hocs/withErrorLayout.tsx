import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

interface ErrorPageProps {
  title: string;
  message: string;
  statusCode?: number;
  showHomeButton?: boolean;
  showBackButton?: boolean;
}

// Higher Order Component (HOC) for error pages
const withErrorLayout = (WrappedComponent: React.FC<ErrorPageProps>) => {
  return (props: ErrorPageProps) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      // Trigger animation after component mounts
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);

      return () => clearTimeout(timer);
    }, []);

    return (
      // Positioned fixed to viewport with full height and width
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        <div
          className={`
            w-full max-w-md mx-4 p-8 bg-white rounded-xl shadow-md
            transition-all duration-500 ease-out
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
          `}
        >
          <div className="text-center">
            {props.statusCode && (
              <div
                className={`
                  mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6
                  transition-all duration-700 delay-300 ease-out
                  ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"}
                `}
              >
                <span className="text-3xl font-bold text-red-500">
                  {props.statusCode}
                </span>
              </div>
            )}
            <div
              className={`
              transition-all duration-500 delay-500 ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }
            `}
            >
              <WrappedComponent {...props} />
            </div>
            <div
              className={`
              mt-8 flex flex-col sm:flex-row gap-4 justify-center
              transition-all duration-500 delay-700 ease-out
              ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }
            `}
            >
              {props.showHomeButton && (
                <button
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="px-6 py-2.5 bg-blue-700 text-white font-medium rounded hover:bg-blue-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Trang chủ
                </button>
              )}
              {props.showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Quay lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default withErrorLayout;
