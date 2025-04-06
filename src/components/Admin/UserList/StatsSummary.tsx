import React from 'react';
import { Users, UserPlus, CheckCircle, Gift, RefreshCw } from 'lucide-react';

interface StatsSummaryProps {
  totalUsers: number;
  totalReferrals: number;
  taskStats: {
    quiz: number;
    keyword: number;
    telegram: number;
  };
  totalPrizes: number;
  repeatParticipants: number;
}

export function StatsSummary({ 
  totalUsers, 
  totalReferrals, 
  taskStats, 
  totalPrizes,
  repeatParticipants 
}: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Всего пользователей</p>
            <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          </div>
          <div className="w-12 h-12 bg-[#865df6] bg-opacity-10 rounded-full flex items-center justify-center">
            <Users className="text-[#865df6]" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Повторные участники</p>
            <p className="text-2xl font-bold text-gray-900">{repeatParticipants}</p>
          </div>
          <div className="w-12 h-12 bg-[#865df6] bg-opacity-10 rounded-full flex items-center justify-center">
            <RefreshCw className="text-[#865df6]" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Всего рефералов</p>
            <p className="text-2xl font-bold text-gray-900">{totalReferrals}</p>
          </div>
          <div className="w-12 h-12 bg-[#865df6] bg-opacity-10 rounded-full flex items-center justify-center">
            <UserPlus className="text-[#865df6]" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Выполнено заданий</p>
            <p className="text-2xl font-bold text-gray-900">
              {taskStats.quiz + taskStats.keyword + taskStats.telegram}
            </p>
            <div className="flex items-center mt-1 space-x-2 text-xs text-gray-500">
              <span>Тест: {taskStats.quiz}</span>
              <span>•</span>
              <span>Слово: {taskStats.keyword}</span>
              <span>•</span>
              <span>TG: {taskStats.telegram}</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-[#865df6] bg-opacity-10 rounded-full flex items-center justify-center">
            <CheckCircle className="text-[#865df6]" size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Обменено призов</p>
            <p className="text-2xl font-bold text-gray-900">{totalPrizes}</p>
          </div>
          <div className="w-12 h-12 bg-[#865df6] bg-opacity-10 rounded-full flex items-center justify-center">
            <Gift className="text-[#865df6]" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}