import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import Logo from '../components/common/Logo';

const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setMessage('重置链接已发送到您的邮箱，请查收。');
        } catch (error) {
            console.error('Reset password error:', error);
            setError('发送失败，请确保邮箱正确，或稍后重试。' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-tech-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link to="/" className="inline-block mb-6">
                    <Logo size="lg" />
                </Link>
                <h2 className="text-3xl font-extrabold text-white mb-2">
                    找回密码
                </h2>
                <p className="text-gray-400">
                    输入您的注册邮箱，我们将发送重置链接给您
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-[#1A1A24] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5">
                    {message ? (
                        <div className="text-green-400 text-center bg-green-900/20 p-4 rounded-xl border border-green-900/50">
                            <p className="mb-4">{message}</p>
                            <Link to="/login" className="text-amber-500 font-bold hover:underline">
                                返回登录
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleReset}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    邮箱地址
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-900/50">
                                    {error}
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white btn-premium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                >
                                    {loading ? '发送中...' : '发送重置链接'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link to="/login" className="font-medium text-amber-500 hover:text-amber-400 text-sm">
                            &lt; 返回登录
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
