'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('请填写完整的登录信息');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      router.push('/'); // 登录成功后跳转到首页
    } catch (error) {
      console.error('登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="title-ancient text-4xl font-bold mb-4">
              用户登录
            </h1>
            <p className="text-gold-500/80 text-lg">
              登录您的账户，开启命理之旅
            </p>
          </div>

          {/* 登录表单 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="card-ancient p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 邮箱输入 */}
              <div>
                <label className="block text-sm font-medium text-ancient-ink mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  邮箱地址
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-ancient"
                  placeholder="请输入邮箱地址"
                  required
                />
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-ancient-ink mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  密码
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-ancient pr-10"
                    placeholder="请输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ancient-ink/60 hover:text-ancient-ink transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* 错误信息 */}
              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    登录中...
                  </div>
                ) : (
                  '登录'
                )}
              </button>

              {/* 注册链接 */}
              <div className="text-center text-sm text-ancient-ink/70">
                还没有账户？
                <Link
                  href="/auth/register"
                  className="text-gold-500 hover:text-gold-400 ml-1 transition-colors"
                >
                  立即注册
                </Link>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LoginPage;