'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
 
interface NavbarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    navItems: string[];
    username: string;
    classInfo: string;
  }

const navItems = ['首页', '考试中心', '考试记录', '错题集']
  
  const Navbar: React.FC<NavbarProps> = ({ 
    activeTab, 
    setActiveTab, 
    navItems,
    username,
    classInfo 
  }) => {
    const router = useRouter();
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">

              <div className="flex-shrink-0 flex items-center">
                <div className="text-white font-bold text-xl px-3 py-2 rounded-md">
                <img 
                  src="/img/logo.png" // 修改为 public 目录下的路径
                  className="h-10 rounded-xl border-gray-200 object-cover"
                  alt="用户头像"
                />
                </div>

                <span className="ml-2 text-xl font-semibold text-gray-800">考试系统</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveTab(item);
                      switch(item) {
                        case '考试中心':
                          router.push('/Index');
                          break;
                        case '考试记录':
                          router.push('/ExamRecord');
                          break;
                        // 其他导航项可在此扩展
                        default:
                          break;
                      }
                    }}
                    className={`${
                      activeTab === item
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {/*动态用户信息*/}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src="/img/奶农.png" // 修改为 public 目录下的路径
                  className="w-10 h-10 rounded-xl border-2 border-gray-200 object-cover"
                  alt="用户头像"
                />
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700">{username}</div>
                <div className="text-xs text-gray-500">{classInfo}</div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;