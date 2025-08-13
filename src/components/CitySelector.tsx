'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, MapPin } from 'lucide-react';
import regionData from '../../region.json';
import { getCityCoordinate, CityCoordinate } from '../data/cityCoordinates';

// 地区数据类型定义
interface RegionItem {
  id: string;
  parentId: string;
  children?: RegionItem[];
  hasChildren: boolean;
  label: string;
  key: string;
  value: string;
}

// 选择结果类型
export interface CitySelection {
  province: RegionItem | null;
  city: RegionItem | null;
  district: RegionItem | null;
  coordinates: CityCoordinate | null;
}

// 组件属性类型
interface CitySelectorProps {
  value?: CitySelection;
  onChange?: (selection: CitySelection) => void;
  onCitySelect?: (selection: CitySelection) => void;
  selectedCity?: string;
  placeholder?: string;
  className?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  onCitySelect,
  selectedCity,
  placeholder = '请选择出生地点',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<RegionItem | null>(value?.province || null);
  const [selectedCityState, setSelectedCityState] = useState<RegionItem | null>(value?.city || null);
  const [selectedDistrict, setSelectedDistrict] = useState<RegionItem | null>(value?.district || null);
  const [step, setStep] = useState<'province' | 'city' | 'district'>('province');

  // 获取省份列表
  const provinces = useMemo(() => {
    const data = regionData.data as RegionItem[];
    return data.filter(item => item.parentId === '0' && item.id !== '0');
  }, []);



  // 搜索过滤
  const filteredProvinces = useMemo(() => {
    if (!searchTerm) return provinces;
    return provinces.filter(province =>
      province.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [provinces, searchTerm]);

  const filteredCities = useMemo(() => {
    if (!selectedProvince || !selectedProvince.children) return [];

    const cities = selectedProvince.children;

    if (!searchTerm) return cities;

    return cities.filter(city =>
      city.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedProvince, searchTerm]);

  const filteredDistricts = useMemo(() => {
    if (!selectedCityState || !selectedCityState.children) return [];

    const districts = selectedCityState.children;

    if (!searchTerm) return districts;

    return districts.filter(district =>
      district.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCityState, searchTerm]);

  // 处理省份选择
  const handleProvinceSelect = (province: RegionItem) => {
    setSelectedProvince(province);
    setSelectedCityState(null);
    setSelectedDistrict(null);
    setSearchTerm('');

    if (province.hasChildren) {
      setStep('city');
    } else {
      // 直辖市情况，直接选择城市
      const coordinates = getCityCoordinate(province.id);
      const selection: CitySelection = {
        province,
        city: null,
        district: null,
        coordinates
      };
      onChange?.(selection);
      onCitySelect?.(selection);
      setIsOpen(false);
    }
  };

  // 处理城市选择
  const handleCitySelect = (city: RegionItem) => {
    setSelectedCityState(city);
    setSelectedDistrict(null);
    setSearchTerm('');

    if (city.hasChildren) {
      setStep('district');
    } else {
      // 没有区县，直接完成选择
      const coordinates = getCityCoordinate(city.id);
      const selection: CitySelection = {
        province: selectedProvince,
        city,
        district: null,
        coordinates
      };
      onChange?.(selection);
      onCitySelect?.(selection);
      setIsOpen(false);
    }
  };

  // 处理区县选择
  const handleDistrictSelect = (district: RegionItem) => {
    setSelectedDistrict(district);
    setSearchTerm('');

    // 优先使用区县的坐标，如果没有则使用城市坐标
    let coordinates = getCityCoordinate(district.id);
    if (!coordinates && selectedCityState) {
      coordinates = getCityCoordinate(selectedCityState.id);
    }

    const selection: CitySelection = {
      province: selectedProvince,
      city: selectedCityState,
      district,
      coordinates
    };
    onChange?.(selection);
    onCitySelect?.(selection);
    setIsOpen(false);
  };

  // 返回上一步
  const handleBack = () => {
    if (step === 'district') {
      setStep('city');
      setSelectedDistrict(null);
    } else if (step === 'city') {
      setStep('province');
      setSelectedProvince(null);
      setSelectedCityState(null);
      setSelectedDistrict(null);
    }
    setSearchTerm('');
  };

  // 重置选择
  const handleReset = () => {
    setSelectedProvince(null);
    setSelectedCityState(null);
    setSelectedDistrict(null);
    setStep('province');
    setSearchTerm('');
  };

  // 显示文本
  const displayText = useMemo(() => {
    if (selectedDistrict) {
      return `${selectedProvince?.label} ${selectedCityState?.label} ${selectedDistrict.label}`;
    }
    if (selectedCityState) {
      return `${selectedProvince?.label} ${selectedCityState.label}`;
    }
    if (selectedProvince) {
      return selectedProvince.label;
    }
    return placeholder;
  }, [selectedProvince, selectedCityState, selectedDistrict, placeholder]);

  // 当前显示的列表
  const currentList = useMemo(() => {
    switch (step) {
      case 'province':
        return filteredProvinces;
      case 'city':
        return filteredCities;
      case 'district':
        return filteredDistricts;
      default:
        return [];
    }
  }, [step, filteredProvinces, filteredCities, filteredDistricts]);

  // 当前步骤标题
  const stepTitle = useMemo(() => {
    switch (step) {
      case 'province':
        return '选择省份';
      case 'city':
        return '选择城市';
      case 'district':
        return '选择区县';
      default:
        return '';
    }
  }, [step]);

  return (
    <div className={`relative ${className}`}>
      {/* 选择框 */}
      <div
        className="w-full px-4 py-3 border border-amber-200 rounded-lg bg-amber-50/50 cursor-pointer flex items-center justify-between hover:border-amber-300 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-amber-600" />
          <span className={`${selectedProvince ? 'text-gray-900' : 'text-gray-500'}`}>
            {displayText}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-amber-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* 下拉面板 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-amber-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* 头部 */}
          <div className="p-4 border-b border-amber-100 bg-amber-50/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">{stepTitle}</h3>
              <div className="flex space-x-2">
                {step !== 'province' && (
                  <button
                    onClick={handleBack}
                    className="text-xs text-amber-600 hover:text-amber-700 px-2 py-1 rounded border border-amber-200 hover:bg-amber-50"
                  >
                    返回
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                >
                  重置
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                >
                  关闭
                </button>
              </div>
            </div>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={`搜索${stepTitle.replace('选择', '')}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 列表 */}
          <div className="max-h-60 overflow-y-auto">
            {currentList.length > 0 ? (
              currentList.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                  onClick={() => {
                    if (step === 'province') {
                      handleProvinceSelect(item);
                    } else if (step === 'city') {
                      handleCitySelect(item);
                    } else if (step === 'district') {
                      handleDistrictSelect(item);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{item.label}</span>
                    {item.hasChildren && (
                      <ChevronDown className="w-4 h-4 text-gray-400 -rotate-90" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                {searchTerm ? '未找到匹配的地区' : '暂无数据'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;