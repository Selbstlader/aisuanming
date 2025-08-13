'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, User, Clock, Sparkles, Heart, Coins, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface BaziRecord {
  id: string;
  name: string;
  birth_date: string;
  birth_time: string;
  birth_location: string;
  gender: string;
  created_at: string;
  updated_at: string;
  bazi_result?: {
    year: { heavenly: string; earthly: string };
    month: { heavenly: string; earthly: string };
    day: { heavenly: string; earthly: string };
    hour: { heavenly: string; earthly: string };
    elements: {
      wood: number;
      fire: number;
      earth: number;
      metal: number;
      water: number;
    };
    dayMaster: string;
    strength: string;
  };
}

interface AnalysisResult {
  id: string;
  bazi_record_id: string;
  user_id: string;
  analysis_type: string;
  analysis_content: {
    personality: string;
    career: string;
    wealth: string;
    relationship: string;
    health: string;
    suggestions: string[];
  };
  ai_response: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export default function RecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading } = useAuth();
  const [record, setRecord] = useState<BaziRecord | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recordId = params.id as string;

  // 检查用户认证状态
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // 加载八字记录详情
  const loadRecordDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 获取认证token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('用户未认证，请重新登录');
        router.push('/auth/login');
        return;
      }

      // 获取八字记录
      const recordResponse = await fetch(`/api/bazi/record/${recordId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!recordResponse.ok) {
        throw new Error('获取记录失败');
      }

      const recordData = await recordResponse.json();
      if (recordData.success) {
        setRecord(recordData.data);
      } else {
        throw new Error(recordData.error || '获取记录失败');
      }

      // 尝试获取分析结果
      try {
        const analysisResponse = await fetch(`/api/analysis/record/${recordId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          if (analysisData.success) {
            setAnalysis(analysisData.data);
          }
        }
      } catch (analysisError) {
        // 分析结果不存在是正常的，不需要报错
        console.log('暂无分析结果');
      }

    } catch (error) {
      console.error('加载记录详情失败:', error);
      setError(error instanceof Error ? error.message : '加载失败');
      toast.error('加载记录详情失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    if (user && !loading && recordId) {
      loadRecordDetail();
    }
  }, [user, loading, recordId]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 格式化时间
  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM
  };

  // 获取五行颜色
  const getElementColor = (element: string) => {
    const colors = {
      wood: 'text-green-600 bg-green-50',
      fire: 'text-red-600 bg-red-50',
      earth: 'text-yellow-600 bg-yellow-50',
      metal: 'text-gray-600 bg-gray-50',
      water: 'text-blue-600 bg-blue-50'
    };
    return colors[element as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  // 获取五行中文名
  const getElementName = (element: string) => {
    const names = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水'
    };
    return names[element as keyof typeof names] || element;
  };

  // 如果正在加载认证状态，显示加载界面
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <span className="text-amber-700">加载中...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // 将被重定向到登录页面
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <span className="text-amber-700">加载记录详情中...</span>
        </div>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">加载失败</h2>
          <p className="text-amber-700 mb-4">{error || '记录不存在或无权访问'}</p>
          <button
            onClick={() => router.push('/history')}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
          >
            返回历史记录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/history')}
            className="flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回历史记录
          </button>
        </div>

        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">八字详情</h1>
          <p className="text-amber-700">查看完整的八字排盘和分析结果</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 基本信息 */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                基本信息
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-sm text-amber-600">姓名</span>
                    <p className="font-medium text-amber-900">{record.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 text-amber-600 flex items-center justify-center">
                    {record.gender === 'male' ? '♂' : '♀'}
                  </div>
                  <div>
                    <span className="text-sm text-amber-600">性别</span>
                    <p className="font-medium text-amber-900">{record.gender === 'male' ? '男' : '女'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-sm text-amber-600">出生日期</span>
                    <p className="font-medium text-amber-900">{formatDate(record.birth_date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-sm text-amber-600">出生时间</span>
                    <p className="font-medium text-amber-900">{formatTime(record.birth_time)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-sm text-amber-600">出生地点</span>
                    <p className="font-medium text-amber-900">{record.birth_location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="text-sm text-amber-600">创建时间</span>
                    <p className="font-medium text-amber-900">{formatDate(record.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 八字排盘和五行分析 */}
          <div className="lg:col-span-2">
            {record.bazi_result ? (
              <div className="space-y-6">
                {/* 八字排盘 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-amber-900 mb-4">八字排盘</h2>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-amber-600 mb-2">年柱</div>
                      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-3">
                        <div className="text-lg font-bold text-amber-900">{record.bazi_result.year.heavenly}</div>
                        <div className="text-lg font-bold text-amber-900">{record.bazi_result.year.earthly}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-amber-600 mb-2">月柱</div>
                      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-3">
                        <div className="text-lg font-bold text-amber-900">{record.bazi_result.month.heavenly}</div>
                        <div className="text-lg font-bold text-amber-900">{record.bazi_result.month.earthly}</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-amber-600 mb-2">日柱</div>
                      <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-lg p-3 border-2 border-red-200">
                        <div className="text-lg font-bold text-red-900">{record.bazi_result.day.heavenly}</div>
                        <div className="text-lg font-bold text-red-900">{record.bazi_result.day.earthly}</div>
                      </div>
                      <div className="text-xs text-red-600 mt-1">日主</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-amber-600 mb-2">时柱</div>
                      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-3">
                        <div className="text-lg font-bold text-amber-900">{record.bazi_result.hour.heavenly}</div>
                        <div className="text-lg font-bold text-amber-900">{record.bazi_result.hour.earthly}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 日主信息 */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4">
                      <div className="text-sm text-red-600 mb-1">日主</div>
                      <div className="text-xl font-bold text-red-900">{record.bazi_result.dayMaster}</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4">
                      <div className="text-sm text-amber-600 mb-1">强弱</div>
                      <div className="text-xl font-bold text-amber-900">{record.bazi_result.strength}</div>
                    </div>
                  </div>
                </div>

                {/* 五行分析 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-amber-900 mb-4">五行分析</h2>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries(record.bazi_result.elements).map(([element, count]) => (
                      <div key={element} className="text-center">
                        <div className={`rounded-lg p-4 ${getElementColor(element)}`}>
                          <div className="text-2xl font-bold">{getElementName(element)}</div>
                          <div className="text-lg font-semibold">{count}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 五行分布图 */}
                  <div className="mt-6">
                    <div className="text-sm text-amber-600 mb-2">五行分布</div>
                    <div className="bg-amber-50 rounded-lg p-4">
                      <div className="flex gap-1 h-6 rounded overflow-hidden">
                        {Object.entries(record.bazi_result.elements).map(([element, count]) => {
                          const total = Object.values(record.bazi_result!.elements).reduce((a, b) => a + b, 0);
                          const percentage = total > 0 ? (count / total) * 100 : 0;
                          const bgColor = {
                            wood: 'bg-green-500',
                            fire: 'bg-red-500',
                            earth: 'bg-yellow-500',
                            metal: 'bg-gray-500',
                            water: 'bg-blue-500'
                          }[element];
                          return (
                            <div
                              key={element}
                              className={bgColor}
                              style={{ width: `${percentage}%` }}
                              title={`${getElementName(element)}: ${count} (${percentage.toFixed(1)}%)`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center">
                <div className="text-amber-400 text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-amber-900 mb-2">暂无排盘结果</h3>
                <p className="text-amber-600">该记录尚未进行八字排盘计算</p>
              </div>
            )}
          </div>
        </div>

        {/* AI分析结果 */}
        {analysis && (
          <div className="mt-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI命理分析
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 性格特点 */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                  <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    性格特点
                  </h3>
                  <p className="text-purple-800 text-sm leading-relaxed">{analysis.analysis_content?.personality || '暂无数据'}</p>
                </div>

                {/* 事业运势 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    事业运势
                  </h3>
                  <p className="text-blue-800 text-sm leading-relaxed">{analysis.analysis_content?.career || '暂无数据'}</p>
                </div>

                {/* 财运分析 */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    财运分析
                  </h3>
                  <p className="text-green-800 text-sm leading-relaxed">{analysis.analysis_content?.wealth || '暂无数据'}</p>
                </div>

                {/* 感情婚姻 */}
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-4">
                  <h3 className="font-semibold text-rose-900 mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    感情婚姻
                  </h3>
                  <p className="text-rose-800 text-sm leading-relaxed">{analysis.analysis_content?.relationship || '暂无数据'}</p>
                </div>

                {/* 健康状况 */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    健康状况
                  </h3>
                  <p className="text-orange-800 text-sm leading-relaxed">{analysis.analysis_content?.health || '暂无数据'}</p>
                </div>

                {/* 人生建议 */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    人生建议
                  </h3>
                  <div className="text-amber-800 text-sm leading-relaxed">
                    {analysis.analysis_content?.suggestions ? (
                      <ul className="list-disc list-inside space-y-1">
                        {analysis.analysis_content.suggestions.map((suggestion: string, index: number) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>暂无数据</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-xs text-amber-600">
                  分析时间：{formatDate(analysis.created_at)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push('/history')}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-2 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200"
          >
            返回历史记录
          </button>
          {record.bazi_result && (
            <button
              onClick={() => router.push(`/analysis?recordId=${record.id}`)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
            >
              查看分析
            </button>
          )}
        </div>
      </div>
    </div>
  );
}