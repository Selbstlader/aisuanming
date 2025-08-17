-- 检查当前权限
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name IN ('naming_favorites', 'naming_records') 
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;

-- 为naming_records表授权
GRANT SELECT, INSERT, UPDATE ON naming_records TO authenticated;
GRANT SELECT ON naming_records TO anon;

-- 为naming_favorites表授权
GRANT ALL PRIVILEGES ON naming_favorites TO authenticated;
GRANT SELECT ON naming_favorites TO anon;

-- 再次检查权限
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
  AND table_name IN ('naming_favorites', 'naming_records') 
  AND grantee IN ('anon', 'authenticated') 
ORDER BY table_name, grantee;