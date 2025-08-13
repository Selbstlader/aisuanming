import { NextRequest, NextResponse } from 'next/server';
import { calculateBazi } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('收到八字计算请求');
    
    // 检查请求体
    const text = await request.text();
    console.log('请求体内容:', text);
    
    if (!text || text.trim() === '') {
      console.error('请求体为空');
      return NextResponse.json(
        { error: '请求体为空' },
        { status: 400 }
      );
    }
    
    let body;
    try {
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON解析失败:', parseError);
      return NextResponse.json(
        { error: 'JSON格式错误' },
        { status: 400 }
      );
    }
    
    console.log('解析后的请求数据:', body);
    const { name, birthDate, birthTime, gender, birthPlace, useRealSolarTime = true } = body;

    // 验证必需字段
    if (!name || !birthDate || !birthTime || !gender || !birthPlace) {
      return NextResponse.json(
        { error: '缺少必需字段' },
        { status: 400 }
      );
    }

    // 解析日期时间
    const dateTime = new Date(`${birthDate}T${birthTime}`);
    if (isNaN(dateTime.getTime())) {
      return NextResponse.json(
        { error: '无效的日期时间格式' },
        { status: 400 }
      );
    }

    // 构造BirthInfo格式
    const birthInfo = {
      year: dateTime.getFullYear(),
      month: dateTime.getMonth() + 1,
      day: dateTime.getDate(),
      hour: dateTime.getHours(),
      minute: dateTime.getMinutes(),
      gender,
      location: {
        name: birthPlace.address || '未知地点',
        longitude: birthPlace.longitude,
        latitude: birthPlace.latitude,
        timezone: birthPlace.timezone
      }
    };

    // 计算八字
    const baziResult = calculateBazi(birthInfo, useRealSolarTime);

    // 保存到数据库（如果用户已登录）
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        
        if (user) {
          const { data: insertData, error: dbError } = await supabase
            .from('bazi_records')
            .insert({
              user_id: user.id,
              name: name,
              gender: gender,
              birth_date: birthDate,
              birth_time: birthTime,
              birth_place: birthPlace,
              year_pillar: `${baziResult.yearPillar.heavenlyStem}${baziResult.yearPillar.earthlyBranch}`,
              month_pillar: `${baziResult.monthPillar.heavenlyStem}${baziResult.monthPillar.earthlyBranch}`,
              day_pillar: `${baziResult.dayPillar.heavenlyStem}${baziResult.dayPillar.earthlyBranch}`,
              hour_pillar: `${baziResult.hourPillar.heavenlyStem}${baziResult.hourPillar.earthlyBranch}`,
              wuxing_analysis: {
                wood: baziResult.wuxingAnalysis.counts.木,
                fire: baziResult.wuxingAnalysis.counts.火,
                earth: baziResult.wuxingAnalysis.counts.土,
                metal: baziResult.wuxingAnalysis.counts.金,
                water: baziResult.wuxingAnalysis.counts.水,
                dominant: baziResult.wuxingAnalysis.dominant[0] || '',
                lacking: baziResult.wuxingAnalysis.missing,
                balance_score: baziResult.wuxingAnalysis.balanceScore
              },
              use_real_solar_time: useRealSolarTime,
              real_solar_time: baziResult.solarTime.toISOString()
            })
            .select()
            .single();

          if (!dbError && insertData) {
            baziResult.recordId = insertData.id;
          }

          if (dbError) {
            console.error('保存八字记录失败:', dbError);
          }
        }
      } catch (authError) {
        console.error('认证错误:', authError);
        // 继续处理，不影响八字计算结果返回
      }
    }

    return NextResponse.json({
      success: true,
      data: baziResult
    });

  } catch (error: unknown) {
    console.error('八字计算错误:', error);
    const errorMessage = error instanceof Error ? error.message : '计算八字时发生未知错误';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}