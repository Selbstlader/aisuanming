import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

interface GenerateRequest {
  type: 'person' | 'company' | 'product' | 'shop'
  style: 'classical' | 'modern' | 'poetic' | 'simple'
  surname?: string
  gender?: 'male' | 'female' | 'neutral'
  industry?: string
  requirements: {
    length?: number
    meaning?: string[]
    avoidChars?: string[]
    includeChars?: string[]
    wuxing?: 'metal' | 'wood' | 'water' | 'fire' | 'earth'
  }
  count?: number
}

interface NameResult {
  name: string
  score: number
  meaning: string
  analysis: {
    wuxing: object
    phonetics: object
    cultural: string
  }
}

// 构建AI提示词
function buildPrompt(request: GenerateRequest): string {
  const { type, style, surname, gender, industry, requirements, count = 10 } = request
  
  let prompt = `请为我生成${count}个${type === 'person' ? '人名' : type === 'company' ? '公司名' : type === 'product' ? '产品名' : '店铺名'}，要求如下：\n\n`
  
  // 基础信息
  if (type === 'person' && surname) {
    prompt += `姓氏：${surname}\n`
  }
  if (gender) {
    prompt += `性别：${gender === 'male' ? '男性' : gender === 'female' ? '女性' : '中性'}\n`
  }
  if (industry) {
    prompt += `行业：${industry}\n`
  }
  
  // 风格要求
  const styleMap = {
    classical: '古典雅致，富含传统文化内涵',
    modern: '现代时尚，简洁大气',
    poetic: '诗意优美，富有文学色彩',
    simple: '简单易记，朗朗上口'
  }
  prompt += `风格：${styleMap[style]}\n`
  
  // 具体要求
  if (requirements.length) {
    prompt += `字数：${requirements.length}个字\n`
  }
  if (requirements.meaning && requirements.meaning.length > 0) {
    prompt += `寓意偏好：${requirements.meaning.join('、')}\n`
  }
  if (requirements.wuxing) {
    const wuxingMap = {
      metal: '金',
      wood: '木', 
      water: '水',
      fire: '火',
      earth: '土'
    }
    prompt += `五行偏好：${wuxingMap[requirements.wuxing]}\n`
  }
  if (requirements.avoidChars && requirements.avoidChars.length > 0) {
    prompt += `避讳字符：${requirements.avoidChars.join('、')}\n`
  }
  if (requirements.includeChars && requirements.includeChars.length > 0) {
    prompt += `必须包含：${requirements.includeChars.join('、')}\n`
  }
  
  prompt += `\n请返回JSON格式的结果，包含以下字段：
{
  "names": [
    {
      "name": "名称",
      "score": 85,
      "meaning": "寓意解释",
      "analysis": {
        "wuxing": {"属性": "分析"},
        "phonetics": {"音律": "分析"},
        "cultural": "文化内涵"
      }
    }
  ]
}`
  
  return prompt
}

// 调用DeepSeek API
async function callDeepSeekAPI(prompt: string): Promise<{
  choices: Array<{
    message: {
      content: string
    }
  }>
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
          content: '你是一个专业的取名大师，精通中华传统文化、五行八卦、诗词歌赋。请根据用户需求生成富有文化内涵的名称，并提供详细的寓意解释和分析。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })
  })
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

// 解析AI响应
function parseAIResponse(aiResponse: {
  choices: Array<{
    message: {
      content: string
    }
  }>
}): NameResult[] {
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
    return parsed.names || []
  } catch (error) {
    console.error('Error parsing AI response:', error)
    // 返回默认结果
    return [{
      name: '智慧',
      score: 80,
      meaning: '寓意智慧聪明，学识渊博',
      analysis: {
        wuxing: { 属性: '水木相生，利于学业' },
        phonetics: { 音律: '平仄相间，朗朗上口' },
        cultural: '取自《论语》智者乐水之意'
      }
    }]
  }
}

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body: GenerateRequest = await request.json()
    
    // 验证必需字段
    if (!body.type || !body.style) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, style' },
        { status: 400 }
      )
    }
    
    // 获取用户ID（如果已登录）
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null
    
    if (authHeader) {
      try {
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
        userId = user?.id || null
      } catch (_error) {
        console.log('User not authenticated, proceeding as guest')
      }
    }
    
    // 构建AI提示词
    const prompt = buildPrompt(body)
    
    // 调用DeepSeek API
    const aiResponse = await callDeepSeekAPI(prompt)
    
    // 解析AI响应
    const names = parseAIResponse(aiResponse)
    
    // 保存到数据库（如果用户已登录）
    let recordId: string | null = null
    if (userId) {
      try {
        const { data: record, error } = await supabase
          .from('naming_records')
          .insert({
            user_id: userId,
            type: body.type,
            style: body.style,
            requirements: body.requirements,
            generated_names: names,
            ai_response: aiResponse
          })
          .select('id')
          .single()
        
        if (error) {
          console.error('Error saving naming record:', error)
        } else {
          recordId = record.id
        }
      } catch (error) {
        console.error('Error saving to database:', error)
      }
    }
    
    // 返回结果
    return NextResponse.json({
      success: true,
      names,
      requestId: recordId
    })
    
  } catch (error) {
    console.error('Error in naming generate API:', error)
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