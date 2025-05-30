import React from 'react'

interface BaseErrorPageProps {
  title: string
  message: string
  statusCode?: number
}

const BaseErrorPage: React.FC<BaseErrorPageProps> = ({ title, message, statusCode }) => {
  return (
    <>
      <h1 className='text-2xl font-bold text-gray-800 mb-2'>{title}</h1>
      <p className='text-gray-600 mb-4'>{message}</p>
      {statusCode && <p className='text-sm text-gray-500'>Mã lỗi: {statusCode}</p>}
    </>
  )
}

export default BaseErrorPage
