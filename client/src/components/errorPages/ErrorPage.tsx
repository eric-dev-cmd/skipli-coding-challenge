import React from 'react'
import { useRouteError } from 'react-router-dom'
import withErrorLayout from '@/hocs/withErrorLayout'
import BaseErrorPage from './BaseErrorPage'

const ErrorPage: React.FC = () => {
  const error = useRouteError()
  console.error(error)

  let errorMessage: string

  if (error instanceof Error) {
    errorMessage = error.message
  } else if (error && typeof error === 'object' && 'statusText' in error) {
    errorMessage = (error as { statusText: string }).statusText
  } else {
    errorMessage = 'Đã xảy ra lỗi không xác định'
  }

  const EnhancedErrorPage = withErrorLayout(BaseErrorPage)

  return (
    <EnhancedErrorPage
      title='Đã xảy ra lỗi!'
      message={`Xin lỗi, có điều gì đó không ổn: ${errorMessage}`}
      statusCode={500}
      showHomeButton={true}
      showBackButton={true}
    />
  )
}

export default ErrorPage
