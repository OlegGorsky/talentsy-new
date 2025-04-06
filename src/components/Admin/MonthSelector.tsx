import React from 'react';
import { Calendar } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  // Only show April 2025
  const month = new Date(2025, 3); // April 2025

  const formatMonth = (date: Date) => {
    return date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white p-4 border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Calendar className="text-[#865df6]" size={24} />
          <span className="font-medium">Текущий месяц:</span>
        </div>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex justify-between min-w-full px-4">
            <button
              className="px-6 py-2 rounded-lg transition-colors whitespace-nowrap mx-1 bg-[#865df6] text-white"
              onClick={() => onMonthChange(month)}
            >
              {formatMonth(month)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}