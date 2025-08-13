'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-950 via-primary-900 to-ancient-blue">
      {/* 背景装饰 */}
      <div className="fixed inset-0 bagua-bg opacity-5 pointer-events-none" />
      
      {/* 主要内容区域 */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className={`flex-1 ${className}`}>
          {children}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;