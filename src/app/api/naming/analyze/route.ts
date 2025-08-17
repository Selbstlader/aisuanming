import { NextRequest, NextResponse } from 'next/server'

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

interface AnalyzeRequest {
  name: string
  type: 'person' | 'company' | 'product' | 'shop'
  context?: {
    surname?: string
    industry?: string
    gender?: string
  }
}

interface AnalysisResult {
  score: number
  meaning: string
  wuxing: {
    elements: string[]
    balance: string
    suggestion: string
  }
  phonetics: {
    rhythm: string
    harmony: number
    pronunciation: string
  }
  cultural: string
  suggestions: string[]
}

// 构建分析提示词
function buildAnalysisPrompt(request: AnalyzeRequest): string {
  const { name, type, context } = request
  
  let prompt = `请详细分析以下${type === 'person' ? '人名' : type === 'company' ? '公司名' : type === 'product' ? '产品名' : '店铺名'}："${name}"\n\n`
  
  // 添加上下文信息
  if (context?.surname) {
    prompt += `姓氏：${context.surname}\n`
  }
  if (context?.industry) {
    prompt += `行业：${context.industry}\n`
  }
  if (context?.gender) {
    prompt += `性别：${context.gender}\n`
  }
  
  prompt += `\n请从以下维度进行专业分析：

1. 综合评分（1-100分）
2. 寓意解释（详细说明名称的含义和象征）
3. 五行分析（包含五行属性、平衡度、建议）
4. 音律分析（包含节奏感、和谐度、发音特点）
5. 文化内涵（历史典故、文学出处、文化背景）
6. 改进建议（如何优化这个名称）

请返回JSON格式的结果：
{
  "score": 85,
  "meaning": "详细的寓意解释",
  "wuxing": {
    "elements": ["金", "木"],
    "balance": "五行平衡分析",
    "suggestion": "五行建议"
  },
  "phonetics": {
    "rhythm": "音律节奏分析",
    "harmony": 8,
    "pronunciation": "发音特点"
  },
  "cultural": "文化背景和典故",
  "suggestions": ["改进建议1", "改进建议2"]
}`
  
  return prompt
}

// 调用DeepSeek API进行分析
async function callAnalysisAPI(prompt: string): Promise<{
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DeepSeek API key not configured')
  }
  
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
          content: '你是一个专业的姓名学大师，精通中华传统文化、五行八卦、音韵学、文字学。请对用户提供的名称进行全面深入的分析，提供专业的评价和建议。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })
  })
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

// 解析分析结果
function parseAnalysisResponse(aiResponse: {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}): AnalysisResult {
  try {
    const content = aiResponse.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content in AI response')
    }
    
    // 尝试提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    return parsed
  } catch (error) {
    console.error('Error parsing analysis response:', error)
    // 返回默认分析结果
    return {
      score: 75,
      meaning: '名称具有积极的寓意，整体表现良好',
      wuxing: {
        elements: ['木', '水'],
        balance: '五行搭配较为均衡',
        suggestion: '可考虑加强土元素以增强稳定性'
      },
      phonetics: {
        rhythm: '音律和谐，朗朗上口',
        harmony: 8,
        pronunciation: '发音清晰，易于记忆'
      },
      cultural: '名称体现了中华文化的深厚底蕴',
      suggestions: [
        '整体表现良好，建议保持',
        '可考虑在特定场合使用简称'
      ]
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body: AnalyzeRequest = await request.json()
    
    // 验证必需字段
    if (!body.name || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, type' },
        { status: 400 }
      )
    }
    
    // 验证名称长度
    if (body.name.length > 20) {
      return NextResponse.json(
        { success: false, error: 'Name too long (max 20 characters)' },
        { status: 400 }
      )
    }
    
    // 构建分析提示词
    const prompt = buildAnalysisPrompt(body)
    
    // 调用AI分析
    const aiResponse = await callAnalysisAPI(prompt)
    
    // 解析分析结果
    const analysis = parseAnalysisResponse(aiResponse)
    
    // 返回结果
    return NextResponse.json({
      success: true,
      analysis
    })
    
  } catch (error) {
    console.error('Error in naming analyze API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// 支持OPTIONS请求（CORS）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}