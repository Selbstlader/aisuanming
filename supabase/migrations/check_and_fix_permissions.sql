-- 检查naming_categories表的权限
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'naming_categories' 
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- 为anon角色授予SELECT权限
GRANT SELECT ON naming_categories TO anon;

-- 为authenticated角色授予所有权限
GRANT ALL PRIVILEGES ON naming_categories TO authenticated;

-- 再次检查权限是否正确设置
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name = 'naming_categories' 
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;