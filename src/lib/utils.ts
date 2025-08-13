import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TianGan, DiZhi, Wuxing, WuxingAnalysis, BirthInfo, BaziResult } from '@/types';

// Tailwind CSS类名合并工具
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 天干数组
export const TIAN_GAN: TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 地支数组
export const DI_ZHI: DiZhi[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行数组
export const WU_XING: Wuxing[] = ['木', '火', '土', '金', '水'];

// 天干对应五行
export const TIAN_GAN_WU_XING: Record<TianGan, Wuxing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 地支对应五行
export const DI_ZHI_WU_XING: Record<DiZhi, Wuxing> = {
  '子': '水', '亥': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '申': '金', '酉': '金',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
};

// 时辰对应地支
export const HOUR_TO_DI_ZHI: Record<number, DiZhi> = {
  23: '子', 0: '子', 1: '丑', 2: '丑',
  3: '寅', 4: '寅', 5: '卯', 6: '卯',
  7: '辰', 8: '辰', 9: '巳', 10: '巳',
  11: '午', 12: '午', 13: '未', 14: '未',
  15: '申', 16: '申', 17: '酉', 18: '酉',
  19: '戌', 20: '戌', 21: '亥', 22: '亥',
};

/**
 * 计算真太阳时
 * @param localTime 当地时间
 * @param longitude 经度
 * @returns 真太阳时
 */
export function calculateRealSolarTime(localTime: Date, longitude: number): Date {
  // 简化的真太阳时计算
  // 实际应用中需要更复杂的天文算法
  const timeOffset = (longitude - 120) * 4; // 以东经120度为基准
  const realSolarTime = new Date(localTime.getTime() + timeOffset * 60 * 1000);
  return realSolarTime;
}

/**
 * 根据年份获取天干
 * @param year 年份
 * @returns 天干
 */
export function getYearTianGan(year: number): TianGan {
  // 以1984年甲子年为基准
  const baseYear = 1984;
  const index = (year - baseYear) % 10;
  return TIAN_GAN[index >= 0 ? index : index + 10];
}

/**
 * 根据年份获取地支
 * @param year 年份
 * @returns 地支
 */
export function getYearDiZhi(year: number): DiZhi {
  // 以1984年甲子年为基准
  const baseYear = 1984;
  const index = (year - baseYear) % 12;
  return DI_ZHI[index >= 0 ? index : index + 12];
}

/**
 * 根据月份和年份获取月柱
 * @param year 年份
 * @param month 月份 (1-12)
 * @returns 月柱天干地支
 */
export function getMonthPillar(year: number, month: number): string {
  // 简化的月柱计算
  // 实际需要考虑节气
  const monthDiZhi = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const yearTianGanIndex = TIAN_GAN.indexOf(getYearTianGan(year));
  const monthTianGanIndex = (yearTianGanIndex * 2 + month - 1) % 10;
  
  return TIAN_GAN[monthTianGanIndex] + monthDiZhi[month - 1];
}

/**
 * 根据日期获取日柱
 * @param date 日期
 * @returns 日柱天干地支
 */
export function getDayPillar(date: Date): string {
  // 使用公历日期计算日柱
  // 以1900年1月1日甲戌日为基准
  const baseDate = new Date(1900, 0, 1);
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // 1900年1月1日是甲戌日，甲=0，戌=10
  const tianGanIndex = (daysDiff + 0) % 10;
  const diZhiIndex = (daysDiff + 10) % 12;
  
  return TIAN_GAN[tianGanIndex >= 0 ? tianGanIndex : tianGanIndex + 10] + 
         DI_ZHI[diZhiIndex >= 0 ? diZhiIndex : diZhiIndex + 12];
}

/**
 * 根据时间获取时柱
 * @param hour 小时 (0-23)
 * @param dayTianGan 日柱天干
 * @returns 时柱天干地支
 */
export function getHourPillar(hour: number, dayTianGan: TianGan): string {
  const hourDiZhi = HOUR_TO_DI_ZHI[hour] || '子';
  
  // 根据日干推算时干
  const dayTianGanIndex = TIAN_GAN.indexOf(dayTianGan);
  const hourDiZhiIndex = DI_ZHI.indexOf(hourDiZhi);
  const hourTianGanIndex = (dayTianGanIndex * 2 + hourDiZhiIndex) % 10;
  
  return TIAN_GAN[hourTianGanIndex] + hourDiZhi;
}

/**
 * 计算八字
 * @param birthInfo 出生信息
 * @param useRealSolarTime 是否使用真太阳时
 * @returns 八字结果
 */
export function calculateBazi(
  birthInfo: BirthInfo,
  useRealSolarTime: boolean = true
): BaziResult {
  const dateTime = new Date(birthInfo.year, birthInfo.month - 1, birthInfo.day, birthInfo.hour, birthInfo.minute);
  
  // 如果使用真太阳时，需要调整时间
  const adjustedTime = useRealSolarTime 
    ? calculateRealSolarTime(dateTime, birthInfo.location.longitude)
    : dateTime;
  
  const year = adjustedTime.getFullYear();
  const month = adjustedTime.getMonth() + 1;
  const hour = adjustedTime.getHours();
  
  // 计算四柱
  const yearPillarStr = getYearTianGan(year) + getYearDiZhi(year);
  const monthPillarStr = getMonthPillar(year, month);
  const dayPillarStr = getDayPillar(adjustedTime);
  const hourPillarStr = getHourPillar(hour, dayPillarStr[0] as TianGan);
  
  // 解析四柱为天干地支对象
  const yearPillar = {
    heavenlyStem: yearPillarStr[0] as TianGan,
    earthlyBranch: yearPillarStr[1] as DiZhi
  };
  const monthPillar = {
    heavenlyStem: monthPillarStr[0] as TianGan,
    earthlyBranch: monthPillarStr[1] as DiZhi
  };
  const dayPillar = {
    heavenlyStem: dayPillarStr[0] as TianGan,
    earthlyBranch: dayPillarStr[1] as DiZhi
  };
  const hourPillar = {
    heavenlyStem: hourPillarStr[0] as TianGan,
    earthlyBranch: hourPillarStr[1] as DiZhi
  };
  
  // 计算五行分析
  const wuxingAnalysis = analyzeWuxingFromPillars({
    yearPillar: yearPillarStr,
    monthPillar: monthPillarStr,
    dayPillar: dayPillarStr,
    hourPillar: hourPillarStr
  });
  
  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    solarTime: adjustedTime,
    wuxingAnalysis: {
      counts: {
        木: wuxingAnalysis.wood,
        火: wuxingAnalysis.fire,
        土: wuxingAnalysis.earth,
        金: wuxingAnalysis.metal,
        水: wuxingAnalysis.water
      },
      dominant: [wuxingAnalysis.dominant] as Wuxing[],
      missing: wuxingAnalysis.lacking as Wuxing[],
      balanceScore: wuxingAnalysis.balance_score
    }
  };
}

