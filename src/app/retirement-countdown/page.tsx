'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, User, Target } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

interface TimeRemaining {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const RetirementCountdownPage: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null);
  const [retirementDate, setRetirementDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<{ birthDate?: string; retirementAge?: string }>({});

  // 处理年龄输入变化
  const handleRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 清除之前的错误
    if (errors.retirementAge) {
      setErrors(prev => ({ ...prev, retirementAge: undefined }));
    }
    
    // 如果输入为空，设置为0
    if (value === '') {
      setRetirementAge(0);
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    // 只允许正整数
    if (!isNaN(numValue) && numValue >= 0) {
      setRetirementAge(numValue);
    }
  };

  // 处理出生日期变化
  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthDate(value);
    
    // 清除之前的错误
    if (errors.birthDate) {
      setErrors(prev => ({ ...prev, birthDate: undefined }));
    }
  };

  // 计算退休倒计时
  const calculateRetirement = () => {
    const newErrors: { birthDate?: string; retirementAge?: string } = {};
    
    if (!birthDate) {
      newErrors.birthDate = '请输入出生日期';
    } else {
      const birth = new Date(birthDate);
      const today = new Date();
      if (birth > today) {
        newErrors.birthDate = '出生日期不能晚于今天';
      }
    }

    if (retirementAge < 18 || retirementAge > 100) {
      newErrors.retirementAge = '退休年龄应在18-100岁之间';
    } else if (retirementAge === 0) {
      newErrors.retirementAge = '请输入有效的退休年龄';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const birth = new Date(birthDate);
    const retirement = new Date(birth);
    retirement.setFullYear(birth.getFullYear() + retirementAge);
    
    setRetirementDate(retirement);

    const now = new Date();
    const timeDiff = retirement.getTime() - now.getTime();

    if (timeDiff <= 0) {
      setTimeRemaining({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
      return;
    }

    const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    setTimeRemaining({ years, months, days, hours, minutes, seconds });
  };

  // 实时更新倒计时
  useEffect(() => {
    if (retirementDate) {
      const interval = setInterval(() => {
        const now = new Date();
        const timeDiff = retirementDate.getTime() - now.getTime();

        if (timeDiff <= 0) {
          setTimeRemaining({
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
          clearInterval(interval);
          return;
        }

        const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((timeDiff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        setTimeRemaining({ years, months, days, hours, minutes, seconds });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [retirementDate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="title-ancient text-4xl md:text-5xl font-bold mb-4">
            退休倒计时
          </h1>
          <p className="text-gold-500/80 text-lg md:text-xl max-w-2xl mx-auto">
            计算您距离退休还有多长时间，规划美好的退休生活
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* 输入表单 */}
          <motion.div variants={itemVariants} className="card-ancient p-8 mb-8">
            <h2 className="title-ancient text-2xl font-bold mb-6 flex items-center">
              <User className="w-6 h-6 mr-3 text-primary-600" />
              基本信息
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-ancient-ink font-medium mb-2">
                  出生日期
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ancient-ink/50" />
                  <input
                    type="date"
                    value={birthDate}
                    onChange={handleBirthDateChange}
                    className="input-ancient w-full"
                    max={new Date().toISOString().split('T')[0]}
                    style={{ colorScheme: 'light', paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.birthDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                )}
              </div>

              <div>
                <label className="block text-ancient-ink font-medium mb-2">
                  退休年龄
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ancient-ink/50" />
                  <input
                    type="number"
                    value={retirementAge || ''}
                    onChange={handleRetirementAgeChange}
                    className="input-ancient w-full"
                    min="18"
                    max="100"
                    step="1"
                    placeholder="请输入退休年龄"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.retirementAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.retirementAge}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={calculateRetirement}
                className="btn-gold w-full md:w-auto px-8 py-3"
              >
                计算退休倒计时
              </button>
            </div>
          </motion.div>

          {/* 倒计时结果 */}
          {timeRemaining && retirementDate && (
            <motion.div
              variants={itemVariants}
              className="card-ancient p-8 mb-8"
            >
              <h2 className="title-ancient text-2xl font-bold mb-6 flex items-center">
                <Clock className="w-6 h-6 mr-3 text-primary-600" />
                退休倒计时
              </h2>

              {/* 退休日期 */}
              <div className="text-center mb-8">
                <p className="text-ancient-ink/70 mb-2">预计退休日期</p>
                <p className="text-2xl font-bold text-primary-700">
                  {retirementDate.toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* 倒计时显示 */}
              {timeRemaining.years > 0 || timeRemaining.months > 0 || timeRemaining.days > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700">{timeRemaining.years}</div>
                    <div className="text-ancient-ink/70 text-sm">年</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700">{timeRemaining.months}</div>
                    <div className="text-ancient-ink/70 text-sm">月</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700">{timeRemaining.days}</div>
                    <div className="text-ancient-ink/70 text-sm">天</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700">{timeRemaining.hours}</div>
                    <div className="text-ancient-ink/70 text-sm">时</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700">{timeRemaining.minutes}</div>
                    <div className="text-ancient-ink/70 text-sm">分</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700">{timeRemaining.seconds}</div>
                    <div className="text-ancient-ink/70 text-sm">秒</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-gold-600 mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-primary-700 mb-2">恭喜您！</h3>
                  <p className="text-ancient-ink/70">您已经到达退休年龄，享受美好的退休生活吧！</p>
                </div>
              )}
            </motion.div>
          )}

          {/* 返回首页 */}
          <motion.div variants={itemVariants} className="text-center">
            <Link href="/" className="btn-ancient inline-flex items-center px-6 py-3">
              <ArrowLeft className="w-5 h-5 mr-2" />
              返回首页
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RetirementCountdownPage;