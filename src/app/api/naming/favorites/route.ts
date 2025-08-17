import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 创建Supabase客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface AddFavoriteRequest {
  name: string
  type: 'person' | 'company' | 'product' | 'shop'
  analysis?: object
  category?: string
  notes?: string
  namingRecordId?: string
}

interface FavoriteItem {
  id: string
  name: string
  type: string
  category: string
  analysis?: object
  notes?: string
  is_starred: boolean
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

// GET - 获取收藏列表
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
    const starred = searchParams.get('starred')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit
    
    // 构建查询
    let query = supabase
      .from('naming_favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    // 添加过滤条件
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (type && type !== 'all') {
      query = query.eq('type', type)
    }
    if (starred === 'true') {
      query = query.eq('is_starred', true)
    }
    
    // 分页
    query = query.range(offset, offset + limit - 1)
    
    const { data: favorites, error } = await query
    
    if (error) {
      throw error
    }
    
    // 获取总数
    let countQuery = supabase
      .from('naming_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    
    if (category && category !== 'all') {
      countQuery = countQuery.eq('category', category)
    }
    if (type && type !== 'all') {
      countQuery = countQuery.eq('type', type)
    }
    if (starred === 'true') {
      countQuery = countQuery.eq('is_starred', true)
    }
    
    const { count } = await countQuery
    
    return NextResponse.json({
      success: true,
      favorites: favorites || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
    
  } catch (error) {
    console.error('Error getting favorites:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// POST - 添加收藏
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId(request)
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const body: AddFavoriteRequest = await request.json()
    
    // 验证必需字段
    if (!body.name || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, type' },
        { status: 400 }
      )
    }
    
    // 检查是否已收藏
    const { data: existing } = await supabase
      .from('naming_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('name', body.name)
      .eq('type', body.type)
      .single()
    
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Name already in favorites' },
        { status: 409 }
      )
    }
    
    // 添加收藏
    const { data: favorite, error } = await supabase
      .from('naming_favorites')
      .insert({
        user_id: userId,
        naming_record_id: body.namingRecordId || null,
        name: body.name,
        type: body.type,
        category: body.category || 'default',
        analysis: body.analysis || null,
        notes: body.notes || null
      })
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      favorite
    })
    
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// DELETE - 删除收藏
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
    const favoriteId = searchParams.get('id')
    
    if (!favoriteId) {
      return NextResponse.json(
        { success: false, error: 'Missing favorite ID' },
        { status: 400 }
      )
    }
    
    // 删除收藏（确保只能删除自己的收藏）
    const { error } = await supabase
      .from('naming_favorites')
      .delete()
      .eq('id', favoriteId)
      .eq('user_id', userId)
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      message: 'Favorite deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting favorite:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// PATCH - 更新收藏
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
    const { id, category, notes, is_starred } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing favorite ID' },
        { status: 400 }
      )
    }
    
    // 构建更新数据
    const updateData: {
      category?: string;
      notes?: string;
      is_starred?: boolean;
    } = {}
    if (category !== undefined) updateData.category = category
    if (notes !== undefined) updateData.notes = notes
    if (is_starred !== undefined) updateData.is_starred = is_starred
    
    // 更新收藏
    const { data: favorite, error } = await supabase
      .from('naming_favorites')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) {
      throw error
    }
    
    return NextResponse.json({
      success: true,
      favorite
    })
    
  } catch (error) {
    console.error('Error updating favorite:', error)
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
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}