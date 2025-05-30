import React from "react";
import withErrorLayout from "@/hocs/withErrorLayout";
import BaseErrorPage from "./BaseErrorPage";

const NotFound: React.FC = () => {
  const EnhancedNotFoundPage = withErrorLayout(BaseErrorPage);

  return (
    <EnhancedNotFoundPage
      title="404 - Page Not Found"
      message="Trang bạn đang tìm kiếm không tồn tại."
      statusCode={404}
      showHomeButton={true}
      showBackButton={true}
    />
  );
};

export default NotFound;
