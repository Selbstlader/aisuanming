-- AI取名模块数据库迁移文件
-- 创建取名相关的三个核心表：naming_records、naming_favorites、naming_categories

-- 创建取名记录表
CREATE TABLE naming_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('person', 'company', 'product', 'shop')),
    style VARCHAR(20) NOT NULL CHECK (style IN ('classical', 'modern', 'poetic', 'simple')),
    requirements JSONB NOT NULL, -- 用户输入的需求配置
    generated_names JSONB NOT NULL, -- AI生成的名称列表
    ai_response JSONB, -- 完整的AI响应数据
    request_count INTEGER DEFAULT 1, -- 生成次数
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建收藏表
CREATE TABLE naming_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    naming_record_id UUID REFERENCES naming_records(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    category VARCHAR(50) DEFAULT 'default',
    analysis JSONB, -- 名称分析结果
    notes TEXT, -- 用户备注
    is_starred BOOLEAN DEFAULT FALSE, -- 是否标星
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建分类表
CREATE TABLE naming_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#2D1B69', -- 十六进制颜色值
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
-- naming_records 表索引
CREATE INDEX idx_naming_records_user_id ON naming_records(user_id);
CREATE INDEX idx_naming_records_type ON naming_records(type);
CREATE INDEX idx_naming_records_created_at ON naming_records(created_at DESC);
CREATE INDEX idx_naming_records_requirements ON naming_records USING GIN(requirements);

-- naming_favorites 表索引
CREATE INDEX idx_naming_favorites_user_id ON naming_favorites(user_id);
CREATE INDEX idx_naming_favorites_category ON naming_favorites(category);
CREATE INDEX idx_naming_favorites_type ON naming_favorites(type);
CREATE INDEX idx_naming_favorites_created_at ON naming_favorites(created_at DESC);
CREATE INDEX idx_naming_favorites_starred ON naming_favorites(is_starred) WHERE is_starred = TRUE;

-- naming_categories 表索引
CREATE INDEX idx_naming_categories_user_id ON naming_categories(user_id);
CREATE INDEX idx_naming_categories_sort_order ON naming_categories(sort_order);

-- 创建唯一约束
-- 防止重复收藏
CREATE UNIQUE INDEX idx_naming_favorites_unique ON naming_favorites(user_id, name, type);

-- 同一用户不能有重名分类
CREATE UNIQUE INDEX idx_naming_categories_unique ON naming_categories(user_id, name);

-- 启用行级安全策略
ALTER TABLE naming_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE naming_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE naming_categories ENABLE ROW LEVEL SECURITY;

-- 创建行级安全策略
-- 用户只能访问自己的取名记录
CREATE POLICY "Users can only access their own naming records" ON naming_records
    FOR ALL USING (auth.uid() = user_id);

-- 用户只能访问自己的收藏
CREATE POLICY "Users can only access their own favorites" ON naming_favorites
    FOR ALL USING (auth.uid() = user_id);

-- 用户只能访问自己的分类
CREATE POLICY "Users can only access their own categories" ON naming_categories
    FOR ALL USING (auth.uid() = user_id);

-- 设置表权限
-- 允许匿名用户查看（用于演示），认证用户拥有完全权限
GRANT SELECT ON naming_records TO anon;
GRANT ALL PRIVILEGES ON naming_records TO authenticated;

GRANT SELECT ON naming_favorites TO anon;
GRANT ALL PRIVILEGES ON naming_favorites TO authenticated;

GRANT SELECT ON naming_categories TO anon;
GRANT ALL PRIVILEGES ON naming_categories TO authenticated;

-- 插入默认分类数据
INSERT INTO naming_categories (user_id, name, description, color, sort_order) VALUES
-- 这些是系统默认分类，user_id 为 NULL 表示全局可用
(NULL, '默认分类', '未分类的收藏名称', '#2D1B69', 0),
(NULL, '人名候选', '个人姓名的备选方案', '#FFD700', 1),
(NULL, '公司名称', '企业和公司名称收藏', '#E1BEE7', 2),
(NULL, '产品品牌', '产品和品牌名称收藏', '#FFF8DC', 3),
(NULL, '店铺商号', '店铺和商号名称收藏', '#9333EA', 4);

-- 为默认分类创建特殊的访问策略
CREATE POLICY "Everyone can read default categories" ON naming_categories
    FOR SELECT USING (user_id IS NULL);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_naming_records_updated_at BEFORE UPDATE ON naming_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_naming_favorites_updated_at BEFORE UPDATE ON naming_favorites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_naming_categories_updated_at BEFORE UPDATE ON naming_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();