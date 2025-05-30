interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
}

export function successResponse<T = any>(
  message: string,
  data?: T
): SuccessResponse<T> {
  return {
    success: true,
    message,
    ...(data && { data }),
  };
}

export function errorResponse(
  message: string,
  errorCode?: string
): ErrorResponse {
  return {
    success: false,
    message,
    ...(errorCode && { errorCode }),
  };
}
