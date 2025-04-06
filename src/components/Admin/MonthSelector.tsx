import React from 'react';
import { Calendar } from 'lucide-react';

interface MonthSelectorProps {
  selectedMonth: Date;
  onMonthChange: (month: Date) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  // Generate list of months starting from March 2025
  const months: Date[] = [];
  const startDate = new Date(2025, 2); // March 2025 (months are 0-based)
  const endDate = new Date(2025, 3); // April 2025
  
  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    months.push(new Date(d));
  }

  const formatMonth = (date: Date) => {
    return date.toLocaleString('ru-RU', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white p-4 border-b">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 flex-shrink-0">
          <Calendar className="text-[#865df6]" size={24} />
          <span className="font-medium">Выберите месяц:</span>
        </div>
        <div className="w-full overflow-x-auto scrollbar-hide">
          <div className="flex justify-between min-w-full px-4">
            {months.map((month) => (
              <button
                key={month.toISOString()}
                onClick={() => onMonthChange(month)}
                className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap mx-1 ${
                  month.getMonth() === selectedMonth.getMonth() &&
                  month.getFullYear() === selectedMonth.getFullYear()
                    ? 'bg-[#865df6] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formatMonth(month)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}