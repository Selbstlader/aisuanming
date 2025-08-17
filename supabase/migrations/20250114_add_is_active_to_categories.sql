-- 为naming_categories表添加is_active字段
-- 用于控制分类的激活状态

-- 添加is_active字段，默认为true
ALTER TABLE naming_categories 
ADD COLUMN is_active BOOLEAN DEFAULT TRUE;

-- 为现有记录设置is_active为true
UPDATE naming_categories 
SET is_active = TRUE 
WHERE is_active IS NULL;

-- 创建索引以提高查询性能
CREATE INDEX idx_naming_categories_is_active ON naming_categories(is_active) WHERE is_active = TRUE;

-- 添加注释
COMMENT ON COLUMN naming_categories.is_active IS '分类是否激活，用于软删除和状态控制';