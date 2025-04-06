import React, { useState } from 'react';
import { Users, Link2, BarChart } from 'lucide-react';
import { UsersTab } from './UsersTab';
import { ReferralsTab } from './ReferralsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { MonthSelector } from './MonthSelector';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'referrals' | 'analytics'>('users');
  const [selectedMonth] = useState<Date>(new Date(2025, 3)); // April 2025

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">Панель администратора</h1>
        </div>

        <MonthSelector
          selectedMonth={selectedMonth}
          onMonthChange={() => {}} // No-op since we only show April
        />
        
        <div className="flex justify-center border-t">
          <div className="flex max-w-md w-full">
            <button
              className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center space-x-2 ${
                activeTab === 'users'
                  ? 'text-[#865df6] border-b-2 border-[#865df6]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              <span>Пользователи</span>
            </button>
            <button
              className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center space-x-2 ${
                activeTab === 'referrals'
                  ? 'text-[#865df6] border-b-2 border-[#865df6]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('referrals')}
            >
              <Link2 size={18} />
              <span>Рефералы</span>
            </button>
            <button
              className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center space-x-2 ${
                activeTab === 'analytics'
                  ? 'text-[#865df6] border-b-2 border-[#865df6]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart size={18} />
              <span>Аналитика</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6">
        {activeTab === 'users' && <UsersTab selectedMonth={selectedMonth} />}
        {activeTab === 'referrals' && <ReferralsTab selectedMonth={selectedMonth} />}
        {activeTab === 'analytics' && <AnalyticsTab selectedMonth={selectedMonth} />}
      </div>
    </div>
  );
}