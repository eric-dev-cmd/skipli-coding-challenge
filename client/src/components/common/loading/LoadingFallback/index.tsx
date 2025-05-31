import './loading-fallback.css'

export default function LoadingFallback() {
  return (
    <div className='fixed inset-0 flex gap-8 flex-col justify-center items-center z-[105]'>
      <div className='inset-0 absolute bg-slate-500 opacity-75' />
      <div className='font-semibold text-white relative z-2 text-xl'>Đang tải, vui lòng chờ </div>
      <div>
        <div className='boxes'>
          <div className='box'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className='box'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className='box'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className='box'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}
