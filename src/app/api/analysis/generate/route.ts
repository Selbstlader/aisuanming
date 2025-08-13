import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { baziData, analysisType } = await request.json();

    if (!baziData) {
      return NextResponse.json(
        { error: '缺少八字数据' },
        { status: 400 }
      );
    }

    // 构建AI分析提示词
    const prompt = buildAnalysisPrompt(baziData, analysisType);

    let analysisResult;
    let warning = null;

    // 如果配置了DeepSeek API，使用AI分析
    if (DEEPSEEK_API_KEY) {
      try {
        const aiResult = await generateAIAnalysis(prompt);
        analysisResult = convertAIResultToFrontendFormat(aiResult);
      } catch (aiError) {
        console.error('AI分析失败，使用模拟数据:', aiError);
        analysisResult = generateMockAnalysis();
        warning = 'AI分析服务暂时不可用，使用了模拟数据';
      }
    } else {
      // 使用模拟数据
      analysisResult = generateMockAnalysis();
      warning = 'AI分析服务未配置，使用了模拟数据';
    }

    // 确保analysisResult不为空
    if (!analysisResult) {
      analysisResult = generateMockAnalysis();
      warning = warning || '分析结果生成失败，使用了模拟数据';
    }

    // 如果有八字记录ID，保存分析结果到数据库
    if (baziData.id) {
      const { error: saveError } = await supabase
        .from('analysis_results')
        .insert({
          bazi_record_id: baziData.id,
          analysis_type: analysisType,
          analysis_content: analysisResult,
          user_id: baziData.user_id
        });

      if (saveError) {
        console.error('保存分析结果失败:', saveError);
      }
    }

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      warning
    });

  } catch (error: unknown) {
    console.error('生成分析失败:', error);
    const errorMessage = error instanceof Error ? error.message : '生成分析时发生未知错误';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// 构建AI分析提示词
function buildAnalysisPrompt(baziData: {
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  year_pillar: string;
  month_pillar: string;
  day_pillar: string;
  hour_pillar: string;
  wuxing_analysis?: {
    dominant?: string | string[];
    lacking?: string[];
    balance_score?: number;
  };
}, analysisType: string): string {
  // 安全获取五行分析数据，提供默认值
  const wuxingAnalysis = baziData.wuxing_analysis || {};
  const dominant = wuxingAnalysis.dominant || '未知';
  const lacking = Array.isArray(wuxingAnalysis.lacking) ? wuxingAnalysis.lacking : [];
  const lackingText = lacking.length > 0 ? lacking.join('、') : '无明显缺失';
  const balanceScore = wuxingAnalysis.balance_score || 0;
  
  const basePrompt = `
请根据以下八字信息进行命理分析：

姓名：${baziData.name}
性别：${baziData.gender}
出生日期：${baziData.birth_date}
出生时间：${baziData.birth_time}

八字信息：
年柱：${baziData.year_pillar}
月柱：${baziData.month_pillar}
日柱：${baziData.day_pillar}
时柱：${baziData.hour_pillar}

五行分析：
主要五行：${dominant}
缺失五行：${lackingText}
五行平衡分数：${balanceScore}

请提供${analysisType === 'basic' ? '基础' : analysisType === 'detailed' ? '详细' : '高级'}分析，包括：
1. 性格特点分析
2. 事业运势预测
3. 财运分析
4. 感情婚姻运势
5. 健康状况分析
6. 人生建议

请以简洁的文本格式返回，每个部分用换行分隔。
`;

  return basePrompt;
}

// 调用DeepSeek API进行AI分析
async function generateAIAnalysis(prompt: string) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位专业的命理分析师，精通八字命理学。请根据提供的八字信息进行准确、详细的分析。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API请求失败: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('DeepSeek API返回内容为空');
    }

    // 尝试解析JSON响应，如果失败则直接返回文本内容
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (parseError) {
      console.error('AI响应不是JSON格式，将作为文本处理:', parseError);
      console.log('原始AI响应内容:', content);
      // 如果不是JSON格式，直接返回文本内容
      return content;
    }
  } catch (error) {
    console.error('AI分析过程中发生错误:', error);
    // 抛出错误，让上层的try-catch处理
    throw error;
  }
}

// 转换AI结果为前端格式
interface AIAnalysisResult {
  personality?: {
    traits?: string | string[];
  };
  career?: {
    development?: string;
  };
  wealth?: {
    overall?: string;
  };
  relationships?: {
    marriage?: string;
  };
  health?: {
    overall?: string;
  };
  suggestions?: string[];
}

