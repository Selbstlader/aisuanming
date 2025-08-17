'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'

import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Sparkles, 
  User, 
  Building2, 
  Package, 
  Store,
  Settings,
  Lightbulb,
  Target,
  Palette
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ConfigFormData {
  type: 'person' | 'company' | 'product' | 'shop'
  requirements: {
    // 通用字段
    keywords?: string
    style?: string
    length?: string
    tone?: string
    avoidWords?: string
    
    // 人名专用字段
    surname?: string
    gender?: 'male' | 'female' | 'neutral'
    birthDate?: string
    birthTime?: string
    
    // 公司名专用字段
    industry?: string
    businessScope?: string
    targetMarket?: string
    
    // 产品名专用字段
    productType?: string
    targetAudience?: string
    features?: string
    
    // 店铺名专用字段
    shopType?: string
    location?: string
    atmosphere?: string
  }
  preferences: {
    includeAnalysis: boolean
    nameCount: number
    culturalElements: string[]
    modernElements: string[]
  }
}

const namingTypes = {
  person: { name: '人名取名', icon: User, color: 'bg-blue-500' },
  company: { name: '公司取名', icon: Building2, color: 'bg-green-500' },
  product: { name: '产品取名', icon: Package, color: 'bg-purple-500' },
  shop: { name: '店铺取名', icon: Store, color: 'bg-orange-500' }
}

const styleOptions = [
  { value: 'traditional', label: '传统古典', description: '富含文化底蕴，典雅庄重' },
  { value: 'modern', label: '现代时尚', description: '简洁明快，符合当代审美' },
  { value: 'creative', label: '创意新颖', description: '独特个性，富有创造力' },
  { value: 'elegant', label: '优雅精致', description: '高雅脱俗，品味非凡' },
  { value: 'powerful', label: '大气磅礴', description: '气势恢宏，寓意深远' }
]

const toneOptions = [
  { value: 'positive', label: '积极向上' },
  { value: 'professional', label: '专业严谨' },
  { value: 'friendly', label: '亲和友善' },
  { value: 'innovative', label: '创新进取' },
  { value: 'stable', label: '稳重可靠' }
]

const culturalElements = [
  { value: 'poetry', label: '诗词典故' },
  { value: 'philosophy', label: '哲学思想' },
  { value: 'nature', label: '自然元素' },
  { value: 'virtue', label: '品德修养' },
  { value: 'prosperity', label: '吉祥寓意' }
]

const modernElements = [
  { value: 'technology', label: '科技感' },
  { value: 'international', label: '国际化' },
  { value: 'simplicity', label: '简约风' },
  { value: 'trendy', label: '时尚潮流' },
  { value: 'innovation', label: '创新理念' }
]

function NamingConfigurePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<ConfigFormData>({
    type: (searchParams.get('type') as 'person' | 'company' | 'product' | 'shop') || 'person',
    requirements: {},
    preferences: {
      includeAnalysis: true,
      nameCount: 10,
      culturalElements: [],
      modernElements: []
    }
  })



  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/naming/configure')
      return
    }
  }, [loading, user, router])

  const handleSubmit = async () => {
    if (!user) {
      toast.error('请先登录')
      return
    }

    // 验证必填字段
    if (formData.type === 'person' && !formData.requirements.surname) {
      toast.error('请输入姓氏')
      return
    }

    setIsLoading(true)
    
    try {
      // 构建生成参数
      const generateParams = {
        type: formData.type,
        requirements: formData.requirements,
        preferences: formData.preferences,
        saveRecord: true
      }
      
      // 跳转到生成页面，传递配置参数
      const params = new URLSearchParams({
        config: JSON.stringify(generateParams)
      })
      
      router.push(`/naming/generate?${params.toString()}`)
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('配置保存失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const updateRequirements = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [key]: value
      }
    }))
  }

  const updatePreferences = (key: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }))
  }

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item))
    } else {
      setter([...array, item])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-ancient flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-ancient-ink">加载中...</p>
        </div>
      </div>
    )
  }

  const TypeIcon = namingTypes[formData.type].icon

  return (
    <div className="min-h-screen bg-gradient-ancient">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 页面标题 */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mr-4 btn-ancient"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center mr-3 shadow-lg">
              <TypeIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="title-ancient text-2xl">
                {namingTypes[formData.type].name}配置
              </h1>
              <p className="text-ancient-ink/70">请填写详细信息，AI将为您生成个性化名称</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要配置区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <Card className="card-ancient">
              <CardHeader>
                <CardTitle className="flex items-center text-ancient-ink">
                  <Settings className="h-5 w-5 mr-2 text-gold" />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 取名类型 */}
                <div>
                  <Label>取名类型</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value: 'person' | 'company' | 'product' | 'shop') => setFormData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(namingTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 关键词 */}
                <div>
                  <Label>关键词或期望含义</Label>
                  <Input
                    className="input-ancient"
                    placeholder="如：智慧、成功、创新等"
                    value={formData.requirements.keywords || ''}
                    onChange={(e) => updateRequirements('keywords', e.target.value)}
                  />
                </div>

                {/* 避免用词 */}
                <div>
                  <Label>避免使用的字词</Label>
                  <Input
                    className="input-ancient"
                    placeholder="请输入不希望出现的字词，用逗号分隔"
                    value={formData.requirements.avoidWords || ''}
                    onChange={(e) => updateRequirements('avoidWords', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 类型特定字段 */}
            {formData.type === 'person' && (
              <Card className="card-ancient">
                <CardHeader>
                  <CardTitle className="flex items-center text-ancient-ink">
                    <User className="h-5 w-5 mr-2 text-gold" />
                    人名信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>姓氏 *</Label>
                      <Input
                        className="input-ancient"
                        placeholder="请输入姓氏"
                        value={formData.requirements.surname || ''}
                        onChange={(e) => updateRequirements('surname', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>性别</Label>
                      <Select 
                        value={formData.requirements.gender || 'neutral'} 
                        onValueChange={(value) => updateRequirements('gender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">男性</SelectItem>
                          <SelectItem value="female">女性</SelectItem>
                          <SelectItem value="neutral">中性</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>出生日期（可选）</Label>
                      <Input
                        className="input-ancient"
                        type="date"
                        value={formData.requirements.birthDate || ''}
                        onChange={(e) => updateRequirements('birthDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>出生时间（可选）</Label>
                      <Input
                        className="input-ancient"
                        type="time"
                        value={formData.requirements.birthTime || ''}
                        onChange={(e) => updateRequirements('birthTime', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.type === 'company' && (
              <Card className="card-ancient">
                <CardHeader>
                  <CardTitle className="flex items-center text-ancient-ink">
                    <Building2 className="h-5 w-5 mr-2 text-gold" />
                    公司信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>行业领域</Label>
                    <Input
                      className="input-ancient"
                      placeholder="如：科技、教育、金融等"
                      value={formData.requirements.industry || ''}
                      onChange={(e) => updateRequirements('industry', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>业务范围</Label>
                    <Textarea
                      className="input-ancient"
                      placeholder="请描述公司的主要业务和服务"
                      value={formData.requirements.businessScope || ''}
                      onChange={(e) => updateRequirements('businessScope', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>目标市场</Label>
                    <Input
                      className="input-ancient"
                      placeholder="如：国内、国际、特定地区等"
                      value={formData.requirements.targetMarket || ''}
                      onChange={(e) => updateRequirements('targetMarket', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.type === 'product' && (
              <Card className="card-ancient">
                <CardHeader>
                  <CardTitle className="flex items-center text-ancient-ink">
                    <Package className="h-5 w-5 mr-2 text-gold" />
                    产品信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>产品类型</Label>
                    <Input
                      className="input-ancient"
                      placeholder="如：软件、硬件、服务等"
                      value={formData.requirements.productType || ''}
                      onChange={(e) => updateRequirements('productType', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>目标用户</Label>
                    <Input
                      className="input-ancient"
                      placeholder="如：年轻人、企业用户、专业人士等"
                      value={formData.requirements.targetAudience || ''}
                      onChange={(e) => updateRequirements('targetAudience', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>产品特色</Label>
                    <Textarea
                      className="input-ancient"
                      placeholder="请描述产品的主要特点和优势"
                      value={formData.requirements.features || ''}
                      onChange={(e) => updateRequirements('features', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {formData.type === 'shop' && (
              <Card className="card-ancient">
                <CardHeader>
                  <CardTitle className="flex items-center text-ancient-ink">
                    <Store className="h-5 w-5 mr-2 text-gold" />
                    店铺信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>店铺类型</Label>
                    <Input
                      className="input-ancient"
                      placeholder="如：餐厅、服装店、咖啡厅等"
                      value={formData.requirements.shopType || ''}
                      onChange={(e) => updateRequirements('shopType', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>所在位置</Label>
                    <Input
                      className="input-ancient"
                      placeholder="如：商业区、住宅区、学校附近等"
                      value={formData.requirements.location || ''}
                      onChange={(e) => updateRequirements('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>期望氛围</Label>
                    <Input
                      className="input-ancient"
                      placeholder="如：温馨、时尚、专业、休闲等"
                      value={formData.requirements.atmosphere || ''}
                      onChange={(e) => updateRequirements('atmosphere', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 风格偏好 */}
            <Card className="card-ancient">
              <CardHeader>
                <CardTitle className="flex items-center text-ancient-ink">
                  <Palette className="h-5 w-5 mr-2 text-gold" />
                  风格偏好
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 命名风格 */}
                <div>
                  <Label className="text-base font-medium">命名风格</Label>
                  <RadioGroup 
                    value={formData.requirements.style || ''} 
                    onValueChange={(value) => updateRequirements('style', value)}
                    className="mt-3"
                  >
                    {styleOptions.map((style) => (
                      <div key={style.value} className="flex items-start space-x-3 p-3 border border-gold/30 rounded-lg hover:bg-ancient-blue/10 transition-colors">
                        <RadioGroupItem value={style.value} id={style.value} className="mt-1 border-gold text-gold" />
                        <div className="flex-1">
                          <Label htmlFor={style.value} className="font-medium cursor-pointer text-ancient-ink">
                            {style.label}
                          </Label>
                          <p className="text-sm text-ancient-ink/60 mt-1">{style.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <Separator />

                {/* 名称长度 */}
                <div>
                  <Label className="text-ancient-ink">名称长度偏好</Label>
                  <Select 
                    value={formData.requirements.length || ''} 
                    onValueChange={(value) => updateRequirements('length', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择长度偏好" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">简短（1-2字）</SelectItem>
                      <SelectItem value="medium">适中（2-3字）</SelectItem>
                      <SelectItem value="long">较长（3-4字）</SelectItem>
                      <SelectItem value="flexible">灵活（不限制）</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 语调风格 */}
                <div>
                  <Label className="text-ancient-ink">语调风格</Label>
                  <Select 
                    value={formData.requirements.tone || ''} 
                    onValueChange={(value) => updateRequirements('tone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择语调风格" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* 生成按钮 */}
                <div className="pt-4">
                  <Button 
                    className="w-full btn-gold" 
                    size="lg" 
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        配置中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        开始生成名称
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏配置 */}
          <div className="space-y-6">
            {/* 生成偏好 */}
            <Card className="card-ancient">
              <CardHeader>
                <CardTitle className="flex items-center text-ancient-ink">
                  <Target className="h-5 w-5 mr-2 text-gold" />
                  生成偏好
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-ancient-ink">生成数量</Label>
                  <Select 
                    value={formData.preferences.nameCount.toString()} 
                    onValueChange={(value) => updatePreferences('nameCount', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5个名称</SelectItem>
                      <SelectItem value="10">10个名称</SelectItem>
                      <SelectItem value="15">15个名称</SelectItem>
                      <SelectItem value="20">20个名称</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeAnalysis"
                    checked={formData.preferences.includeAnalysis}
                    onCheckedChange={(checked) => updatePreferences('includeAnalysis', checked)}
                  />
                  <Label htmlFor="includeAnalysis" className="text-ancient-ink">包含名称分析</Label>
                </div>
              </CardContent>
            </Card>

            {/* 文化元素 */}
            <Card className="card-ancient">
              <CardHeader>
                <CardTitle className="flex items-center text-ancient-ink">
                  <Lightbulb className="h-5 w-5 mr-2 text-gold" />
                  文化元素
                </CardTitle>
                <CardDescription className="text-ancient-ink/70">
                  选择希望融入的文化元素
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {culturalElements.map((element) => (
                    <div key={element.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cultural-${element.value}`}
                        checked={formData.preferences.culturalElements.includes(element.value)}
                        onCheckedChange={() => 
                          toggleArrayItem(
                            formData.preferences.culturalElements, 
                            element.value,
                            (items) => updatePreferences('culturalElements', items)
                          )
                        }
                      />
                      <Label htmlFor={`cultural-${element.value}`} className="text-sm text-ancient-ink">
                        {element.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 现代元素 */}
            <Card className="card-ancient">
              <CardHeader>
                <CardTitle className="text-ancient-ink">现代元素</CardTitle>
                <CardDescription className="text-ancient-ink/70">
                  选择希望体现的现代特色
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {modernElements.map((element) => (
                    <div key={element.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`modern-${element.value}`}
                        checked={formData.preferences.modernElements.includes(element.value)}
                        onCheckedChange={() => 
                          toggleArrayItem(
                            formData.preferences.modernElements, 
                            element.value,
                            (items) => updatePreferences('modernElements', items)
                          )
                        }
                      />
                      <Label htmlFor={`modern-${element.value}`} className="text-sm text-ancient-ink">
                        {element.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
        

      </div>
    </div>
  )
}

export default function NamingConfigurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ancient-paper flex items-center justify-center">
        <div className="text-center">
          <Settings className="h-12 w-12 text-gold animate-spin mx-auto mb-4" />
          <p className="text-ancient-ink">正在加载配置...</p>
        </div>
      </div>
    }>
      <NamingConfigurePageContent />
    </Suspense>
  )
}