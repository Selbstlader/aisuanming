'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Sparkles, 
  User, 
  Building2, 
  Package, 
  Store, 
  Heart, 
  History, 
  Search,
  Filter,
  Star,
  Clock,
  UserPlus
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/hooks/useAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface NamingCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
}

interface RecentRecord {
  id: string
  type: string
  category: string
  generated_names: string[]
  created_at: string
}

interface FavoriteItem {
  id: string
  name: string
  type: string
  category: string
  is_starred: boolean
  created_at: string
}

const namingTypes = [
  {
    id: 'person',
    name: '人名取名',
    description: '为新生儿、改名等提供个性化人名建议',
    icon: User,
    color: 'bg-blue-500',
    examples: ['张雅琪', '李浩然', '王诗涵']
  },
  {
    id: 'company',
    name: '公司取名',
    description: '为企业、品牌提供专业的商业命名',
    icon: Building2,
    color: 'bg-green-500',
    examples: ['创新科技', '智慧未来', '星辰集团']
  },
  {
    id: 'product',
    name: '产品取名',
    description: '为产品、服务提供吸引力命名方案',
    icon: Package,
    color: 'bg-purple-500',
    examples: ['智能助手', '云端办公', '极速配送']
  },
  {
    id: 'shop',
    name: '店铺取名',
    description: '为店铺、工作室提供个性化名称',
    icon: Store,
    color: 'bg-orange-500',
    examples: ['温馨小屋', '时光咖啡', '艺术工坊']
  }
]

