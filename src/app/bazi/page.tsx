'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import { BirthInfo, BaziResult } from '@/types';
// import { formatChineseDateTime } from '@/lib/utils'; // 暂时未使用
import { useAuth } from '@/hooks/useAuth';
import { database } from '@/lib/supabase';
import { toast } from 'sonner';

const BaziPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
    gender: 'male',
    location: {
      name: '北京',
      longitude: 116.4074, // 北京经度
      latitude: 39.9042,   // 北京纬度
      timezone: 8, // 修复：使用数字而不是字符串
    },
  });

  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field: keyof BirthInfo, value: string | number) => {
    setBirthInfo(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationChange = (field: keyof BirthInfo['location'], value: string | number) => {
    setBirthInfo(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  // 保存八字结果到数据库
  const handleSaveResult = async () => {
    if (!baziResult) {
      toast.error('没有可保存的八字结果');
      return;
    }
    
    if (!user) {
      toast.error('请先登录后再保存结果');
      return;
    }

    setIsSaving(true);
    
    try {
      // 首先确保用户记录存在于public.users表中
      console.log('检查用户记录是否存在:', user.id);
      const { data: userData, error: userError } = await database.users.ensureExists({
        id: user.id,
        email: user.email || '',
        user_metadata: user.user_metadata
      });
      
      if (userError) {
        console.error('创建用户记录失败:', userError);
        alert(`用户记录创建失败：${userError.message || '未知错误'}，请重试`);
        return;
      }
      
      console.log('用户记录确认存在:', userData);
      
      const recordData = {
        name: name || '用户',
        gender: birthInfo.gender,
        birth_date: `${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`,
        birth_time: `${birthInfo.hour.toString().padStart(2, '0')}:${birthInfo.minute.toString().padStart(2, '0')}`,
        birth_place: {
          address: birthInfo.location.name,
          longitude: birthInfo.location.longitude,
          latitude: birthInfo.location.latitude,
          timezone: birthInfo.location.timezone || 8
        },
        year_pillar: `${baziResult.yearPillar.heavenlyStem}${baziResult.yearPillar.earthlyBranch}`,
        month_pillar: `${baziResult.monthPillar.heavenlyStem}${baziResult.monthPillar.earthlyBranch}`,
        day_pillar: `${baziResult.dayPillar.heavenlyStem}${baziResult.dayPillar.earthlyBranch}`,
        hour_pillar: `${baziResult.hourPillar.heavenlyStem}${baziResult.hourPillar.earthlyBranch}`,
        wuxing_analysis: baziResult.wuxingAnalysis,
        user_id: user.id
      };

      console.log('准备保存八字记录:', recordData);
      const { data, error } = await database.bazi.create(recordData);
      
      if (error) {
        console.error('保存八字记录失败:', {
          error,
          errorMessage: error.message,
          errorDetails: error.details,
          errorCode: error.code,
          recordData
        });
        
        // 提供更具体的错误信息
        let errorMessage = '保存失败，请重试';
        if (error.message?.includes('foreign key constraint')) {
          errorMessage = '用户验证失败，请重新登录后再试';
        } else if (error.message) {
          errorMessage = `保存失败：${error.message}`;
        }
        
        toast.error(errorMessage);
        return;
      }

      // 更新baziResult中的recordId
      setBaziResult(prev => prev ? { ...prev, recordId: data.id } : null);
      
      // 显示成功提示
      toast.success('八字排盘结果已成功保存！', {
        description: '正在跳转到分析页面...',
        duration: 2000
      });
      
      // 延迟跳转到分析页面
      setTimeout(() => {
        router.push(`/analysis?recordId=${data.id}`);
      }, 1500);
    } catch (error) {
      console.error('保存八字记录错误:', error);
      toast.error('保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 跳转到详细分析页面
  const handleGetAnalysis = () => {
    if (!baziResult || !baziResult.recordId) {
      toast.error('请先完成八字排盘并保存结果');
      return;
    }
    
    // 使用Next.js App Router进行导航
    router.push(`/analysis?recordId=${baziResult.recordId}`);
  };

  const handleCalculate = async () => {
    if (!birthInfo.year || !birthInfo.month || !birthInfo.day || !birthInfo.hour) {
      toast.error('请填写完整的出生信息');
      return;
    }

    if (!birthInfo.location.longitude || !birthInfo.location.latitude) {
      toast.error('请填写出生地点的经纬度信息');
      return;
    }

    setIsCalculating(true);
    
    try {
      // 构建API请求数据
      const requestData = {
        name: name || '用户',
        gender: birthInfo.gender,
        birthDate: `${birthInfo.year}-${birthInfo.month.toString().padStart(2, '0')}-${birthInfo.day.toString().padStart(2, '0')}`,
        birthTime: `${birthInfo.hour.toString().padStart(2, '0')}:${birthInfo.minute.toString().padStart(2, '0')}`,
        birthPlace: {
          address: birthInfo.location.name,
          longitude: birthInfo.location.longitude,
          latitude: birthInfo.location.latitude,
          timezone: birthInfo.location.timezone || 8
        },
        useRealSolarTime: true
      };

      const response = await fetch('/api/bazi/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();

      if (result.success) {
        // API直接返回BaziResult格式
        const baziResult: BaziResult = {
          ...result.data,
          solarTime: new Date(result.data.solarTime)
        };
        
        setBaziResult(baziResult);
        
        if (result.warning) {
          toast.warning(result.warning);
        }
      } else {
        toast.error(result.error || '计算失败，请重试');
      }
    } catch (error: unknown) {
      console.error('八字计算错误:', error instanceof Error ? error.message : error);
      toast.error('网络错误，请检查网络连接后重试');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* 页面标题 */}
          <div className="text-center mb-8">
            <h1 className="title-ancient text-4xl md:text-5xl font-bold mb-4">
              八字排盘
            </h1>
            <p className="text-gold-500/80 text-lg">
              基于真太阳时的精准八字计算
            </p>
          </div>

          {/* 输入表单 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card-ancient p-6 md:p-8 mb-8"
          >
            <h2 className="text-2xl font-semibold text-ancient-ink mb-6 flex items-center">
              <User className="w-6 h-6 mr-2 text-gold-500" />
              出生信息
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ancient-ink mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    姓名
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-ancient"
                    placeholder="请输入姓名（可选）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ancient-ink mb-2">
                    性别
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={birthInfo.gender === 'male'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-ancient-ink">男</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={birthInfo.gender === 'female'}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-ancient-ink">女</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ancient-ink mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    出生年份
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={birthInfo.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    className="input-ancient"
                    placeholder="如：1990"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ancient-ink mb-2">
                      月份
                    </label>
                    <select
                      value={birthInfo.month}
                      onChange={(e) => handleInputChange('month', parseInt(e.target.value))}
                      className="input-ancient"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month}>
                          {month}月
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ancient-ink mb-2">
                      日期
                    </label>
                    <select
                      value={birthInfo.day}
                      onChange={(e) => handleInputChange('day', parseInt(e.target.value))}
                      className="input-ancient"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>
                          {day}日
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ancient-ink mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      时辰
                    </label>
                    <select
                      value={birthInfo.hour}
                      onChange={(e) => handleInputChange('hour', parseInt(e.target.value))}
                      className="input-ancient"
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                        <option key={hour} value={hour}>
                          {hour}时
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ancient-ink mb-2">
                      分钟
                    </label>
                    <select
                      value={birthInfo.minute}
                      onChange={(e) => handleInputChange('minute', parseInt(e.target.value))}
                      className="input-ancient"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                        <option key={minute} value={minute}>
                          {minute}分
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 地理位置 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ancient-ink mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    出生地点
                  </label>
                  <input
                    type="text"
                    value={birthInfo.location.name}
                    onChange={(e) => handleLocationChange('name', e.target.value)}
                    className="input-ancient"
                    placeholder="如：北京市"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ancient-ink mb-2">
                      经度
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={birthInfo.location.longitude}
                      onChange={(e) => handleLocationChange('longitude', parseFloat(e.target.value))}
                      className="input-ancient"
                      placeholder="116.4074"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ancient-ink mb-2">
                      纬度
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={birthInfo.location.latitude}
                      onChange={(e) => handleLocationChange('latitude', parseFloat(e.target.value))}
                      className="input-ancient"
                      placeholder="39.9042"
                    />
                  </div>
                </div>

                <div className="text-xs text-ancient-ink/60">
                  <p>* 经纬度用于计算真太阳时，确保八字准确性</p>
                  <p>* 如不确定可使用默认值（北京坐标）</p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="btn-gold text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? '计算中...' : '开始排盘'}
              </button>
            </div>
          </motion.div>

          {/* 八字结果 */}
          {baziResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card-ancient p-6 md:p-8"
            >
              <h2 className="text-2xl font-semibold text-ancient-ink mb-6">
                八字排盘结果
              </h2>

              {/* 基本信息显示 */}
              <div className="mb-6 p-4 bg-ancient-paper/50 rounded-lg">
                <p className="text-ancient-ink">
                  <span className="font-medium">出生时间：</span>
                  {`${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日 ${birthInfo.hour}时${birthInfo.minute}分`}
                </p>
                <p className="text-ancient-ink">
                  <span className="font-medium">出生地点：</span>
                  {birthInfo.location.name || '未指定'}
                </p>
                <p className="text-ancient-ink">
                  <span className="font-medium">真太阳时：</span>
                  {baziResult.solarTime.toLocaleString('zh-CN')}
                </p>
              </div>

              {/* 四柱八字 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gradient-gold/10 rounded-lg">
                  <h3 className="font-semibold text-ancient-ink mb-2">年柱</h3>
                  <div className="text-2xl font-bold text-primary-700">
                    {baziResult.yearPillar.heavenlyStem}{baziResult.yearPillar.earthlyBranch}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-gold/10 rounded-lg">
                  <h3 className="font-semibold text-ancient-ink mb-2">月柱</h3>
                  <div className="text-2xl font-bold text-primary-700">
                    {baziResult.monthPillar.heavenlyStem}{baziResult.monthPillar.earthlyBranch}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-gold/10 rounded-lg">
                  <h3 className="font-semibold text-ancient-ink mb-2">日柱</h3>
                  <div className="text-2xl font-bold text-primary-700">
                    {baziResult.dayPillar.heavenlyStem}{baziResult.dayPillar.earthlyBranch}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-gold/10 rounded-lg">
                  <h3 className="font-semibold text-ancient-ink mb-2">时柱</h3>
                  <div className="text-2xl font-bold text-primary-700">
                    {baziResult.hourPillar.heavenlyStem}{baziResult.hourPillar.earthlyBranch}
                  </div>
                </div>
              </div>

              {/* 五行分析 */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-ancient-ink mb-4">五行分析</h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(baziResult.wuxingAnalysis.counts).map(([element, count]) => (
                    <div key={element} className="text-center p-3 bg-ancient-paper/30 rounded">
                      <div className="text-lg font-bold text-primary-700">{element}</div>
                      <div className="text-sm text-ancient-ink">{count}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-ancient-ink">
                  <p><span className="font-medium">主要五行：</span>{baziResult.wuxingAnalysis.dominant.join('、')}</p>
                  <p><span className="font-medium">缺失五行：</span>{baziResult.wuxingAnalysis.missing.length > 0 ? baziResult.wuxingAnalysis.missing.join('、') : '无'}</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleSaveResult}
                  disabled={isSaving || !baziResult}
                  className="btn-ancient px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? '保存中...' : '保存结果'}
                </button>
                <button 
                  onClick={handleGetAnalysis}
                  disabled={!baziResult}
                  className="btn-gold px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  获取详细分析
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default BaziPage;