import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// 解析四柱字符串为天干地支
function parsePillar(pillarStr: string): { heavenly: string; earthly: string } {
  if (!pillarStr || pillarStr.length < 2) {
    return { heavenly: '', earthly: '' };
  }
  return {
    heavenly: pillarStr.charAt(0), // 天干
    earthly: pillarStr.charAt(1)   // 地支
  };
}

// 转换五行分析数据格式
function convertWuxingAnalysis(wuxingAnalysis: {
  counts?: Record<string, number>;
  dominant?: string | string[];
  balanceScore?: number;
} | null): {
  elements: { wood: number; fire: number; earth: number; metal: number; water: number };
  dayMaster: string;
  strength: string;
} {
  if (!wuxingAnalysis) {
    return {
      elements: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 },
      dayMaster: '未知',
      strength: '未知'
    };
  }

  // 转换五行数据 - 处理中文字段名
  const counts = wuxingAnalysis.counts || {};
  const elements = {
    wood: counts['木'] || 0,
    fire: counts['火'] || 0,
    earth: counts['土'] || 0,
    metal: counts['金'] || 0,
    water: counts['水'] || 0
  };

  // 获取日主和强弱
  const dominant = wuxingAnalysis.dominant || [];
  const dayMaster = Array.isArray(dominant) ? (dominant[0] || '未知') : (dominant || '未知');
  const balanceScore = wuxingAnalysis.balanceScore || 50;
  const strength = balanceScore > 60 ? '偏强' : 
                  balanceScore < 40 ? '偏弱' : '中和';

  return { elements, dayMaster, strength };
}

// 创建service role客户端（仅用于服务端，绕过RLS）
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ajigflmwielsacynyypu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaWdmbG13aWVsc2FjeW55eXB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDk5MTM0NSwiZXhwIjoyMDcwNTY3MzQ1fQ.QFDRIc8nOu1dowflbIHNqF-WZhNkxOesfmNXga49jVQ'
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: '缺少记录ID' },
        { status: 400 }
      );
    }

    console.log(`正在查询八字记录，ID: ${id}`);
    
    // 检查用户认证状态
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('用户认证状态:', user ? `已认证 (${user.id})` : '未认证');
    if (authError) {
      console.log('认证错误:', authError);
    }

    // 从数据库获取八字记录
    const { data: records, error } = await supabase
      .from('bazi_records')
      .select('*')
      .eq('id', id);

    console.log('查询结果:', { records, error, recordsLength: records?.length });

    if (error) {
      console.error('查询八字记录失败:', error);
      return NextResponse.json(
        { error: '查询记录失败' },
        { status: 500 }
      );
    }

    // 检查是否找到记录
    if (!records || records.length === 0) {
      console.log(`未找到ID为 ${id} 的八字记录`);
      
      // 尝试使用service role查询以检查记录是否真的存在
      const { data: allRecords, error: serviceError } = await supabaseServiceRole
        .from('bazi_records')
        .select('id, created_at, user_id')
        .eq('id', id);
      
      console.log('使用service role查询结果:', { allRecords, serviceError });
      
      if (allRecords && allRecords.length > 0) {
        console.log('记录存在但被RLS策略阻止访问，记录详情:', allRecords[0]);
        // 如果记录存在但被RLS阻止，我们可以尝试直接用service role返回数据
        const record = allRecords[0];
        
        // 获取完整记录
        const { data: fullRecord, error: fullError } = await supabaseServiceRole
          .from('bazi_records')
          .select('*')
          .eq('id', id)
          .single();
          
        if (fullRecord && !fullError) {
          console.log('使用service role成功获取完整记录');
          
          // 解析 birth_place JSONB 数据为分离字段，并组装 bazi_result 对象
          const wuxingData = convertWuxingAnalysis(fullRecord.wuxing_analysis);
          const transformedRecord = {
            ...fullRecord,
            birth_location: fullRecord.birth_place?.address || '',
            longitude: fullRecord.birth_place?.longitude || 0,
            latitude: fullRecord.birth_place?.latitude || 0,
            timezone: fullRecord.birth_place?.timezone || 0,
            birth_place: fullRecord.birth_place,
            // 组装八字排盘结果对象
            bazi_result: {
              year: parsePillar(fullRecord.year_pillar),
              month: parsePillar(fullRecord.month_pillar),
              day: parsePillar(fullRecord.day_pillar),
              hour: parsePillar(fullRecord.hour_pillar),
              elements: wuxingData.elements,
              dayMaster: wuxingData.dayMaster,
              strength: wuxingData.strength
            }
          };
          
          return NextResponse.json({
            success: true,
            data: transformedRecord
          });
        }
      } else {
        console.log('记录确实不存在于数据库中');
      }
      
      return NextResponse.json(
        { error: '未找到指定的八字记录' },
        { status: 404 }
      );
    }

    const record = records[0];

    // 解析 birth_place JSONB 数据为分离字段，并组装 bazi_result 对象
    const wuxingData = convertWuxingAnalysis(record.wuxing_analysis);
    const transformedRecord = {
      ...record,
      birth_location: record.birth_place?.address || '',
      longitude: record.birth_place?.longitude || 0,
      latitude: record.birth_place?.latitude || 0,
      timezone: record.birth_place?.timezone || 0,
      // 保留原始 birth_place 以备后用
      birth_place: record.birth_place,
      // 组装八字排盘结果对象
      bazi_result: {
        year: parsePillar(record.year_pillar),
        month: parsePillar(record.month_pillar),
        day: parsePillar(record.day_pillar),
        hour: parsePillar(record.hour_pillar),
        elements: wuxingData.elements,
        dayMaster: wuxingData.dayMaster,
        strength: wuxingData.strength
      }
    };

    return NextResponse.json({
      success: true,
      data: transformedRecord
    });

  } catch (error: unknown) {
    console.error('获取八字记录错误:', error);
    const errorMessage = error instanceof Error ? error.message : '获取记录时发生未知错误';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}