export default function NamingHomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [, setCategories] = useState<NamingCategory[]>([])
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      const loadData = async () => {
        try {
          setIsLoading(true)
          
          // 加载分类
          const { data: categoriesData } = await supabase
            .from('naming_categories')
            .select('*')
            .eq('is_active', true)
            .order('sort_order')
          
          if (categoriesData) {
            setCategories(categoriesData)
          }
          
          if (user) {
            // 加载最近记录
            const { data: recordsData } = await supabase
              .from('naming_records')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(6)
            
            if (recordsData) {
              setRecentRecords(recordsData)
            }
            
            // 加载收藏
            const { data: favoritesData } = await supabase
              .from('naming_favorites')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(6)
            
            if (favoritesData) {
              setFavorites(favoritesData)
            }
          }
        } catch (error) {
          console.error('Error loading data:', error)
        } finally {
          setIsLoading(false)
        }
      }
      
      loadData()
    }
  }, [loading, user])

  const handleStartNaming = (type: string) => {
    if (!user) {
      router.push('/auth/login?redirect=/naming/configure')
      return
    }
    router.push(`/naming/configure?type=${type}`)
  }

  // const filteredTypes = namingTypes.filter(type => 
  //   selectedType === 'all' || type.id === selectedType
  // )

  const filteredRecords = recentRecords.filter(record =>
    searchQuery === '' || 
    record.generated_names.some(name => 
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const filteredFavorites = favorites.filter(favorite =>
    searchQuery === '' || 
    favorite.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-ancient flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-ancient-ink">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-ancient">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-12 w-12 text-gold mr-3" />
            <h1 className="title-ancient text-4xl">
              AI智能取名
            </h1>
          </div>
          <p className="text-xl text-ancient-ink/80 max-w-2xl mx-auto">
            运用人工智能技术，结合传统文化与现代审美，为您提供个性化的命名解决方案
          </p>
        </div>

        {/* 取名类型选择 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-ancient-ink mb-6 text-center">选择取名类型</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {namingTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <Card 
                  key={type.id} 
                  className="card-ancient cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
                  onClick={() => handleStartNaming(type.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-ancient-ink">{type.name}</CardTitle>
                    <CardDescription className="text-sm text-ancient-ink/70">
                      {type.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-xs text-ancient-ink/70 font-medium">示例名称：</p>
                      <div className="flex flex-wrap gap-1">
                        {type.examples.map((example, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-ancient-blue/10 text-ancient-ink border-ancient-blue/20">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="btn-gold w-full mt-4" size="sm">
                      开始取名
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* 用户数据展示 */}
        {user && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-ancient-ink">我的取名记录</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gold" />
                  <Input
                    placeholder="搜索名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 border-ancient-blue/30 focus:border-gold"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32 border-ancient-blue/30 focus:border-gold">
                    <Filter className="h-4 w-4 mr-2 text-gold" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    {namingTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-ancient-blue/10">
                <TabsTrigger value="recent" className="flex items-center space-x-2 data-[state=active]:bg-gradient-gold data-[state=active]:text-white">
                  <Clock className="h-4 w-4" />
                  <span>最近生成</span>
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center space-x-2 data-[state=active]:bg-gradient-gold data-[state=active]:text-white">
                  <Heart className="h-4 w-4" />
                  <span>我的收藏</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent" className="mt-6">
                {filteredRecords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecords.map((record) => (
                      <Card key={record.id} className="card-ancient hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-gold text-gold">
                              {namingTypes.find(t => t.id === record.type)?.name || record.type}
                            </Badge>
                            <span className="text-xs text-ancient-ink/60">
                              {new Date(record.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {record.generated_names.slice(0, 3).map((name: string | { name: string }, index) => {
                              // 确保name是字符串，如果是对象则提取name字段
                              const displayName = typeof name === 'string' ? name : (name?.name || '未知名称');
                              return (
                                <div key={index} className="flex items-center justify-between p-2 bg-ancient-blue/5 rounded border border-ancient-blue/10">
                                  <span className="font-medium text-ancient-ink">{displayName}</span>
                                  <Button size="sm" variant="ghost" className="text-gold hover:bg-gold/10">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                </div>
                              );
                            })}
                            {record.generated_names.length > 3 && (
                              <p className="text-xs text-ancient-ink/60 text-center">
                                还有 {record.generated_names.length - 3} 个名称...
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <History className="h-12 w-12 text-ancient-ink/40 mx-auto mb-4" />
                    <p className="text-ancient-ink/60">暂无生成记录</p>
                    <Button 
                      className="btn-gold mt-4" 
                      onClick={() => router.push('/naming/configure')}
                    >
                      开始第一次取名
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-6">
                {filteredFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFavorites.map((favorite) => (
                      <Card key={favorite.id} className="card-ancient hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="border-gold text-gold">
                              {namingTypes.find(t => t.id === favorite.type)?.name || favorite.type}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              {favorite.is_starred && (
                                <Star className="h-4 w-4 text-gold fill-current" />
                              )}
                              <span className="text-xs text-ancient-ink/60">
                                {new Date(favorite.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center">
                            <h3 className="text-lg font-bold text-ancient-ink mb-2">
                              {favorite.name}
                            </h3>
                            <Badge variant="secondary" className="bg-ancient-blue/10 text-ancient-ink">{favorite.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-ancient-ink/40 mx-auto mb-4" />
                    <p className="text-ancient-ink/60">暂无收藏记录</p>
                    <Button 
                      className="btn-gold mt-4" 
                      onClick={() => router.push('/naming/configure')}
                    >
                      开始取名并收藏
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* 快捷操作 */}
            <div className="mt-8 flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/naming/history')}
                className="flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span>查看全部历史</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/naming/favorites')}
                className="flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span>管理收藏</span>
              </Button>
            </div>
          </div>
        )}

        {/* 未登录用户提示 */}
        {!user && (
          <Card className="card-ancient">
            <CardContent className="text-center py-12">
              <UserPlus className="h-16 w-16 text-gold mx-auto mb-6" />
              <h3 className="text-xl font-bold text-ancient-ink mb-4">登录后体验更多功能</h3>
              <p className="text-ancient-ink/70 mb-6 max-w-md mx-auto">
                登录后可以保存生成记录、收藏喜欢的名称，并享受个性化推荐服务
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="btn-gold" onClick={() => router.push('/auth/login')}>
                  立即登录
                </Button>
                <Button className="btn-ancient" onClick={() => router.push('/auth/register')}>
                  注册账号
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}