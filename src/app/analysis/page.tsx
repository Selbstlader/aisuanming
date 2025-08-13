'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, Heart, Download, ArrowLeft, ChevronDown, User, Briefcase, DollarSign, Shield, Lightbulb, Sparkles, AlertCircle } from 'lucide-react';
import { AnalysisContent } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface BaziRecord {
  id: string;
  name: string;
  gender: string;
  birth_date: string;
  birth_time: string;
  birth_location?: string;
  longitude?: number;
  latitude?: number;
  timezone?: number;
  year_pillar?: string;
  month_pillar?: string;
  day_pillar?: string;
  hour_pillar?: string;
  bazi_result?: {
    year: { heavenly: string; earthly: string };
    month: { heavenly: string; earthly: string };
    day: { heavenly: string; earthly: string };
    hour: { heavenly: string; earthly: string };
  };
  wuxing_analysis?: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    dominant: string;
    lacking: string[];
    balance_score: number;
  };
  created_at?: string;
}

function AnalysisPageContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const recordId = searchParams.get('recordId');
  
  const [baziRecord, setBaziRecord] = useState<BaziRecord | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState<'basic' | 'detailed' | 'premium'>('basic');
  const [isFavorite, setIsFavorite] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadBaziRecord = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/bazi/record/${id}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
      
      if (result.success && result.data) {
        // 转换数据格式以匹配前端期望的结构
        const record: BaziRecord = {
          id: result.data.id,
          name: result.data.name,
          gender: result.data.gender,
          birth_date: result.data.birth_date,
          birth_time: result.data.birth_time,
          birth_location: result.data.birth_location,
          longitude: result.data.longitude,
          latitude: result.data.latitude,
          timezone: result.data.timezone,
          year_pillar: result.data.year_pillar,
          month_pillar: result.data.month_pillar,
          day_pillar: result.data.day_pillar,
          hour_pillar: result.data.hour_pillar,
          bazi_result: result.data.bazi_result,
          wuxing_analysis: result.data.wuxing_analysis,
          created_at: result.data.created_at
        };
        setBaziRecord(record);
      } else {
        throw new Error('无效的响应数据格式');
      }
    } catch (error) {
      console.error('加载八字记录失败:', error);
      const errorMessage = error instanceof Error ? error.message : '加载记录时发生未知错误';
      setError(errorMessage);
      setBaziRecord(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (recordId) {
      loadBaziRecord(recordId);
    }
  }, [recordId, loadBaziRecord]);

  // 清除错误信息的辅助函数
  const clearErrors = () => {
    setFavoriteError(null);
    setExportError(null);
  };

  // 点击页面其他地方时清除错误提示
  useEffect(() => {
    const handleClick = () => {
      clearErrors();
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);



  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    if (!baziRecord) {
      setAnalysisError('缺少八字记录数据');
      return;
    }
    
    setIsLoading(true);
    setAnalysisError(null);
    
    try {
      const requestData = {
        baziData: baziRecord,
        userInfo: {
          name: baziRecord.name,
          gender: baziRecord.gender
        },
        analysisType
      };

      const response = await fetch('/api/analysis/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      if (result.success && result.analysis) {
        setAnalysis(result.analysis);
        if (result.warning) {
          // 使用更友好的警告显示方式
          setAnalysisError(`注意: ${result.warning}`);
        }
      } else {
        throw new Error(result.error || '分析结果格式错误');
      }
    } catch (error) {
      console.error('AI分析错误:', error);
      const errorMessage = error instanceof Error ? error.message : '分析时发生未知错误';
      setAnalysisError(errorMessage);
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  const toggleFavorite = async () => {
    if (!user) {
      setFavoriteError('请先登录后再收藏');
      return;
    }
    
    if (!baziRecord) {
      setFavoriteError('缺少八字记录数据');
      return;
    }

    try {
      setFavoriteError(null);
      // TODO: 实现收藏功能的API调用
      // const response = await fetch('/api/favorites', {
      //   method: isFavorite ? 'DELETE' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ recordId: baziRecord.id })
      // });
      
      // 暂时只更新本地状态
      setIsFavorite(!isFavorite);
      
      // 显示成功提示
      const message = !isFavorite ? '已添加到收藏' : '已取消收藏';
      // 可以使用toast库来显示更好的提示
      console.log(message);
      
    } catch (error) {
      console.error('收藏操作失败:', error);
      setFavoriteError('收藏操作失败，请重试');
    }
  };

  const [exportError, setExportError] = useState<string | null>(null);

  const exportAnalysis = () => {
    try {
      setExportError(null);
      
      if (!analysis || !baziRecord) {
        setExportError('缺少分析数据，无法导出');
        return;
      }
      
      if (!user) {
        setExportError('请先登录后再导出分析报告');
        return;
      }
      
      const content = `命理分析报告

基本信息：
姓名：${baziRecord.name}
性别：${baziRecord.gender === 'male' ? '男' : '女'}
出生日期：${baziRecord.birth_date}
出生时间：${baziRecord.birth_time}
八字：${baziRecord.year_pillar || '未知'} ${baziRecord.month_pillar || '未知'} ${baziRecord.day_pillar || '未知'} ${baziRecord.hour_pillar || '未知'}

性格特点：
${analysis.personality}

事业运势：
${analysis.career}

财运分析：
${analysis.wealth}

感情婚姻：
${analysis.relationship}

健康状况：
${analysis.health}

人生建议：
${analysis.suggestions.join('\n')}

生成时间：${new Date().toLocaleString()}`;
      
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `命理分析_${baziRecord.name}_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // 显示成功提示
      console.log('分析报告导出成功');
      
    } catch (error) {
      console.error('导出失败:', error);
      setExportError('导出失败，请重试');
    }
  };

  if (!recordId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">缺少八字记录</h1>
          <p className="mb-6">请先完成八字排盘</p>
          <button 
            onClick={() => window.location.href = '/bazi'}
            className="btn-ancient px-6 py-3"
          >
            返回八字排盘
          </button>
        </div>
      </div>
    );
  }

  // 显示加载状态
  if (isLoading && !baziRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">加载中...</h1>
          <p className="text-gray-300">正在获取八字记录</p>
        </div>
      </div>
    );
  }

  // 显示错误状态
  if (error && !baziRecord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4 text-red-400">加载失败</h1>
          <p className="mb-6 text-gray-300">{error}</p>
          <div className="space-y-4">
            <button 
              onClick={() => recordId && loadBaziRecord(recordId)}
              className="btn-gold px-6 py-3 mr-4"
            >
              重试
            </button>
            <button 
              onClick={() => window.location.href = '/bazi'}
              className="btn-ancient px-6 py-3"
            >
              返回八字排盘
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* 背景装饰 */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gold rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gold rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gold rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 头部导航 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gold hover:text-yellow-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
          
          <h1 className="text-3xl font-bold text-gold text-center flex-1">
            命理分析
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-gold'
                }`}
                title={isFavorite ? '取消收藏' : '添加收藏'}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              {favoriteError && (
                <div className="absolute top-full right-0 mt-2 p-2 bg-red-900/90 border border-red-500/50 rounded text-red-300 text-xs whitespace-nowrap z-10">
                  {favoriteError}
                </div>
              )}
            </div>
            
            {analysis && (
              <div className="relative">
                <button 
                  onClick={exportAnalysis}
                  className="p-2 text-gray-400 hover:text-gold transition-colors"
                  title="导出分析报告"
                >
                  <Download className="w-6 h-6" />
                </button>
                {exportError && (
                  <div className="absolute top-full right-0 mt-2 p-2 bg-red-900/90 border border-red-500/50 rounded text-red-300 text-xs whitespace-nowrap z-10">
                    {exportError}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* 八字信息卡片 */}
        {baziRecord && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-ancient p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gold mb-4">八字信息</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-purple-800/30 rounded-lg p-3">
                <div className="text-gold font-bold text-lg">{baziRecord.year_pillar}</div>
                <div className="text-gray-300 text-sm">年柱</div>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3">
                <div className="text-gold font-bold text-lg">{baziRecord.month_pillar}</div>
                <div className="text-gray-300 text-sm">月柱</div>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3">
                <div className="text-gold font-bold text-lg">{baziRecord.day_pillar}</div>
                <div className="text-gray-300 text-sm">日柱</div>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-3">
                <div className="text-gold font-bold text-lg">{baziRecord.hour_pillar}</div>
                <div className="text-gray-300 text-sm">时柱</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 分析类型选择 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-ancient p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gold mb-4">选择分析类型</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setAnalysisType('basic')}
              className={`p-4 rounded-lg border-2 transition-all ${
                analysisType === 'basic'
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-gray-600 text-gray-300 hover:border-gold/50'
              }`}
            >
              <div className="font-bold mb-2">基础分析</div>
              <div className="text-sm opacity-80">基本性格和运势分析</div>
            </button>
            
            <button
              onClick={() => setAnalysisType('detailed')}
              className={`p-4 rounded-lg border-2 transition-all ${
                analysisType === 'detailed'
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-gray-600 text-gray-300 hover:border-gold/50'
              }`}
            >
              <div className="font-bold mb-2">详细分析</div>
              <div className="text-sm opacity-80">深入的命理解读</div>
            </button>
            
            <button
              onClick={() => setAnalysisType('premium')}
              className={`p-4 rounded-lg border-2 transition-all ${
                analysisType === 'premium'
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-gray-600 text-gray-300 hover:border-gold/50'
              }`}
            >
              <div className="font-bold mb-2">高级分析</div>
              <div className="text-sm opacity-80">专业级命理指导</div>
            </button>
          </div>
          
          <div className="mt-6 text-center space-y-4">
            {!analysis && (
              <div className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300 font-medium">温馨提示</span>
                </div>
                <p className="text-amber-200 text-sm leading-relaxed">
                  AI命理分析需要约30-60秒时间，请耐心等待。我们将为您生成专业的八字命理解读。
                </p>
              </div>
            )}
            
            <button 
              onClick={generateAnalysis}
              disabled={isLoading}
              className="btn-gold px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>AI正在分析中...</span>
                  <div className="text-sm opacity-75">(请稍候)</div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span>开始AI智能分析</span>
                </div>
              )}
              
              {/* 按钮光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            {isLoading && (
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-amber-300">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <p className="text-amber-200 text-sm">正在运用传统命理学智慧进行深度分析...</p>
              </div>
            )}
            
            {/* 分析错误提示 */}
            {analysisError && (
              <div className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-red-300 font-medium">分析生成失败</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{analysisError}</p>
                {!analysisError.startsWith('注意:') && (
                  <button 
                    onClick={generateAnalysis}
                    className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg px-4 py-2 text-red-300 hover:text-red-200 text-sm transition-colors"
                  >
                    重新尝试
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* 分析结果 */}
        {analysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* 分析概览卡片 */}
            <div className="card-ancient p-6 relative overflow-hidden">
              {/* 装饰性背景图案 */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-32 h-32 border-2 border-gold rounded-full"></div>
                <div className="absolute bottom-4 left-4 w-24 h-24 border border-gold rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-gold rounded-full"></div>
              </div>
              
              <div className="text-center mb-6 relative z-10">
                <h2 className="text-2xl font-bold text-gold mb-2">命理分析报告</h2>
                <p className="text-gray-300">基于传统八字命理学的专业分析</p>
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-3"></div>
              </div>
              
              {/* 六宫格布局 */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
                {/* 性格特点 */}
                  <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-purple-400/20 hover:border-purple-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/30 to-purple-600/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-200" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-purple-100">性格特点</h3>
                    </div>
                    <div className="text-sm sm:text-base text-purple-50/90 leading-relaxed max-h-32 sm:max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/30">
                      {analysis.personality}
                    </div>
                  </div>

                {/* 事业运势 */}
                  <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-blue-400/20 hover:border-blue-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500/30 to-blue-600/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-blue-200" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-blue-100">事业运势</h3>
                    </div>
                    <div className="text-sm sm:text-base text-blue-50/90 leading-relaxed max-h-32 sm:max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400/30">
                      {analysis.career}
                    </div>
                  </div>

                  {/* 财运分析 */}
                  <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-emerald-400/20 hover:border-emerald-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-200" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-emerald-100">财运分析</h3>
                    </div>
                    <div className="text-sm sm:text-base text-emerald-50/90 leading-relaxed max-h-32 sm:max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-400/30">
                      {analysis.wealth}
                    </div>
                  </div>

                  {/* 感情婚姻 */}
                  <div className="bg-gradient-to-br from-rose-900/40 to-rose-800/20 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-rose-400/20 hover:border-rose-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-rose-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-500/30 to-rose-600/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-200" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-rose-100">感情婚姻</h3>
                    </div>
                    <div className="text-sm sm:text-base text-rose-50/90 leading-relaxed max-h-32 sm:max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-rose-400/30">
                      {analysis.relationship}
                    </div>
                  </div>

                  {/* 健康状况 */}
                  <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-orange-400/20 hover:border-orange-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-200" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-orange-100">健康状况</h3>
                    </div>
                    <div className="text-sm sm:text-base text-orange-50/90 leading-relaxed max-h-32 sm:max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400/30">
                      {analysis.health}
                    </div>
                  </div>

                  {/* 人生建议 */}
                  <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-amber-400/20 hover:border-amber-300/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/10">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500/30 to-amber-600/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-amber-200" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-amber-100">人生建议</h3>
                    </div>
                    <div className="text-sm sm:text-base text-amber-50/90 leading-relaxed max-h-32 sm:max-h-36 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-400/30">
                      {Array.isArray(analysis.suggestions) ? (
                        <ul className="space-y-2">
                          {analysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-amber-300 mt-1 font-bold">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div>{analysis.suggestions}</div>
                      )}
                    </div>
                  </div>
              </div>
            </div>


          </motion.div>
        )}
      </div>
    </div>
  );
}

// 加载组件
function AnalysisPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">加载中...</h1>
        <p className="text-gray-300">正在初始化分析页面</p>
      </div>
    </div>
  );
}

// 主导出组件
export default function AnalysisPage() {
  return (
    <Suspense fallback={<AnalysisPageLoading />}>
      <AnalysisPageContent />
    </Suspense>
  );
}