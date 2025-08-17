'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Star, History, User, Clock, Calculator, Type } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const HomePage = () => {
  const features = [
    {
      icon: Calendar,
      title: '八字排盘',
      description: '基于真太阳时的精准八字计算，传承千年命理智慧',
      href: '/bazi',
      color: 'from-gold-500 to-gold-600',
    },
    {
      icon: Type,
      title: 'AI取名',
      description: 'AI智能取名，结合五行八字，为您推荐吉祥好名',
      href: '/naming',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Star,
      title: '命理分析',
      description: 'AI智能分析结合传统理论，深度解读人生运势',
      href: '/analysis',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: Clock,
      title: '多久退休',
      description: '精确计算距离退休的时间，合理规划人生后半程',
      href: '/retirement-countdown',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Calculator,
      title: '退休金计算',
      description: '智能预测退休金数额，提前做好财务规划',
      href: '/pension-calculator',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: History,
      title: '历史记录',
      description: '保存您的算命记录，随时查看命理变化轨迹',
      href: '/history',
      color: 'from-ancient-blue to-primary-700',
    },
    {
      icon: User,
      title: '个人中心',
      description: '管理个人信息，定制专属的命理服务体验',
      href: '/profile',
      color: 'from-gold-600 to-ancient-bronze',
    },
  ];

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
        {/* 英雄区域 */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="title-ancient text-5xl md:text-7xl font-bold mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            天机算命
          </motion.h1>
          
          <motion.p
            className="text-gold-500/80 text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            传承千年易学智慧，融合现代AI技术
            <br />
            为您揭示命运奥秘，指引人生方向
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/bazi" className="btn-gold text-lg px-8 py-4">
              开始算命
            </Link>
            {/* <Link href="/about" className="btn-ancient text-lg px-8 py-4">
              了解更多
            </Link> */}
          </motion.div>
        </motion.section>

        {/* 功能特色 */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="title-ancient text-3xl md:text-4xl font-bold text-center mb-12"
          >
            核心功能
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="card-ancient p-6 text-center group cursor-pointer"
                >
                  <Link href={feature.href} className="block">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:animate-glow transition-all duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-ancient-ink mb-3 group-hover:text-primary-700 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-ancient-ink/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* 特色介绍 */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="card-ancient p-8 md:p-12 text-center"
        >
          <h2 className="title-ancient text-3xl md:text-4xl font-bold mb-8">
            为什么选择天机算命？
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-gold rounded-full flex items-center justify-center">
                <span className="text-primary-900 font-bold text-xl">精</span>
              </div>
              <h3 className="text-xl font-semibold text-ancient-ink mb-2">精准计算</h3>
              <p className="text-ancient-ink/70 text-sm">
                基于真太阳时的精确计算，确保八字排盘的准确性
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-gold rounded-full flex items-center justify-center">
                <span className="text-primary-900 font-bold text-xl">智</span>
              </div>
              <h3 className="text-xl font-semibold text-ancient-ink mb-2">AI智能</h3>
              <p className="text-ancient-ink/70 text-sm">
                结合人工智能技术，提供深度的命理分析和解读
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-gold rounded-full flex items-center justify-center">
                <span className="text-primary-900 font-bold text-xl">承</span>
              </div>
              <h3 className="text-xl font-semibold text-ancient-ink mb-2">传统传承</h3>
              <p className="text-ancient-ink/70 text-sm">
                严格遵循传统命理理论，传承千年易学文化精髓
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default HomePage;