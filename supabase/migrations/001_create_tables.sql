-- 创建用户表（扩展Supabase Auth）
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建八字记录表
CREATE TABLE IF NOT EXISTS public.bazi_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  birth_place JSONB NOT NULL, -- {address, longitude, latitude, timezone}
  year_pillar TEXT NOT NULL,
  month_pillar TEXT NOT NULL,
  day_pillar TEXT NOT NULL,
  hour_pillar TEXT NOT NULL,
  wuxing_analysis JSONB NOT NULL, -- {wood, fire, earth, metal, water, dominant, lacking, balance_score}
  use_real_solar_time BOOLEAN DEFAULT true,
  real_solar_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分析结果表
CREATE TABLE IF NOT EXISTS public.analysis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bazi_record_id UUID REFERENCES public.bazi_records(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL CHECK (analysis_type IN ('basic', 'detailed', 'premium')),
  analysis_content JSONB NOT NULL, -- {personality, career, wealth, relationship, health, suggestions}
  ai_response TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  bazi_record_id UUID REFERENCES public.bazi_records(id) ON DELETE CASCADE,
  analysis_result_id UUID REFERENCES public.analysis_results(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, bazi_record_id, analysis_result_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bazi_records_user_id ON public.bazi_records(user_id);
CREATE INDEX IF NOT EXISTS idx_bazi_records_created_at ON public.bazi_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_results_bazi_record_id ON public.analysis_results(bazi_record_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id ON public.analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON public.analysis_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON public.user_favorites(user_id);

-- 启用行级安全策略 (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bazi_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略

-- 用户表策略
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 八字记录表策略
CREATE POLICY "Users can view own bazi records" ON public.bazi_records
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own bazi records" ON public.bazi_records
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own bazi records" ON public.bazi_records
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own bazi records" ON public.bazi_records
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- 分析结果表策略
CREATE POLICY "Users can view own analysis results" ON public.analysis_results
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own analysis results" ON public.analysis_results
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own analysis results" ON public.analysis_results
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete own analysis results" ON public.analysis_results
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- 用户收藏表策略
CREATE POLICY "Users can view own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- 创建触发器函数用于更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为相关表创建更新触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bazi_records_updated_at BEFORE UPDATE ON public.bazi_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analysis_results_updated_at BEFORE UPDATE ON public.analysis_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 授予权限给anon和authenticated角色
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON public.bazi_records TO anon;
GRANT INSERT ON public.bazi_records TO anon;
GRANT SELECT ON public.analysis_results TO anon;
GRANT INSERT ON public.analysis_results TO anon;