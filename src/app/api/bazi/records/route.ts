import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// 创建service role客户端（仅用于服务端，绕过RLS）
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajigflmwielsacynyypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaWdmbG13aWVsc2FjeW55eXB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDk5MTM0NSwiZXhwIjoyMDcwNTY3MzQ1fQ.QFDRIc8nOu1dowflbIHNqF-WZhNkxOesfmNXga49jVQ'
);

export async function GET(request: NextRequest) {
  try {
    // 从请求头获取认证token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: '缺少认证信息' },
        { status: 401 }
      );
    }

    // 创建带有用户token的supabase客户端
    const token = authHeader.replace('Bearer ', '');
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajigflmwielsacynyypu.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaWdmbG13aWVsc2FjeW55eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTEzNDUsImV4cCI6MjA3MDU2NzM0NX0.GkqI80uEtrl5gGgUiP7tbMy3F48aagyIRyX1ZGj-3Tw',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // 验证用户
    const { data: { user }, error: authError } = await supabaseWithAuth.auth.getUser();
    
    if (authError || !user) {
      console.error('认证失败:', authError);
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 计算偏移量
    const offset = (page - 1) * limit;

    console.log(`获取用户 ${user.id} 的八字记录列表，页码: ${page}, 限制: ${limit}, 搜索: ${search}`);

    // 构建查询
    let query = supabaseServiceRole
      .from('bazi_records')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // 添加搜索条件
    if (search) {
      query = query.or(`name.ilike.%${search}%,birth_location.ilike.%${search}%`);
    }

    // 添加排序
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // 添加分页
    query = query.range(offset, offset + limit - 1);

    const { data: records, error, count } = await query;

    if (error) {
      console.error('查询八字记录列表失败:', error);
      return NextResponse.json(
        { error: '查询记录失败' },
        { status: 500 }
      );
    }

    // 转换记录格式
    const transformedRecords = records?.map(record => ({
      ...record,
      birth_location: record.birth_place?.address || '',
      longitude: record.birth_place?.longitude || 0,
      latitude: record.birth_place?.latitude || 0,
      timezone: record.birth_place?.timezone || 0,
      birth_place: record.birth_place
    })) || [];

    // 计算分页信息
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        records: transformedRecords,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error: unknown) {
    console.error('获取八字记录列表错误:', error);
    const errorMessage = error instanceof Error ? error.message : '获取记录列表时发生未知错误';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// 删除八字记录
export async function DELETE(request: NextRequest) {
  try {
    // 从请求头获取认证token
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: '缺少认证信息' },
        { status: 401 }
      );
    }

    // 创建带有用户token的supabase客户端
    const token = authHeader.replace('Bearer ', '');
    const supabaseWithAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajigflmwielsacynyypu.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaWdmbG13aWVsc2FjeW55eXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTEzNDUsImV4cCI6MjA3MDU2NzM0NX0.GkqI80uEtrl5gGgUiP7tbMy3F48aagyIRyX1ZGj-3Tw',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // 验证用户
    const { data: { user }, error: authError } = await supabaseWithAuth.auth.getUser();
    
    if (authError || !user) {
      console.error('认证失败:', authError);
      return NextResponse.json(
        { error: '用户未认证' },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: '缺少记录ID' },
        { status: 400 }
      );
    }

    console.log(`删除用户 ${user.id} 的八字记录，ID: ${id}`);

    // 删除记录（只能删除自己的记录）
    const { error } = await supabaseServiceRole
      .from('bazi_records')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('删除八字记录失败:', error);
      return NextResponse.json(
        { error: '删除记录失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '记录删除成功'
    });

  } catch (error: unknown) {
    console.error('删除八字记录错误:', error);
    const errorMessage = error instanceof Error ? error.message : '删除记录时发生未知错误';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}