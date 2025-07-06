import {Loader2} from 'lucide-react'
// const FullScreenLoader = () => (
//     <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
//         <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
//         <p className="mt-4 text-lg font-semibold text-gray-700">Đang đăng nhập...</p>
//     </div>
// );

const FullScreenLoader = () => (
  <div className="fixed inset-0 z-[9999] bg-indigo-300 flex flex-col items-center justify-center">
    <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
    <p className="mt-4 text-lg font-semibold text-indigo-800">Đang đăng nhập...</p>
  </div>
);


export default FullScreenLoader;