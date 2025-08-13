import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface JWTPayload {
  sub: string;
  email?: string;
  aud: string;
  role: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recordId } = await params;
    
    // 验证用户认证
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '未提供认证令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let userId: string;

    try {
      const decoded = jwt.decode(token) as JWTPayload;
      if (!decoded || !decoded.sub) {
        throw new Error('无效的令牌');
      }
      userId = decoded.sub;
    } catch (error) {
      return NextResponse.json(
        { success: false, error: '无效的认证令牌' },
        { status: 401 }
      );
    }

    // 首先验证记录是否属于当前用户
    const { data: record, error: recordError } = await supabase
      .from('bazi_records')
      .select('id, user_id')
      .eq('id', recordId)
      .eq('user_id', userId)
      .single();

    if (recordError || !record) {
      return NextResponse.json(
        { success: false, error: '记录不存在或无权访问' },
        { status: 404 }
      );
    }

    // 获取分析结果
    const { data: analysis, error: analysisError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('bazi_record_id', recordId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (analysisError) {
      if (analysisError.code === 'PGRST116') {
        // 没有找到分析结果
        return NextResponse.json(
          { success: false, error: '暂无分析结果' },
          { status: 404 }
        );
      }
      
      console.error('获取分析结果失败:', analysisError);
      return NextResponse.json(
        { success: false, error: '获取分析结果失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('获取分析结果失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}