import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import Logo from '../components/common/Logo';

const RegisterPage = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (method === 'phone') {
      setError('手机注册功能暂未开放，请使用邮箱注册（免费且即时）');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname || email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      if (data?.session) {
        navigate('/dashboard'); // 直接登录成功，跳转至仪表盘
      } else if (data?.user) {
        setMessage('注册确认邮件已发送！请查收邮件并点击链接完成验证。');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || '注册失败');
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
          {t('auth.register', '创建新账号')}
        </h2>
        <p className="text-gray-400">
          加入 UploadSoul，开启数字永生之旅
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1A1A24] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/5">

          {/* 切换注册方式 */}
          <div className="flex rounded-lg bg-gray-900/50 p-1 mb-6 border border-gray-700">
            <button
              onClick={() => setMethod('email')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'email'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              邮箱注册
            </button>
            <button
              onClick={() => setMethod('phone')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${method === 'phone'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              手机注册
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {method === 'email' ? (
              <>
                <div>
                  <label htmlFor="nickname" className="block text-sm font-medium text-gray-300">
                    个性昵称
                  </label>
                  <div className="mt-1">
                    <input
                      id="nickname"
                      name="nickname"
                      type="text"
                      placeholder="想让星空如何称呼您？"
                      required
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
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
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    设置密码
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    手机号码
                  </label>
                  <div className="mt-1 flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-700 bg-gray-800 text-gray-400 sm:text-sm">
                      +86
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 appearance-none block w-full px-3 py-3 border border-gray-700 rounded-r-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="13800000000"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                    验证码
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      className="flex-1 appearance-none block w-full px-3 py-3 border border-gray-700 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-700 rounded-xl text-sm font-medium text-amber-500 hover:bg-gray-800 focus:outline-none"
                    >
                      获取验证码
                    </button>
                  </div>
                </div>
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white btn-premium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '处理中...' : (method === 'email' ? '注册' : '下一步')}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              已有账号？{' '}
              <Link to="/login" className="font-medium text-amber-500 hover:text-amber-400">
                直接登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;