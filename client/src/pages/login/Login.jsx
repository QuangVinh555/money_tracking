import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import {
    TrendingUp, BarChart3, Gem
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const navigate = useNavigate()
    const handleLogin = () => {
        localStorage.setItem('access_token', '123test')
        navigate('/');
    }

    const handleSuccess = async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        console.log('token', idToken)
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_API}/api/LoginWithGoogle/google`, {
                idToken
            });

            const { token } = res.data;

            // Lưu token hệ thống
            localStorage.setItem('access_token', token);
            
            navigate('/');
        } catch (err) {
            console.error('Đăng nhập thất bại:', err);
        }
    };

    return (
        <>
            <style>{`
                /* Background Gradient Animation */
                @keyframes gradient-animation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient-animation 15s ease infinite;
                }

                /* Entrance Animation */
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0; /* Start hidden */
                }
                
                /* Staggered delays */
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }

                /* Enhanced button hover effect */
                .btn-hover {
                    transition: all 0.3s ease-in-out;
                }
                .btn-hover:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
                
                .benefit-item:hover {
                    background-color: #f9fafb; /* gray-50 */
                    transform: translateX(4px);
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-100 animate-gradient">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10 border border-white/30">
                    <div className="flex justify-center mb-6 animate-fade-in-up">
                        <img
                            src="../../../public/url_icon.png"
                            alt="Financial Illustration"
                            className="w-48 h-auto"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://placehold.co/192x150/e0e7ff/3730a3?text=Illustration';
                            }}
                        />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700 animate-fade-in-up delay-100">
                            Bắt Đầu Thông Minh
                        </h1>
                        <p className="text-gray-600 mt-2 animate-fade-in-up delay-200">Quản lý tài chính cá nhân chưa bao giờ dễ dàng hơn.</p>
                    </div>
                    <div className="mb-8 space-y-3">
                        {/* Benefit Items */}
                        <div className="flex items-start p-2 rounded-lg benefit-item animate-fade-in-up delay-300">
                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-4"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
                            <div><h3 className="font-semibold text-gray-800">Đồng bộ hóa Đám mây</h3><p className="text-gray-500 text-sm">Truy cập dữ liệu của bạn an toàn từ mọi thiết bị.</p></div>
                        </div>
                        <div className="flex items-start p-2 rounded-lg benefit-item animate-fade-in-up delay-400">
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4"><BarChart3 className="h-5 w-5 text-green-600" /></div>
                            <div><h3 className="font-semibold text-gray-800">Báo cáo Trực quan</h3><p className="text-gray-500 text-sm">Hiểu rõ thói quen chi tiêu qua biểu đồ chi tiết.</p></div>
                        </div>
                        <div className="flex items-start p-2 rounded-lg benefit-item animate-fade-in-up delay-500">
                            <div className="flex-shrink-0 bg-purple-100 rounded-full p-2 mr-4"><Gem className="h-5 w-5 text-purple-600" /></div>
                            <div><h3 className="font-semibold text-gray-800">Bảo mật & An toàn</h3><p className="text-gray-500 text-sm">Dữ liệu của bạn được mã hóa và bảo vệ an toàn.</p></div>
                        </div>
                    </div>
                    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => {
                                console.log('Login Failed');
                            }}
                        />
                        <button onClick={handleLogin} className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl btn-hover">
                            Trải nghiệm bản Demo
                        </button>
                    </div>
                    <div className="mt-8 text-center animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                        <p className="text-xs text-gray-500">
                            Bằng việc tiếp tục, bạn đồng ý với
                            <a href="#" className="font-medium text-indigo-600 hover:underline"> Điều khoản Dịch vụ</a> và
                            <a href="#" className="font-medium text-indigo-600 hover:underline"> Chính sách Bảo mật</a>.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Login