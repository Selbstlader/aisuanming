// 用户相关类型定义
export interface User {
  id: string;
  email: string;
  name: string;
  gender: 'male' | 'female';
  membership_type: 'basic' | 'vip' | 'premium';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// 出生地点信息
export interface BirthPlace {
  longitude: number;
  latitude: number;
  timezone: number; // 修复：使用数字表示时区偏移
  address?: string;
}

// 八字记录类型
export interface BaziRecord {
  id: string;
  user_id?: string;
  name: string;
  gender: 'male' | 'female';
  birth_date: string;
  birth_time: string;
  birth_place: BirthPlace;
  year_pillar: string;
  month_pillar: string;
  day_pillar: string;
  hour_pillar: string;
  wuxing_analysis: WuxingAnalysis;
  use_real_solar_time: boolean;
  real_solar_time?: string;
  created_at: string;
}

// 五行分析结果
export interface WuxingAnalysis {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
  dominant: string;
  lacking: string[];
  balance_score: number;
}

// AI分析结果
export interface AnalysisResult {
  id: string;
  user_id?: string;
  bazi_record_id: string;
  analysis_type: 'basic' | 'detailed' | 'premium';
  analysis_content: AnalysisContent;
  ai_response: string;
  is_favorite: boolean;
  created_at: string;
}

// 分析内容结构
export interface AnalysisContent {
  personality: string;
  career: string;
  wealth: string;
  relationship: string;
  health: string;
  suggestions: string[];
}

// API请求和响应类型
export interface BaziCalculateRequest {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  birthTime: string;
  birthPlace: BirthPlace;
  useRealSolarTime?: boolean;
}

export interface BaziCalculateResponse {
  success: boolean;
  data?: BaziRecord;
  error?: string;
}

export interface AnalysisGenerateRequest {
  baziData: BaziRecord;
  analysisType: 'basic' | 'detailed' | 'premium';
  userInfo: {
    name: string;
    gender: 'male' | 'female';
  };
}

export interface AnalysisGenerateResponse {
  success: boolean;
  analysis?: AnalysisContent;
  error?: string;
}

// 天干地支相关类型
export type TianGan = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type DiZhi = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
export type Wuxing = '木' | '火' | '土' | '金' | '水';

// 出生信息输入类型
export interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: 'male' | 'female';
  location: {
    name: string;
    longitude: number;
    latitude: number;
    timezone: number; // 修复：使用数字表示时区偏移
  };
}

// 八字结果类型
export interface BaziResult {
  yearPillar: {
    heavenlyStem: TianGan;
    earthlyBranch: DiZhi;
  };
  monthPillar: {
    heavenlyStem: TianGan;
    earthlyBranch: DiZhi;
  };
  dayPillar: {
    heavenlyStem: TianGan;
    earthlyBranch: DiZhi;
  };
  hourPillar: {
    heavenlyStem: TianGan;
    earthlyBranch: DiZhi;
  };
  solarTime: Date;
  wuxingAnalysis: {
    counts: Record<Wuxing, number>;
    dominant: Wuxing[];
    missing: Wuxing[];
    balanceScore: number;
  };
  recordId?: string;
}

// 组件Props类型
export interface BaziFormProps {
  onSubmit: (data: BaziCalculateRequest) => void;
  loading?: boolean;
}

export interface AnalysisDisplayProps {
  baziRecord: BaziRecord;
  analysisResult?: AnalysisResult;
  loading?: boolean;
}

export interface HistoryListProps {
  records: BaziRecord[];
  onSelect: (record: BaziRecord) => void;
  loading?: boolean;
}