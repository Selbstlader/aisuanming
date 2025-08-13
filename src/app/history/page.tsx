'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Calendar, Trash2, Eye, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface RecordsResponse {
  success: boolean;
  data: {
    records: BaziRecord[];
    pagination: PaginationInfo;
  };
  error?: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [records, setRecords] = useState<BaziRecord[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 检查用户认证状态
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // 加载记录列表
  const loadRecords = async (page: number = 1, search: string = searchTerm) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search,
        sortBy,
        sortOrder
      });

      // 获取认证token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('用户未认证，请重新登录');
        router.push('/auth/login');
        return;
      }

      const response = await fetch(`/api/bazi/records?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: RecordsResponse = await response.json();

      if (data.success) {
        setRecords(data.data.records);
        setPagination(data.data.pagination);
      } else {
        toast.error(data.error || '加载记录失败');
      }
    } catch (error) {
      console.error('加载记录失败:', error);
      toast.error('加载记录失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 删除记录
  const deleteRecord = async (id: string) => {
    if (!confirm('确定要删除这条记录吗？此操作不可恢复。')) {
      return;
    }

    try {
      setDeletingId(id);
      
      // 获取认证token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        toast.error('用户未认证，请重新登录');
        router.push('/auth/login');
        return;
      }

      const response = await fetch('/api/bazi/records', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('记录删除成功');
        // 重新加载当前页
        loadRecords(pagination.page);
      } else {
        toast.error(data.error || '删除记录失败');
      }
    } catch (error) {
      console.error('删除记录失败:', error);
      toast.error('删除记录失败');
    } finally {
      setDeletingId(null);
    }
  };

  // 查看记录详情
  const viewRecord = (id: string) => {
    router.push(`/record/${id}`);
  };

  // 搜索处理
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRecords(1, searchTerm);
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      loadRecords(newPage);
    }
  };

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

  // 初始加载
  useEffect(() => {
    if (user && !loading) {
      loadRecords();
    }
  }, [user, loading, sortBy, sortOrder]);

  // 如果正在加载认证状态或用户未认证，显示加载界面
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">八字记录历史</h1>
          <p className="text-amber-700">管理您的所有八字排盘记录</p>
        </div>

        {/* 操作栏 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索姓名或出生地点..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* 排序选择 */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="created_at">创建时间</option>
                <option value="name">姓名</option>
                <option value="birth_date">出生日期</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="desc">降序</option>
                <option value="asc">升序</option>
              </select>
            </div>

            {/* 新建按钮 */}
            <button
              onClick={() => router.push('/bazi')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-md"
            >
              <Plus className="w-4 h-4" />
              新建排盘
            </button>
          </div>
        </div>

        {/* 记录列表 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <span className="ml-2 text-amber-700">加载中...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-900 mb-2">暂无记录</h3>
              <p className="text-amber-600 mb-4">您还没有创建任何八字记录</p>
              <button
                onClick={() => router.push('/bazi')}
                className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
              >
                立即创建
              </button>
            </div>
          ) : (
            <>
              {/* 表格头部 */}
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-amber-900">
                  <div className="col-span-2">姓名</div>
                  <div className="col-span-2">出生日期</div>
                  <div className="col-span-1">时间</div>
                  <div className="col-span-2">出生地点</div>
                  <div className="col-span-1">性别</div>
                  <div className="col-span-2">创建时间</div>
                  <div className="col-span-2">操作</div>
                </div>
              </div>

              {/* 记录列表 */}
              <div className="divide-y divide-amber-100">
                {records.map((record) => (
                  <div key={record.id} className="px-6 py-4 hover:bg-amber-50/50 transition-colors">
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-2 font-medium text-amber-900">
                        {record.name}
                      </div>
                      <div className="col-span-2 text-amber-700">
                        {formatDate(record.birth_date)}
                      </div>
                      <div className="col-span-1 text-amber-700">
                        {formatTime(record.birth_time)}
                      </div>
                      <div className="col-span-2 text-amber-700 truncate" title={record.birth_location}>
                        {record.birth_location}
                      </div>
                      <div className="col-span-1 text-amber-700">
                        {record.gender === 'male' ? '男' : '女'}
                      </div>
                      <div className="col-span-2 text-amber-600">
                        {formatDate(record.created_at)}
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <button
                          onClick={() => viewRecord(record.id)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                          查看
                        </button>
                        <button
                          onClick={() => deleteRecord(record.id)}
                          disabled={deletingId === record.id}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                          title="删除记录"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === record.id ? '删除中...' : '删除'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 分页 */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-amber-700">
              共 {pagination.total} 条记录，第 {pagination.page} / {pagination.totalPages} 页
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-amber-200 rounded-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                上一页
              </button>
              
              {/* 页码按钮 */}
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        pageNum === pagination.page
                          ? 'bg-amber-600 text-white'
                          : 'bg-white border border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-white border border-amber-200 rounded-lg hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}