-- 检查naming_categories表的权限设置
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'naming_categories'
AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- 如果权限不足，添加必要的权限
-- 为anon角色添加SELECT权限（用于未登录用户查看分类）
GRANT SELECT ON naming_categories TO anon;

-- 为authenticated角色添加完整权限
GRANT ALL PRIVILEGES ON naming_categories TO authenticated;

-- 检查RLS策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'naming_categories';