'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
// import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  Sparkles, 
  Heart,
  HeartOff,
  RefreshCw,
  Download,
  Share2,
  Star,
  StarOff,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface GeneratedName {
  id: string
  name: string
  meaning: string
  score: number
  analysis?: {
    overall_score: number
    meaning_explanation: string
    five_elements?: string
    phonetic_analysis?: string
    cultural_connotation?: string
    suggestions?: string
  }
  isFavorited: boolean
  isStarred: boolean
}

interface GenerateConfig {
  type: 'person' | 'company' | 'product' | 'shop'
  category: string
  requirements: {
    style?: string
    surname?: string
    gender?: string
    industry?: string
    length?: string
    keywords?: string
    avoidWords?: string
    includeChars?: string
  }
  preferences: {
    includeAnalysis: boolean
    nameCount: number
    culturalElements: string[]
    modernElements: string[]
  }
  saveRecord: boolean
}

function NamingGeneratePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  
  const [config, setConfig] = useState<GenerateConfig | null>(null)
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(true)
  const [selectedNames, setSelectedNames] = useState<Set<string>>(new Set())
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle')

  // 生成名称的核心函数
  const generateNames = useCallback(async (generateConfig: GenerateConfig) => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    setIsGenerating(true)
    setGenerationStatus('generating')
    
    try {
      // 转换配置格式以匹配API接口
      const lengthMap: Record<string, number | undefined> = {
        'short': 2,
        'medium': 3,
        'long': 4,
        'flexible': undefined
      }
      
      const apiRequest = {
        type: generateConfig.type,
        style: generateConfig.requirements?.style || 'modern', // 默认现代风格
        surname: generateConfig.requirements?.surname,
        gender: generateConfig.requirements?.gender,
        industry: generateConfig.requirements?.industry,
        requirements: {
          length: generateConfig.requirements?.length ? lengthMap[generateConfig.requirements.length as string] : undefined,
          meaning: generateConfig.requirements?.keywords ? [generateConfig.requirements.keywords] : [],
          avoidChars: generateConfig.requirements?.avoidWords ? generateConfig.requirements.avoidWords.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          includeChars: generateConfig.requirements?.includeChars ? generateConfig.requirements.includeChars.split(',').map((s: string) => s.trim()).filter(Boolean) : []
        },
        count: generateConfig.preferences?.nameCount || 10
      }
      
      const response = await fetch('/api/naming/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiRequest)
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      const data = await response.json()
      
      if (data.success && data.names) {
        const namesWithIds = data.names.map((name: { name: string; meaning: string; score?: number; analysis?: string }, index: number) => ({
          id: `${Date.now()}-${index}`,
          name: name.name,
          meaning: name.meaning,
          score: name.score || 85,
          analysis: name.analysis,
          isFavorited: false,
          isStarred: false
        }))
        
        // 保存生成记录到数据库
        try {
          const { error: saveError } = await supabase
            .from('naming_records')
            .insert({
              user_id: user.id,
              type: generateConfig.type,
              style: generateConfig.requirements?.style || 'modern',
              requirements: generateConfig.requirements || {},
              generated_names: data.names,
              ai_response: data,
              request_count: 1
            })
          
          if (saveError) {
            console.error('Error saving naming record:', saveError)
            // 不阻止名称显示，只是记录错误
          }
        } catch (saveError) {
          console.error('Error saving naming record:', saveError)
        }
        
        setGeneratedNames(namesWithIds)
        setGenerationStatus('completed')
        toast.success(`成功生成 ${namesWithIds.length} 个名称`)
      } else {
        throw new Error(data.error || '生成失败')
      }
    } catch (error) {
      console.error('Error generating names:', error)
      setGenerationStatus('error')
      toast.error('名称生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }, [user])

  // 处理配置解析和初始化
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/naming/generate')
      return
    }

    // 从URL参数获取配置
    const configParam = searchParams.get('config')
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam))
        setConfig(parsedConfig)
      } catch (error) {
        console.error('Error parsing config:', error)
        toast.error('配置参数错误')
        router.push('/naming/configure')
      }
    } else {
      router.push('/naming/configure')
    }
  }, [loading, user, router, searchParams])

  // 当配置设置完成且用户已登录时，自动开始生成
  useEffect(() => {
    if (config && user && !isGenerating && generationStatus === 'idle') {
      generateNames(config)
    }
  }, [config, user, isGenerating, generationStatus])

  const toggleFavorite = async (nameId: string) => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    const name = generatedNames.find(n => n.id === nameId)
    if (!name) return

    try {
      if (name.isFavorited) {
        // 取消收藏
        const { error } = await supabase
          .from('naming_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('name', name.name)
        
        if (error) throw error
        
        setGeneratedNames(prev => 
          prev.map(n => n.id === nameId ? { ...n, isFavorited: false } : n)
        )
        toast.success('已取消收藏')
      } else {
        // 添加收藏
        const { error } = await supabase
          .from('naming_favorites')
          .insert({
            user_id: user.id,
            name: name.name,
            type: config?.type || 'person',
            category: config?.category || 'default',
            analysis: {
              meaning: name.meaning,
              score: name.score,
              details: name.analysis
            }
          })
        
        if (error) throw error
        
        setGeneratedNames(prev => 
          prev.map(n => n.id === nameId ? { ...n, isFavorited: true } : n)
        )
        toast.success('已添加到收藏')
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('操作失败，请重试')
    }
  }

  const toggleStar = (nameId: string) => {
    setGeneratedNames(prev => 
      prev.map(n => n.id === nameId ? { ...n, isStarred: !n.isStarred } : n)
    )
  }

  const toggleSelection = (nameId: string) => {
    setSelectedNames(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nameId)) {
        newSet.delete(nameId)
      } else {
        newSet.add(nameId)
      }
      return newSet
    })
  }

  const copyName = (name: string) => {
    navigator.clipboard.writeText(name)
    toast.success('已复制到剪贴板')
  }

  const exportNames = () => {
    const selectedNamesData = generatedNames.filter(n => selectedNames.has(n.id))
    if (selectedNamesData.length === 0) {
      toast.error('请先选择要导出的名称')
      return
    }

    const exportData = selectedNamesData.map(name => {
      // 安全处理analysis对象，确保不会直接渲染对象
      let analysisText = '无'
      if (name.analysis) {
        if (typeof name.analysis === 'string') {
          analysisText = name.analysis
        } else if (typeof name.analysis === 'object') {
          // 将对象转换为可读的文本格式
          const parts = []
          if (name.analysis.meaning_explanation) parts.push(`寓意：${name.analysis.meaning_explanation}`)
          if (name.analysis.five_elements) parts.push(`五行：${name.analysis.five_elements}`)
          if (name.analysis.phonetic_analysis) parts.push(`音律：${name.analysis.phonetic_analysis}`)
          if (name.analysis.cultural_connotation) parts.push(`文化：${name.analysis.cultural_connotation}`)
          if (name.analysis.suggestions) parts.push(`建议：${name.analysis.suggestions}`)
          analysisText = parts.length > 0 ? parts.join(' | ') : JSON.stringify(name.analysis, null, 2)
        }
      }
      
      return {
        名称: name.name,
        含义: name.meaning,
        评分: name.score,
        分析: analysisText
      }
    })

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `取名结果_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success('导出成功')
  }

  const regenerateNames = () => {
    if (config) {
      generateNames(config)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50'
    if (score >= 80) return 'text-blue-600 bg-blue-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀'
    if (score >= 80) return '良好'
    if (score >= 70) return '一般'
    return '待改进'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ancient-paper flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-ancient-ink">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ancient-paper">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* 页面标题 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
              className="btn-ancient mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="btn-ancient mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="title-ancient text-3xl font-bold mb-2">AI名称生成</h1>
              <p className="text-ancient-ink">为您精心生成的个性化名称</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              className="btn-ancient" 
              onClick={() => setShowAnalysis(!showAnalysis)}
            >
              {showAnalysis ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showAnalysis ? '隐藏分析' : '显示分析'}
            </Button>
            
            <Button 
              className="btn-ancient" 
              onClick={exportNames}
              disabled={selectedNames.size === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              导出选中
            </Button>
            
            <Button 
              className="btn-gold"
              onClick={regenerateNames}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              重新生成
            </Button>
          </div>
        </div>

        {/* 生成状态 */}
        {generationStatus === 'generating' && (
          <Card className="card-ancient mb-8">
            <CardContent className="py-8">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-gold-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-ancient-ink">AI正在为您生成名称...</h3>
                <p className="text-ancient-ink/70">请稍候，这可能需要几秒钟时间</p>
              </div>
            </CardContent>
          </Card>
        )}

        {generationStatus === 'error' && (
          <Card className="card-ancient mb-8 border-red-200">
            <CardContent className="py-8">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-red-800">生成失败</h3>
                <p className="text-red-600 mb-4">抱歉，名称生成过程中出现了问题</p>
                <Button className="btn-gold" onClick={regenerateNames}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重试
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 生成结果 */}
        {generatedNames.length > 0 && (
          <>
            {/* 统计信息 */}
            <Card className="card-ancient mb-6">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium text-ancient-ink">共生成 {generatedNames.length} 个名称</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-red-500 mr-2" />
                      <span className="text-ancient-ink">已收藏 {generatedNames.filter(n => n.isFavorited).length} 个</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-gold-500 mr-2" />
                      <span className="text-ancient-ink">已标记 {generatedNames.filter(n => n.isStarred).length} 个</span>
                    </div>
                  </div>
                  <div className="text-sm text-ancient-ink/70">
                    已选中 {selectedNames.size} 个名称
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 名称列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedNames.map((nameData) => (
                <Card 
                  key={nameData.id} 
                  className={`card-ancient transition-all duration-200 hover:shadow-gold ${
                    selectedNames.has(nameData.id) ? 'ring-2 ring-gold-500 bg-gold-50/30' : ''
                  } ${
                    nameData.isStarred ? 'border-gold-400' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="title-ancient text-xl font-bold mb-2">
                          {nameData.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getScoreColor(nameData.score)} border-0`}>
                            {nameData.score}分 · {getScoreLabel(nameData.score)}
                          </Badge>
                          {nameData.isStarred && (
                            <Badge variant="outline" className="text-gold-600 border-gold-400 bg-gold-50">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              精选
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSelection(nameData.id)}
                          className={selectedNames.has(nameData.id) ? 'bg-gold-100' : ''}
                        >
                          <CheckCircle className={`h-4 w-4 ${
                            selectedNames.has(nameData.id) ? 'text-gold-600' : 'text-ancient-ink/60'
                          }`} />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStar(nameData.id)}
                        >
                          {nameData.isStarred ? (
                            <Star className="h-4 w-4 text-gold-500 fill-current" />
                          ) : (
                            <StarOff className="h-4 w-4 text-ancient-ink/60" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* 基本含义 */}
                    <div>
                      <p className="text-ancient-ink leading-relaxed">{nameData.meaning}</p>
                    </div>

                    {/* 详细分析 */}
                    {showAnalysis && nameData.analysis && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="font-medium text-ancient-ink">详细分析</h4>
                          
                          {/* 安全渲染analysis对象的属性，添加类型检查 */}
                          {typeof nameData.analysis === 'object' && nameData.analysis.meaning_explanation && (
                            <div>
                              <p className="text-sm font-medium text-ancient-ink mb-1">寓意解释</p>
                              <p className="text-sm text-ancient-ink/80">{String(nameData.analysis.meaning_explanation)}</p>
                            </div>
                          )}
                          
                          {typeof nameData.analysis === 'object' && nameData.analysis.five_elements && (
                            <div>
                              <p className="text-sm font-medium text-ancient-ink mb-1">五行分析</p>
                              <p className="text-sm text-ancient-ink/80">{String(nameData.analysis.five_elements)}</p>
                            </div>
                          )}
                          
                          {typeof nameData.analysis === 'object' && nameData.analysis.phonetic_analysis && (
                            <div>
                              <p className="text-sm font-medium text-ancient-ink mb-1">音律分析</p>
                              <p className="text-sm text-ancient-ink/80">{String(nameData.analysis.phonetic_analysis)}</p>
                            </div>
                          )}
                          
                          {typeof nameData.analysis === 'object' && nameData.analysis.cultural_connotation && (
                            <div>
                              <p className="text-sm font-medium text-ancient-ink mb-1">文化内涵</p>
                              <p className="text-sm text-ancient-ink/80">{String(nameData.analysis.cultural_connotation)}</p>
                            </div>
                          )}
                          
                          {typeof nameData.analysis === 'object' && nameData.analysis.suggestions && (
                            <div>
                              <p className="text-sm font-medium text-ancient-ink mb-1">建议</p>
                              <p className="text-sm text-ancient-ink/80">{String(nameData.analysis.suggestions)}</p>
                            </div>
                          )}
                          
                          {/* 如果analysis是字符串，直接显示 */}
                          {typeof nameData.analysis === 'string' && (
                            <div>
                              <p className="text-sm font-medium text-ancient-ink mb-1">分析</p>
                              <p className="text-sm text-ancient-ink/80">{nameData.analysis}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyName(nameData.name)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          复制
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(nameData.id)}
                        >
                          {nameData.isFavorited ? (
                            <>
                              <Heart className="h-4 w-4 mr-1 text-red-500 fill-current" />
                              已收藏
                            </>
                          ) : (
                            <>
                              <HeartOff className="h-4 w-4 mr-1" />
                              收藏
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 底部操作栏 */}
            {selectedNames.size > 0 && (
              <Card className="mt-8 card-ancient bg-ancient-blue/10 border-ancient-blue/30">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium text-ancient-ink">
                        已选中 {selectedNames.size} 个名称
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNames(new Set())}
                        className="text-ancient-ink/70 hover:text-ancient-ink"
                      >
                        清除选择
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={exportNames}
                        className="btn-ancient"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        导出选中
                      </Button>
                      
                      <Button className="btn-gold">
                        <Heart className="h-4 w-4 mr-2" />
                        批量收藏
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* 空状态 */}
        {generatedNames.length === 0 && generationStatus === 'idle' && (
          <Card className="card-ancient">
            <CardContent className="py-12">
              <div className="text-center">
                <Sparkles className="h-16 w-16 text-ancient-ink/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-ancient-ink">准备开始生成</h3>
                <p className="text-ancient-ink/70 mb-6">点击&quot;重新生成&quot;按钮开始AI名称生成</p>
                <Button onClick={regenerateNames} className="btn-gold">
                  <Sparkles className="h-4 w-4 mr-2" />
                  开始生成
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function NamingGeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    }>
      <NamingGeneratePageContent />
    </Suspense>
  )
}