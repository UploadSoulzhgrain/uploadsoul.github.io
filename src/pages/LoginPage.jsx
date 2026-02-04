import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Logo from '../components/common/Logo';

const LoginPage = () => {
  const { t } = useTranslation();
  const { signIn, signInWithGoogle, signInWithOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone Auth States
  const [countryCode, setCountryCode] = useState('+86');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const { state } = useLocation();

  // Country Options
  const countryOptions = [
    { code: '+86', label: '🇨🇳 中国 (+86)' },
    { code: '+1', label: '🇺🇸 USA (+1)' },
    { code: '+44', label: '🇬🇧 UK (+44)' },
    { code: '+81', label: '🇯🇵 Japan (+81)' },
    { code: '+82', label: '🇰🇷 Korea (+82)' },
    { code: '+852', label: '🇭🇹 Hong Kong (+852)' },
    { code: '+886', label: '🇹🇼 Taiwan (+886)' },
  ];

  const handleSendOtp = async () => {
    if (!phone) {
      setError('请输入手机号码');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const fullPhone = `${countryCode}${phone}`;
      const { error } = await signInWithOtp({
        phone: fullPhone,
      });

      if (error) throw error;

      setOtpSent(true);
      setMessage('验证码已发送，请查收');
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('OTP Send Error:', err);
      setError(err.message || '发送验证码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (method === 'phone') {
      if (!otpSent) {
        await handleSendOtp();
        return;
      }

      try {
        const fullPhone = `${countryCode}${phone}`;
        const { data, error } = await verifyOtp({
          phone: fullPhone,
          token: code,
          type: 'sms'
        });

        if (error) throw error;

        if (data.session) {
          navigate(state?.from?.pathname || '/dashboard');
        }
      } catch (err) {
        console.error('Verify Error:', err);
        setError(err.message || '验证码错误或已过期');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Email Login
    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
      navigate(state?.from?.pathname || '/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || '登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Google 登录失败');
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
          {t('auth.login', '欢迎回来')}
        </h2>
        <p className="text-gray-400">
          {t('auth.loginDesc', '登录您的 UploadSoul 账号')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1A1A24] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5">
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-700 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              使用 Google 账号登录
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1A1A24] text-gray-500">
                或使用其他方式
              </span>
            </div>
          </div>

          {/* Method Toggle */}
          <div className="flex rounded-lg bg-gray-900/50 p-1 mb-6 border border-gray-700">
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'email'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              邮箱登录
            </button>
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'phone'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              手机登录
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {method === 'email' ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    邮箱地址
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    密码
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Phone Login UI */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    手机号码
                  </label>
                  <div className="mt-1 flex">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="appearance-none bg-gray-800 border border-gray-700 border-r-0 text-white rounded-l-xl px-3 py-3 pr-8 focus:outline-none focus:border-amber-500 cursor-pointer"
                      style={{ minWidth: '100px' }}
                    >
                      {countryOptions.map(opt => (
                        <option key={opt.code} value={opt.code}>{opt.code}</option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 appearance-none block w-full px-3 py-3 border border-gray-700 rounded-r-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="13800000000"
                      disabled={otpSent}
                    />
                  </div>
                </div>
                {otpSent && (
                  <div key="otp-input-field">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                      验证码
                    </label>
                    <div className="mt-1 flex gap-2">
                      <input
                        id="code"
                        name="code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="flex-1 appearance-none block w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                        placeholder="输入6位验证码"
                      />
                    </div>
                  </div>
                )}
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading || !phone}
                    className="w-full py-3 border border-gray-700 rounded-xl text-sm font-medium text-amber-500 hover:bg-gray-800 disabled:opacity-50 transition-colors"
                  >
                    {loading ? '发送中...' : '发送验证码'}
                  </button>
                )}
              </>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-lg border border-red-900/50">
                {error}
              </div>
            )}

            {message && (
              <div className="text-green-400 text-sm text-center bg-green-900/20 py-2 rounded-lg border border-green-900/50">
                {message}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-amber-500 hover:text-amber-400">
                  {t('auth.forgotPassword', '忘记密码?')}
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white btn-premium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : (method === 'email' ? '立即登录' : (otpSent ? '验证并登录' : '请先发送验证码'))}
              </button>
              {otpSent && countdown > 0 && (
                <div className="mt-2 text-center text-xs text-gray-500">
                  {countdown}秒后可重试
                </div>
              )}
              {otpSent && countdown === 0 && (
                <div className="mt-2 text-center text-xs">
                  <span onClick={handleSendOtp} className="text-amber-500 cursor-pointer hover:underline">重新发送</span>
                </div>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1A1A24] text-gray-500">
                  没有账号？
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <Link
                to="/register"
                className="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-xl shadow-sm bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
              >
                注册新账号
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;