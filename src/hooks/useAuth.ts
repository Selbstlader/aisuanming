'use client';

import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { 
  signUp, 
  signIn, 
  signOut as authSignOut, 
  getCurrentUser, 
  onAuthStateChange 
} from '@/lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 获取当前用户
    const getUser = async () => {
      try {
        const { user: currentUser, error } = await getCurrentUser();
        if (error) {
          // 检查是否是会话缺失错误（用户未登录的正常情况）
          if (error.message?.includes('Auth session missing')) {
            setUser(null);
            setError(null);
          } else {
            console.error('获取用户信息失败:', error);
            setError('获取用户信息失败');
          }
        } else {
          // 用户未登录时 currentUser 为 null，这是正常情况，不是错误
          setUser(currentUser);
          setError(null); // 清除之前的错误状态
        }
      } catch (err) {
        // 检查是否是会话缺失错误（用户未登录的正常情况）
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('Auth session missing')) {
          setUser(null);
          setError(null);
        } else {
          console.error('获取用户信息失败:', err);
          setError('获取用户信息失败');
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // 监听认证状态变化
    const { data: { subscription } } = onAuthStateChange((event, session: unknown) => {
      const typedSession = session as Session | null;
      setUser(typedSession?.user ?? null);
      setLoading(false);
      setError(null); // 清除错误状态
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        throw new Error(signUpError.message);
      }
      
      // 注册成功后自动设置用户状态
      if (data?.user) {
        setUser(data.user);
      }
      
      return { user: data?.user, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '注册失败';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: signInError } = await signIn(email, password);
      
      if (signInError) {
        throw new Error(signInError.message);
      }
      
      return { user: data?.user, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败';
      setError(errorMessage);
      return { user: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error: signOutError } = await authSignOut();
      
      if (signOutError) {
        throw new Error(signOutError.message);
      }
      
      setUser(null);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登出失败';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    signOut,
    clearError,
    isAuthenticated: !!user,
  };
};