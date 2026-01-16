import {Loader2} from 'lucide-react'
// const FullScreenLoader = () => (
//     <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
//         <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
//         <p className="mt-4 text-lg font-semibold text-gray-700">Đang đăng nhập...</p>
//     </div>
// );

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-emerald-200 to-teal-800 flex flex-col items-center justify-center">
    <style>{`
      @keyframes gradient-animation {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient-animation 15s ease infinite;
      }
    `}</style>
    <div className="animate-gradient absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-800"></div>
    <div className="relative z-10 flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-white drop-shadow-lg" />
      <p className="mt-4 text-lg font-semibold text-white drop-shadow-md">Đang đăng nhập...</p>
    </div>
  </div>
);


export default FullScreenLoader;