'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, ArrowLeft, User, TrendingUp, Info, PiggyBank, Building2, Clock, Target, BarChart3, Percent, Wallet, PieChart, BookOpen, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

interface PensionResult {
  // 基础信息
  basicPension: number;
  personalPension: number;
  totalPension: number;
  
  // 缴费详情
  monthlyPersonalContribution: number;
  monthlyEmployerContribution: number;
  monthlyTotalContribution: number;
  totalPersonalContribution: number;
  totalEmployerContribution: number;
  totalContribution: number;
  
  // 个人账户详情
  personalAccountTotal: number;
  personalAccountInterest: number;
  
  // 回本时间
  personalPaybackMonths: number;
  totalPaybackMonths: number;
  personalPaybackYears: number;
  totalPaybackYears: number;
  
  // 收益分析
  replacementRate: number;
  totalLifetimeIncome: number;
  totalReturn: number;
  returnRate: number;
}

const PensionCalculatorPage: React.FC = () => {
  // 基础信息
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(8000);
  const [contributionYears, setContributionYears] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [avgSalary, setAvgSalary] = useState<number>(6000);
  const [accountInterestRate, setAccountInterestRate] = useState<number>(0.06);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(78);
  const [salaryGrowthRate, setSalaryGrowthRate] = useState<number>(0.03);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [result, setResult] = useState<PensionResult | null>(null);
  const [errors, setErrors] = useState<{
    currentAge?: string;
    monthlyIncome?: string;
    contributionYears?: string;
    retirementAge?: string;
    avgSalary?: string;
    accountInterestRate?: string;
    lifeExpectancy?: string;
    salaryGrowthRate?: string;
  }>({});

  // 验证输入
  const validateInputs = (): boolean => {
    const newErrors: typeof errors = {};

    if (currentAge < 18 || currentAge > 65) {
      newErrors.currentAge = '当前年龄应在18-65岁之间';
    }

    if (monthlyIncome < 1000 || monthlyIncome > 100000) {
      newErrors.monthlyIncome = '月收入应在1000-100000元之间';
    }

    if (contributionYears < 1 || contributionYears > 50) {
      newErrors.contributionYears = '缴费年限应在1-50年之间';
    }

    if (retirementAge < 50 || retirementAge > 70) {
      newErrors.retirementAge = '退休年龄应在50-70岁之间';
    }

    if (retirementAge <= currentAge) {
      newErrors.retirementAge = '退休年龄应大于当前年龄';
    }

    if (contributionYears > (retirementAge - currentAge)) {
      newErrors.contributionYears = '缴费年限不能超过剩余工作年限';
    }

    if (avgSalary < 1000 || avgSalary > 50000) {
      newErrors.avgSalary = '社会平均工资应在1000-50000元之间';
    }

    if (accountInterestRate < 0.01 || accountInterestRate > 0.15) {
      newErrors.accountInterestRate = '记账利率应在1%-15%之间';
    }

    if (lifeExpectancy < 60 || lifeExpectancy > 100) {
      newErrors.lifeExpectancy = '预期寿命应在60-100岁之间';
    }

    if (salaryGrowthRate < 0 || salaryGrowthRate > 0.10) {
      newErrors.salaryGrowthRate = '工资增长率应在0%-10%之间';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 计算退休金
  const calculatePension = () => {
    if (!validateInputs()) return;

    // 缴费比例
    const personalContributionRate = 0.08; // 个人缴费比例8%
    const employerContributionRate = 0.20; // 单位缴费比例20%
    
    // 月缴费金额
    const monthlyPersonalContribution = monthlyIncome * personalContributionRate;
    const monthlyEmployerContribution = monthlyIncome * employerContributionRate;
    const monthlyTotalContribution = monthlyPersonalContribution + monthlyEmployerContribution;
    
    // 总缴费金额
    const totalPersonalContribution = monthlyPersonalContribution * 12 * contributionYears;
    const totalEmployerContribution = monthlyEmployerContribution * 12 * contributionYears;
    const totalContribution = totalPersonalContribution + totalEmployerContribution;
    
    // 个人账户累计（考虑复利）
    let personalAccountTotal = 0;
    for (let year = 0; year < contributionYears; year++) {
      const yearlyContribution = monthlyPersonalContribution * 12;
      const compoundYears = contributionYears - year;
      personalAccountTotal += yearlyContribution * Math.pow(1 + accountInterestRate, compoundYears - 1);
    }
    
    const personalAccountInterest = personalAccountTotal - totalPersonalContribution;
    
    // 计发月数（根据退休年龄）
    const paymentMonths = retirementAge === 60 ? 139 : (retirementAge === 55 ? 170 : 195);
    
    // 个人账户养老金
    const personalPension = personalAccountTotal / paymentMonths;
    
    // 基础养老金 = (社会平均工资 + 个人指数化月平均缴费工资) / 2 × 缴费年限 × 1%
    const indexedSalary = monthlyIncome; // 简化处理，实际应考虑历年工资指数
    const basicPension = (avgSalary + indexedSalary) / 2 * contributionYears * 0.01;
    
    // 总退休金
    const totalPension = basicPension + personalPension;
    
    // 回本时间计算
    const personalPaybackMonths = Math.ceil(totalPersonalContribution / totalPension);
    const totalPaybackMonths = Math.ceil(totalContribution / totalPension);
    const personalPaybackYears = Math.floor(personalPaybackMonths / 12);
    const totalPaybackYears = Math.floor(totalPaybackMonths / 12);
    
    // 收益分析
    const replacementRate = (totalPension / monthlyIncome) * 100;
    const retirementMonths = (lifeExpectancy - retirementAge) * 12;
    const totalLifetimeIncome = totalPension * retirementMonths;
    const totalReturn = totalLifetimeIncome - totalContribution;
    const returnRate = totalReturn > 0 ? (totalReturn / totalContribution) * 100 : 0;

    setResult({
      basicPension,
      personalPension,
      totalPension,
      monthlyPersonalContribution,
      monthlyEmployerContribution,
      monthlyTotalContribution,
      totalPersonalContribution,
      totalEmployerContribution,
      totalContribution,
      personalAccountTotal,
      personalAccountInterest,
      personalPaybackMonths,
      totalPaybackMonths,
      personalPaybackYears,
      totalPaybackYears,
      replacementRate,
      totalLifetimeIncome,
      totalReturn,
      returnRate
    });
  };

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
            退休金计算器
          </h1>
          <p className="text-gold-500/80 text-lg md:text-xl max-w-2xl mx-auto">
            根据您的收入和缴费情况，预估退休后的养老金水平
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
                  当前年龄
                </label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="input-ancient w-full"
                  min="18"
                  max="65"
                />
                {errors.currentAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.currentAge}</p>
                )}
              </div>

              <div>
                <label className="block text-ancient-ink font-medium mb-2">
                  月收入（元）
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ancient-ink/50" />
                  <input
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="input-ancient w-full"
                    min="1000"
                    max="100000"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
                {errors.monthlyIncome && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyIncome}</p>
                )}
              </div>

              <div>
                <label className="block text-ancient-ink font-medium mb-2">
                  缴费年限（年）
                </label>
                <input
                  type="number"
                  value={contributionYears}
                  onChange={(e) => setContributionYears(Number(e.target.value))}
                  className="input-ancient w-full"
                  min="1"
                  max="50"
                />
                {errors.contributionYears && (
                  <p className="text-red-500 text-sm mt-1">{errors.contributionYears}</p>
                )}
              </div>

              <div>
                <label className="block text-ancient-ink font-medium mb-2">
                  退休年龄
                </label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="input-ancient w-full"
                  min="50"
                  max="70"
                />
                {errors.retirementAge && (
                  <p className="text-red-500 text-sm mt-1">{errors.retirementAge}</p>
                )}
              </div>
            </div>

            {/* 高级参数 */}
            <div className="mt-8">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-primary-600 hover:text-primary-700 font-medium mb-4"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                高级参数设置
                <motion.div
                  animate={{ rotate: showAdvanced ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-2"
                >
                  ▼
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-ancient-border">
                  <div>
                    <label className="block text-ancient-ink font-medium mb-2">
                      社会平均工资（元）
                    </label>
                    <input
                      type="number"
                      value={avgSalary}
                      onChange={(e) => setAvgSalary(Number(e.target.value))}
                      className="input-ancient w-full"
                      min="1000"
                      max="50000"
                    />
                    {errors.avgSalary && (
                      <p className="text-red-500 text-sm mt-1">{errors.avgSalary}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-ancient-ink font-medium mb-2">
                      个人账户记账利率（%）
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ancient-ink/50" />
                      <input
                        type="number"
                        value={accountInterestRate * 100}
                        onChange={(e) => setAccountInterestRate(Number(e.target.value) / 100)}
                        className="input-ancient w-full"
                        min="1"
                        max="15"
                        step="0.1"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                    {errors.accountInterestRate && (
                      <p className="text-red-500 text-sm mt-1">{errors.accountInterestRate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-ancient-ink font-medium mb-2">
                      预期寿命（岁）
                    </label>
                    <input
                      type="number"
                      value={lifeExpectancy}
                      onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                      className="input-ancient w-full"
                      min="60"
                      max="100"
                    />
                    {errors.lifeExpectancy && (
                      <p className="text-red-500 text-sm mt-1">{errors.lifeExpectancy}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-ancient-ink font-medium mb-2">
                      工资增长率（%）
                    </label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-ancient-ink/50" />
                      <input
                        type="number"
                        value={salaryGrowthRate * 100}
                        onChange={(e) => setSalaryGrowthRate(Number(e.target.value) / 100)}
                        className="input-ancient w-full"
                        min="0"
                        max="10"
                        step="0.1"
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                    {errors.salaryGrowthRate && (
                      <p className="text-red-500 text-sm mt-1">{errors.salaryGrowthRate}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-6">
              <button
                onClick={calculatePension}
                className="btn-gold w-full md:w-auto px-8 py-3"
              >
                <Calculator className="w-5 h-5 mr-2 inline" />
                计算退休金
              </button>
            </div>
          </motion.div>

          {/* 计算结果 */}
          {result && (
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              {/* 退休金总览 */}
              <div className="card-ancient p-8">
                <h2 className="title-ancient text-2xl font-bold mb-6 flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-primary-600" />
                  退休金预估
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700 mb-2">
                      ¥{result.totalPension.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-ancient-ink/70">月退休金总额</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-gold-50 to-primary-50 rounded-lg">
                    <div className="text-3xl font-bold text-gold-600 mb-2">
                      {result.replacementRate.toFixed(1)}%
                    </div>
                    <div className="text-ancient-ink/70">收入替代率</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg">
                    <div className="text-3xl font-bold text-primary-700 mb-2">
                      ¥{result.totalContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-ancient-ink/70">总缴费金额</div>
                  </div>
                </div>
              </div>

              {/* 缴费详情 */}
              <div className="card-ancient p-8">
                <h3 className="title-ancient text-xl font-bold mb-6 flex items-center">
                  <DollarSign className="w-5 h-5 mr-3 text-primary-600" />
                  缴费详情
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
                    <h4 className="text-lg font-semibold text-blue-700 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      个人缴费（8%）
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-ancient-ink/70">月缴费：</span>
                        <span className="font-semibold">¥{result.monthlyPersonalContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ancient-ink/70">年缴费：</span>
                        <span className="font-semibold">¥{(result.monthlyPersonalContribution * 12).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-ancient-ink/70">总缴费：</span>
                        <span className="font-bold text-blue-700">¥{result.totalPersonalContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                    <h4 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
                      <Building2 className="w-5 h-5 mr-2" />
                      单位缴费（20%）
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-ancient-ink/70">月缴费：</span>
                        <span className="font-semibold">¥{result.monthlyEmployerContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-ancient-ink/70">年缴费：</span>
                        <span className="font-semibold">¥{(result.monthlyEmployerContribution * 12).toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-ancient-ink/70">总缴费：</span>
                        <span className="font-bold text-green-700">¥{result.totalEmployerContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 个人账户详情 */}
                <div className="mt-8 bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
                  <h4 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
                    <PiggyBank className="w-5 h-5 mr-2" />
                    个人账户详情
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        ¥{result.personalAccountTotal.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-sm text-ancient-ink/70">退休时账户总额</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        ¥{result.personalAccountInterest.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-sm text-ancient-ink/70">利息收益</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-700">
                        {(accountInterestRate * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-ancient-ink/70">年记账利率</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 回本时间分析 */}
              <div className="card-ancient p-8">
                <h3 className="title-ancient text-xl font-bold mb-6 flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-primary-600" />
                  回本时间分析
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-700 mb-4">个人缴费回本</h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-blue-700">
                        {result.personalPaybackYears}年{result.personalPaybackMonths % 12}个月
                      </div>
                      <div className="text-sm text-ancient-ink/70 mt-2">
                        收回个人缴纳的 ¥{result.totalPersonalContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((result.personalPaybackMonths / ((lifeExpectancy - retirementAge) * 12)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-ancient-ink/60 mt-2 text-center">
                      预期寿命内回本进度
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-orange-700 mb-4">总缴费回本</h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-orange-700">
                        {result.totalPaybackYears}年{result.totalPaybackMonths % 12}个月
                      </div>
                      <div className="text-sm text-ancient-ink/70 mt-2">
                        收回总缴费 ¥{result.totalContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-3">
                      <div 
                        className="bg-orange-600 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((result.totalPaybackMonths / ((lifeExpectancy - retirementAge) * 12)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-ancient-ink/60 mt-2 text-center">
                      预期寿命内回本进度
                    </div>
                  </div>
                </div>
              </div>

              {/* 收益分析 */}
              <div className="card-ancient p-8">
                <h3 className="title-ancient text-xl font-bold mb-6 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-3 text-primary-600" />
                  收益分析
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center bg-green-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-green-700 mb-2">
                      ¥{result.totalLifetimeIncome.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-ancient-ink/70">预期总收入</div>
                    <div className="text-xs text-ancient-ink/60 mt-1">
                      （至{lifeExpectancy}岁）
                    </div>
                  </div>
                  
                  <div className="text-center bg-blue-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-blue-700 mb-2">
                      ¥{result.totalReturn.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-ancient-ink/70">净收益</div>
                    <div className="text-xs text-ancient-ink/60 mt-1">
                      （收入 - 总缴费）
                    </div>
                  </div>
                  
                  <div className="text-center bg-purple-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-purple-700 mb-2">
                      {result.returnRate.toFixed(1)}%
                    </div>
                    <div className="text-ancient-ink/70">总回报率</div>
                    <div className="text-xs text-ancient-ink/60 mt-1">
                      （净收益 ÷ 总缴费）
                    </div>
                  </div>
                </div>
              </div>

              {/* 详细计算 */}
              <div className="card-ancient p-8">
                <h3 className="title-ancient text-xl font-bold mb-6 flex items-center">
                  <Target className="w-5 h-5 mr-3 text-primary-600" />
                  详细计算过程
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-ancient-border">
                    <span className="text-ancient-ink">基础养老金</span>
                    <span className="font-semibold text-primary-700">
                      ¥{result.basicPension.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}/月
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-ancient-border">
                    <span className="text-ancient-ink">个人账户养老金</span>
                    <span className="font-semibold text-primary-700">
                      ¥{result.personalPension.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}/月
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3 border-b border-ancient-border">
                    <span className="text-ancient-ink">月缴费金额</span>
                    <span className="font-semibold text-gold-600">
                      ¥{result.monthlyTotalContribution.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}/月
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span className="text-ancient-ink font-semibold">退休金总额</span>
                    <span className="font-bold text-xl text-primary-700">
                      ¥{result.totalPension.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}/月
                    </span>
                  </div>
                </div>
              </div>

              {/* 计算公式说明 */}
              <div className="card-ancient p-8">
                <h3 className="title-ancient text-xl font-bold mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-3 text-primary-600" />
                  计算公式详解
                </h3>
                
                <div className="space-y-6">
                  {/* 基础养老金公式 */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">基础养老金计算</h4>
                    <div className="bg-white rounded p-4 mb-3 font-mono text-sm">
                      基础养老金 = (社会平均工资 + 个人平均工资) ÷ 2 × 缴费年限 × 1%
                    </div>
                    <p className="text-sm text-ancient-ink/80">
                      基础养老金主要与缴费年限和工资水平相关，缴费时间越长、工资越高，基础养老金越多。
                    </p>
                  </div>

                  {/* 个人账户养老金公式 */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-700 mb-3">个人账户养老金计算</h4>
                    <div className="bg-white rounded p-4 mb-3 font-mono text-sm">
                      个人账户养老金 = 个人账户累计储存额 ÷ 计发月数
                    </div>
                    <p className="text-sm text-ancient-ink/80 mb-2">
                      个人账户储存额包括个人缴费本金和历年记账利息。计发月数根据退休年龄确定：
                    </p>
                    <ul className="text-xs text-ancient-ink/70 space-y-1">
                      <li>• 50岁退休：195个月</li>
                      <li>• 55岁退休：170个月</li>
                      <li>• 60岁退休：139个月</li>
                      <li>• 65岁退休：101个月</li>
                    </ul>
                  </div>

                  {/* 缴费比例说明 */}
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-purple-700 mb-3">缴费比例说明</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded p-4">
                        <div className="text-sm font-semibold text-blue-700 mb-2">个人缴费（8%）</div>
                        <div className="text-xs text-ancient-ink/70">
                          全部进入个人账户，用于计算个人账户养老金
                        </div>
                      </div>
                      <div className="bg-white rounded p-4">
                        <div className="text-sm font-semibold text-green-700 mb-2">单位缴费（20%）</div>
                        <div className="text-xs text-ancient-ink/70">
                          进入统筹基金，用于支付基础养老金和调剂使用
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 回本时间计算 */}
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-orange-700 mb-3">回本时间计算</h4>
                    <div className="space-y-3">
                      <div className="bg-white rounded p-4">
                        <div className="text-sm font-semibold mb-2">个人缴费回本时间</div>
                        <div className="font-mono text-xs mb-2">
                          回本月数 = 个人总缴费 ÷ 月退休金
                        </div>
                        <div className="text-xs text-ancient-ink/70">
                          计算收回个人缴纳部分所需的时间
                        </div>
                      </div>
                      <div className="bg-white rounded p-4">
                        <div className="text-sm font-semibold mb-2">总缴费回本时间</div>
                        <div className="font-mono text-xs mb-2">
                          回本月数 = (个人缴费 + 单位缴费) ÷ 月退休金
                        </div>
                        <div className="text-xs text-ancient-ink/70">
                          计算收回全部缴费成本所需的时间
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 重要提示 */}
              <div className="card-ancient p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                  <div className="text-sm text-ancient-ink/80">
                    <h4 className="font-semibold text-amber-700 mb-2">重要提示</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• 本计算器基于现行养老保险制度，仅供参考</li>
                      <li>• 实际退休金受政策调整、工资增长、通胀等多种因素影响</li>
                      <li>• 个人账户记账利率每年由国家公布，历史平均约为6-8%</li>
                      <li>• 基础养老金会根据社会平均工资和物价水平定期调整</li>
                      <li>• 建议结合其他养老规划工具进行综合考虑</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 返回首页 */}
          <motion.div variants={itemVariants} className="text-center mt-8">
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

export default PensionCalculatorPage;