import { createClient } from '@supabase/supabase-js';

// Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajigflmwielsacynyypu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaWdmbG13aWVsc2FjeW55eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTEzNDUsImV4cCI6MjA3MDU2NzM0NX0.GkqI80uEtrl5gGgUiP7tbMy3F48aagyIRyX1ZGj-3Tw';

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// 认证相关函数
export async function signUp(email: string, password: string, userData?: { name?: string; gender?: 'male' | 'female' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

// 重命名导出以避免冲突
export { signOut as authSignOut };

// 数据库表名常量
export const TABLES = {
  USERS: 'users',
  BAZI_RECORDS: 'bazi_records',
  ANALYSIS_RESULTS: 'analysis_results',
} as const;

// 认证相关函数
export const auth = {
  // 注册用户
  signUp: async (email: string, password: string, userData: { name: string; gender: 'male' | 'female' }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    return { data, error };
  },

  // 登录用户
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // 登出用户
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // 获取当前用户
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // 监听认证状态变化
  onAuthStateChange: (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// 数据库操作函数
export const database = {
  // 八字记录相关
  bazi: {
    // 创建八字记录
    create: async (record: {
      name: string;
      gender: string;
      birth_date: string;
      birth_time: string;
      birth_location?: string;
      longitude?: number;
      latitude?: number;
      timezone?: number;
      year_pillar?: string;
      month_pillar?: string;
      day_pillar?: string;
      hour_pillar?: string;
      bazi_result?: object;
      wuxing_analysis?: object;
      user_id?: string;
    }) => {
      const { data, error } = await supabase
        .from(TABLES.BAZI_RECORDS)
        .insert(record)
        .select()
        .single();
      return { data, error };
    },

    // 获取用户的八字记录
    getByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from(TABLES.BAZI_RECORDS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    // 根据ID获取八字记录
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from(TABLES.BAZI_RECORDS)
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },
  },

  // 分析结果相关
  analysis: {
    // 创建分析结果
    create: async (analysis: {
      bazi_record_id: string;
      analysis_type: string;
      result: object;
      user_id?: string;
      is_favorite?: boolean;
    }) => {
      const { data, error } = await supabase
        .from(TABLES.ANALYSIS_RESULTS)
        .insert(analysis)
        .select()
        .single();
      return { data, error };
    },

    // 获取分析结果
    getByBaziId: async (baziRecordId: string) => {
      const { data, error } = await supabase
        .from(TABLES.ANALYSIS_RESULTS)
        .select('*')
        .eq('bazi_record_id', baziRecordId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return { data, error };
    },

    // 获取用户的收藏分析
    getFavoritesByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from(TABLES.ANALYSIS_RESULTS)
        .select('*, bazi_records(*)')
        .eq('user_id', userId)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });
      return { data, error };
    },

    // 切换收藏状态
    toggleFavorite: async (id: string, isFavorite: boolean) => {
      const { data, error } = await supabase
        .from(TABLES.ANALYSIS_RESULTS)
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },
  },

  // 用户相关
  users: {
    // 创建用户记录
    create: async (user: {
      id: string;
      email: string;
      name?: string;
      avatar_url?: string;
    }) => {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert(user)
        .select()
        .single();
      return { data, error };
    },

    // 获取用户信息
    getById: async (id: string) => {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    },

    // 更新用户信息
    update: async (id: string, updates: {
      name?: string;
      email?: string;
      avatar_url?: string;
      updated_at?: string;
    }) => {
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    },

    // 确保用户记录存在（如果不存在则创建）
    ensureExists: async (authUser: { id: string; email: string; user_metadata?: { name?: string; avatar_url?: string } }) => {
      // 首先检查用户是否已存在
      const { data: existingUser, error: checkError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      // 如果用户已存在，直接返回
      if (existingUser && !checkError) {
        return { data: existingUser, error: null };
      }
      
      // 如果用户不存在，创建新用户记录
      const userData = {
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.name || null,
        avatar_url: authUser.user_metadata?.avatar_url || null,
      };
      
      const { data, error } = await supabase
        .from(TABLES.USERS)
        .insert(userData)
        .select()
        .single();
      
      return { data, error };
    },
  },
};