/**
 * 分析五行
 * @param bazi 八字四柱
 * @returns 五行分析结果
 */
export function analyzeWuxingFromPillars(bazi: {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
}): WuxingAnalysis {
  const wuxingCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  
  // 统计天干地支的五行
  [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.hourPillar].forEach(pillar => {
    const tianGan = pillar[0] as TianGan;
    const diZhi = pillar[1] as DiZhi;
    
    wuxingCount[TIAN_GAN_WU_XING[tianGan]]++;
    wuxingCount[DI_ZHI_WU_XING[diZhi]]++;
  });
  
  // 找出最强和缺失的五行
  const maxCount = Math.max(...Object.values(wuxingCount));
  const dominant = Object.keys(wuxingCount).find(key => wuxingCount[key as Wuxing] === maxCount) as Wuxing;
  const lacking = Object.keys(wuxingCount).filter(key => wuxingCount[key as Wuxing] === 0) as Wuxing[];
  
  // 计算平衡分数 (简化算法)
  const total = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);
  const average = total / 5;
  const variance = Object.values(wuxingCount).reduce((sum, count) => sum + Math.pow(count - average, 2), 0) / 5;
  const balanceScore = Math.max(0, 100 - variance * 10);
  
  return {
    wood: wuxingCount.木,
    fire: wuxingCount.火,
    earth: wuxingCount.土,
    metal: wuxingCount.金,
    water: wuxingCount.水,
    dominant,
    lacking,
    balance_score: Math.round(balanceScore),
  };
}

/**
 * 格式化日期为中文
 * @param date 日期字符串
 * @returns 中文格式日期
 */
export function formatChineseDate(date: string): string {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  
  return `${year}年${month}月${day}日`;
}

/**
 * 格式化时间为中文
 * @param time 时间字符串
 * @returns 中文格式时间
 */
export function formatChineseTime(time: string): string {
  const [hour, minute] = time.split(':');
  return `${hour}时${minute}分`;
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证密码强度
 * @param password 密码
 * @returns 是否符合要求
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

// 保持向后兼容
export const isValidEmail = validateEmail;
export const isValidPassword = validatePassword;

/**
 * 格式化日期时间为中文
 * @param date 日期对象
 * @returns 中文格式日期时间
 */
export function formatChineseDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  return `${year}年${month}月${day}日 ${hour}时${minute}分`;
}