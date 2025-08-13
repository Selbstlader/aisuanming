'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 清除之前的验证错误
    setValidationError(null);
    
    if (!email || !password || !confirmPassword) {
      setValidationError('请填写完整的注册信息');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      setValidationError('密码长度至少为6位');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await register(email, password);
      if (result.user) {
        router.push('/'); // 注册成功后直接跳转到主页
      }
      // 错误信息已经通过useAuth hook的error状态处理
    } catch (error) {
      console.error('注册失败:', error);
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
              用户注册
            </h1>
            <p className="text-gold-500/80 text-lg">
              创建您的账户，探索命理奥秘
            </p>
          </div>

          {/* 注册表单 */}
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
                    placeholder="请输入密码（至少6位）"
                    required
                    minLength={6}
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

              {/* 确认密码输入 */}
              <div>
                <label className="block text-sm font-medium text-ancient-ink mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  确认密码
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-ancient pr-10"
                    placeholder="请再次输入密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ancient-ink/60 hover:text-ancient-ink transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* 错误信息 */}
              {(error || validationError) && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {validationError || error}
                </div>
              )}

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    注册中...
                  </div>
                ) : (
                  '注册'
                )}
              </button>

              {/* 登录链接 */}
              <div className="text-center text-sm text-ancient-ink/70">
                已有账户？
                <Link
                  href="/auth/login"
                  className="text-gold-500 hover:text-gold-400 ml-1 transition-colors"
                >
                  立即登录
                </Link>
              </div>

              {/* 服务条款 */}
              <div className="text-xs text-ancient-ink/60 text-center">
                注册即表示您同意我们的
                <Link href="/terms" className="text-gold-500 hover:text-gold-400 mx-1">
                  服务条款
                </Link>
                和
                <Link href="/privacy" className="text-gold-500 hover:text-gold-400 mx-1">
                  隐私政策
                </Link>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RegisterPage;