-- 为naming_categories表授予权限
-- 允许匿名用户读取分类数据
GRANT SELECT ON naming_categories TO anon;

-- 允许认证用户完全访问分类数据
GRANT ALL PRIVILEGES ON naming_categories TO authenticated;

-- 创建RLS策略，允许所有用户读取激活的分类
CREATE POLICY "Allow read access to active categories" ON naming_categories
  FOR SELECT
  TO public
  USING (is_active = true);

-- 允许认证用户管理自己的分类
CREATE POLICY "Allow authenticated users to manage their categories" ON naming_categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);