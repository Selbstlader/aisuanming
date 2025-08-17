import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface HistoryRecord {
  id: string
  user_id: string
  type: string
  category: string
  request_data: object
  generated_names: string[]
  analysis_results?: object
  is_favorited: boolean
  created_at: string
  updated_at: string
}

// 获取用户ID
async function getUserId(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) {
    return null
  }
  
  try {
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return user.id
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

// GET - 获取历史记录
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type')
    const favorited = searchParams.get('favorited')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const offset = (page - 1) * limit
    
    // 构建查询
    let query = supabase
      .from('naming_records')
      .select(`
        *,
        favorites:naming_favorites!naming_record_id(
          id,
          name,
          is_starred
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    // 添加过滤条件
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    if (favorited === 'true') {
      query = query.eq('is_favorited', true)
    }
    
    // 日期范围过滤
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    
    // 分页
    query = query.range(offset, offset + limit - 1)
    
    const { data: records, error } = await query
    
    if (error) {
      throw error
    }
    
    // 如果有搜索关键词，在客户端进行过滤
    let filteredRecords = records || []
    if (search) {
      const searchLower = search.toLowerCase()
      filteredRecords = filteredRecords.filter(record => {
        // 搜索生成的名称
        const namesMatch = record.generated_names?.some((name: string) => 
          name.toLowerCase().includes(searchLower)
        )
        
        // 搜索请求数据中的关键词
        const requestDataStr = JSON.stringify(record.request_data || {}).toLowerCase()
        const requestMatch = requestDataStr.includes(searchLower)
        
        return namesMatch || requestMatch
      })
    }
    
    // 获取总数
    let countQuery = supabase
      .from('naming_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (category && category !== 'all') {
      countQuery = countQuery.eq('category', category)
    }
    if (type && type !== 'all') {
      countQuery = countQuery.eq('type', type)
    }
    if (favorited === 'true') {
      countQuery = countQuery.eq('is_favorited', true)
    }
    if (startDate) {
      countQuery = countQuery.gte('created_at', startDate)
    }
    if (endDate) {
      countQuery = countQuery.lte('created_at', endDate)
    }
    
    const { count } = await countQuery
    
    return NextResponse.json({
      success: true,
      records: filteredRecords,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error('Error getting history:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE - 删除历史记录
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('id')
    const deleteAll = searchParams.get('all') === 'true'
    
    if (deleteAll) {
      // 删除所有历史记录
      const { error } = await supabase
        .from('naming_records')
        .delete()
        .eq('user_id', userId)
      
      if (error) {
        throw error
      }
      
      return NextResponse.json({
        success: true,
        message: 'All history records deleted successfully'
      })
    } else if (recordId) {
      // 删除单个记录
      const { error } = await supabase
        .from('naming_records')
        .delete()
        .eq('id', recordId)
        .eq('user_id', userId)
      
      if (error) {
        throw error
      }
      
      return NextResponse.json({
        success: true,
        message: 'History record deleted successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Missing record ID or delete all flag' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error deleting history:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// PATCH - 更新历史记录（主要用于标记收藏状态）
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { id, is_favorited } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing record ID' },
        { status: 400 }
      )
    }
    
    // 更新记录
    const { data: record, error } = await supabase
      .from('naming_records')
      .update({ is_favorited })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      record
    })
    
  } catch (error) {
    console.error('Error updating history record:', error)
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
      'Access-Control-Allow-Methods': 'GET, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}