function convertAIResultToFrontendFormat(aiResult: string | AIAnalysisResult) {
  try {
    // 如果AI返回的是结构化数据，直接转换
    if (typeof aiResult === 'object' && aiResult && aiResult.personality) {
      const result = aiResult as AIAnalysisResult;
      return {
        personality: Array.isArray(result.personality?.traits) ? result.personality.traits.join('，') : result.personality?.traits || '性格分析暂无',
        career: result.career?.development || '事业分析暂无',
        wealth: result.wealth?.overall || '财运分析暂无',
        relationship: result.relationships?.marriage || '感情分析暂无',
        health: result.health?.overall || '健康分析暂无',
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : ['暂无建议']
      };
    }
    
    // 如果AI返回的是文本，尝试解析结构化内容
    if (typeof aiResult === 'string' && aiResult.trim()) {
      const text = aiResult.trim();
      
      // 使用正则表达式匹配编号标题格式："数字. 标题"
      const sections = {
        personality: '',
        career: '',
        wealth: '',
        relationship: '',
        health: '',
        suggestions: [] as string[]
      };
      
      // 分割文本为段落
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
      
      for (const paragraph of paragraphs) {
        const lines = paragraph.split('\n').filter(line => line.trim());
        if (lines.length === 0) continue;
        
        const firstLine = lines[0].trim();
        
        // 匹配性格特点
        if (/^1\.?\s*性格特点/.test(firstLine)) {
          sections.personality = lines.slice(1).join('\n').trim() || lines.join('\n').trim();
        }
        // 匹配事业运势
        else if (/^2\.?\s*事业运势/.test(firstLine)) {
          sections.career = lines.slice(1).join('\n').trim() || lines.join('\n').trim();
        }
        // 匹配财运分析
        else if (/^3\.?\s*财运/.test(firstLine)) {
          sections.wealth = lines.slice(1).join('\n').trim() || lines.join('\n').trim();
        }
        // 匹配感情婚姻
        else if (/^4\.?\s*(感情|婚姻)/.test(firstLine)) {
          sections.relationship = lines.slice(1).join('\n').trim() || lines.join('\n').trim();
        }
        // 匹配健康状况
        else if (/^5\.?\s*健康/.test(firstLine)) {
          sections.health = lines.slice(1).join('\n').trim() || lines.join('\n').trim();
        }
        // 匹配人生建议
        else if (/^6\.?\s*(人生建议|建议)/.test(firstLine)) {
          const suggestionText = lines.slice(1).join('\n').trim() || lines.join('\n').trim();
          // 解析建议列表
          const suggestionLines = suggestionText.split('\n').filter(line => line.trim());
          sections.suggestions = suggestionLines.map(line => {
            // 移除开头的 "- " 或其他标记
            return line.replace(/^[-•*]\s*/, '').trim();
          }).filter(suggestion => suggestion.length > 0);
        }
      }
      
      // 如果某些字段为空，尝试从整个文本中提取
      if (!sections.personality && text.includes('性格')) {
        const match = text.match(/性格[^\n]*[\n]([^\d]*?)(?=\d\.|$)/);
        if (match) sections.personality = match[1].trim();
      }
      
      if (!sections.wealth && text.includes('财运')) {
        const match = text.match(/财运[^\n]*[\n]([^\d]*?)(?=\d\.|$)/);
        if (match) sections.wealth = match[1].trim();
      }
      
      if (!sections.health && text.includes('健康')) {
        const match = text.match(/健康[^\n]*[\n]([^\d]*?)(?=\d\.|$)/);
        if (match) sections.health = match[1].trim();
      }
      
      return {
        personality: sections.personality || '性格分析暂无',
        career: sections.career || '事业分析暂无',
        wealth: sections.wealth || '财运分析暂无',
        relationship: sections.relationship || '感情分析暂无',
        health: sections.health || '健康分析暂无',
        suggestions: sections.suggestions.length > 0 ? sections.suggestions : ['暂无建议']
      };
    }
    
    // 如果输入无效，返回默认值
    console.warn('AI结果格式无效，使用默认值:', aiResult);
    return generateMockAnalysis();
  } catch (error) {
    console.error('转换AI结果时发生错误:', error);
    return generateMockAnalysis();
  }
}

// 生成模拟分析数据
function generateMockAnalysis() {
  const mockAnalysis = {
    personality: '您性格聪明机智，善于沟通，富有创造力。具有很强的学习能力和适应性，人际关系处理得当。但有时可能过于理想化，需要培养更多的耐心。',
    career: '事业发展较为顺利，适合从事教育、媒体、创意等行业。中年后会有重大突破，建议在人际交往中发挥优势，注重团队合作。',
    wealth: '财运中等偏上，25-35岁期间财运逐渐上升，35-45岁达到高峰。适合稳健投资，避免高风险项目，理财方面要有长远规划。',
    relationship: '婚姻运势良好，适合晚婚。与属相为龙、猴的人最为相配。在感情中要学会包容和理解，用心经营感情关系。',
    health: '整体健康状况良好，但需要注意肠胃健康，避免过度劳累。建议保持规律作息，适当运动，注意饮食均衡。',
    suggestions: [
      '发挥自身的沟通优势，在人际关系中获得成功',
      '保持学习的心态，不断提升自己的能力',
      '在事业发展中要有耐心，厚积薄发',
      '注重身体健康，保持良好的生活习惯'
    ]
  };

  return mockAnalysis;
}