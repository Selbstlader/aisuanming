'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: '功能导航',
      links: [
        { href: '/bazi', label: '八字排盘' },
        { href: '/analysis', label: '命理分析' },
        { href: '/history', label: '历史记录' },
      ],
    },
    {
      title: '用户中心',
      links: [
        { href: '/profile', label: '个人资料' },
        { href: '/auth/login', label: '登录' },
        { href: '/auth/register', label: '注册' },
      ],
    },
    {
      title: '关于我们',
      links: [
        { href: '/about', label: '关于网站' },
        { href: '/privacy', label: '隐私政策' },
        { href: '/terms', label: '使用条款' },
      ],
    },
  ];

  return (
    <footer className="bg-gradient-ancient border-t border-gold-500/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="w-10 h-10 bg-gradient-gold rounded-full flex items-center justify-center">
                <span className="text-primary-900 font-bold text-lg">易</span>
              </div>
              <span className="title-ancient text-xl font-bold">
                天机算命
              </span>
            </motion.div>
            <p className="text-gold-500/80 text-sm leading-relaxed mb-4">
              传承千年易学智慧，融合现代科技力量，为您提供专业的命理分析服务。
            </p>
            <div className="text-gold-500/60 text-xs">
              <p>基于传统八字理论</p>
              <p>结合真太阳时计算</p>
              <p>AI智能分析辅助</p>
            </div>
          </div>

          {/* 链接区域 */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="md:col-span-1"
            >
              <h3 className="text-gold-500 font-semibold mb-4 text-sm">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gold-500/70 hover:text-gold-400 transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* 分割线 */}
        <div className="border-t border-gold-500/20 my-8"></div>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="text-gold-500/60 text-sm">
            <p>© {currentYear} 天机算命. 保留所有权利.</p>
          </div>
          
          <div className="flex items-center space-x-6 text-xs text-gold-500/60">
            <span>技术支持: Next.js + Supabase</span>
            <span>•</span>
            <span>AI 驱动: DeepSeek</span>
          </div>
        </motion.div>

        {/* 装饰性元素 */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-gold opacity-30 rounded-full"></div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 bagua-bg opacity-5 pointer-events-none"></div>
    </footer>
  );
};

export default Footer;