'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, History, LogOut } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  email: string;
  created_at: string;
  last_sign_in_at?: string;
}

interface BaziRecord {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  gender: string;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentRecords, setRecentRecords] = useState<BaziRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 使用useCallback避免依赖警告
  const loadUserProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      // 从用户对象中获取基本信息
      setUserProfile({
        email: user.email || '',
        created_at: user.created_at || '',
        last_sign_in_at: user.last_sign_in_at
      });
    } catch (error) {
      console.error('加载用户信息失败:', error);
    }
  }, [user]);

  const loadRecentRecords = useCallback(async () => {
    if (!user) return;
    
    try {
      // 获取认证token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        console.error('用户未认证');
        setRecentRecords([]);
        setIsLoading(false);
        return;
      }

      // 从API获取最近的5条记录
      const response = await fetch('/api/bazi/records?limit=5&sortBy=created_at&sortOrder=desc', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setRecentRecords(data.data.records);
      } else {
        console.error('加载历史记录失败:', data.error);
        setRecentRecords([]);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
      setRecentRecords([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadUserProfile();
      loadRecentRecords();
    }
  }, [user, loading, router, loadUserProfile, loadRecentRecords]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gold-500">加载中...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="title-ancient text-4xl md:text-5xl font-bold mb-4">
              个人中心
            </h1>
            <p className="text-gold-500/80 text-lg">
              管理您的账户信息和命理记录
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 用户信息卡片 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <div className="card-ancient p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-primary-900" />
                  </div>
                  <h2 className="text-xl font-semibold text-ancient-ink mb-2">
                    用户信息
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gold-500" />
                    <div>
                      <p className="text-sm text-ancient-ink/70">邮箱</p>
                      <p className="text-ancient-ink">{userProfile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gold-500" />
                    <div>
                      <p className="text-sm text-ancient-ink/70">注册时间</p>
                      <p className="text-ancient-ink">
                        {userProfile?.created_at ? formatDate(userProfile.created_at) : '未知'}
                      </p>
                    </div>
                  </div>

                  {userProfile?.last_sign_in_at && (
                    <div className="flex items-center gap-3">
                      <History className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-sm text-ancient-ink/70">最后登录</p>
                        <p className="text-ancient-ink">
                          {formatDate(userProfile.last_sign_in_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-ancient-ink/20">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              </div>
            </motion.div>

            {/* 最近记录 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="card-ancient p-6">
                <h2 className="text-xl font-semibold text-ancient-ink mb-6">
                  最近的八字记录
                </h2>

                {recentRecords.length > 0 ? (
                  <div className="space-y-4">
                    {recentRecords.map((record) => (
                      <div
                        key={record.id}
                        className="bg-ancient-paper/30 rounded-lg p-4 hover:bg-ancient-paper/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/analysis?recordId=${record.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-ancient-ink">
                              {record.name || '未命名'}
                            </h3>
                            <p className="text-sm text-ancient-ink/70">
                              出生：{record.birth_date} {record.birth_time}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-ancient-ink/70">
                              {formatDate(record.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-ancient-ink/30 mx-auto mb-4" />
                    <p className="text-ancient-ink/70 mb-4">暂无八字记录</p>
                    <button
                      onClick={() => router.push('/bazi')}
                      className="btn-gold px-6 py-2"
                    >
                      开始排盘
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-ancient-ink/20">
                  <div className="flex gap-4">
                    <button
                      onClick={() => router.push('/history')}
                      className="btn-ancient px-4 py-2 flex items-center gap-2"
                    >
                      <History className="w-4 h-4" />
                      查看全部记录
                    </button>
                    <button
                      onClick={() => router.push('/bazi')}
                      className="btn-gold px-4 py-2 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      新建排盘
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfilePage;