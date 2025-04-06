import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

interface FilterCriteria {
  points: { min: string; max: string };
  tasks: { quiz: boolean; keyword: boolean; telegram: boolean };
  taps: { min: string; max: string };
  referrals: { min: string; max: string };
  prizes: { min: string; max: string };
  dates: { start: string; end: string };
  tags: string[];
  participation: {
    repeat: boolean;
    new: boolean;
  };
}

interface FilterPanelProps {
  onFilter: (criteria: FilterCriteria) => void;
  availableTags: string[];
}

const initialCriteria: FilterCriteria = {
  points: { min: '', max: '' },
  tasks: { quiz: false, keyword: false, telegram: false },
  taps: { min: '', max: '' },
  referrals: { min: '', max: '' },
  prizes: { min: '', max: '' },
  dates: { start: '', end: '' },
  tags: [],
  participation: { repeat: false, new: false }
};

export function FilterPanel({ onFilter, availableTags }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [criteria, setCriteria] = useState<FilterCriteria>(initialCriteria);

  const handleChange = (category: keyof FilterCriteria, field: string, value: any) => {
    setCriteria(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' ? {
        ...prev[category],
        [field]: value
      } : value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setCriteria(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleApplyFilter = () => {
    onFilter(criteria);
  };

  const handleReset = () => {
    setCriteria(initialCriteria);
    onFilter(initialCriteria);
  };

  if (!isExpanded) {
    return (
      <div className="px-4 mb-4">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-white border-2 border-[#865df6] text-[#865df6] hover:bg-[#865df6] hover:text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
        >
          <Filter size={20} className="transition-transform group-hover:scale-110" />
          <span className="text-base">Показать фильтры</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Filter size={20} className="mr-2" />
          Фильтры
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Points Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Баллы</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="От"
              value={criteria.points.min}
              onChange={(e) => handleChange('points', 'min', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="До"
              value={criteria.points.max}
              onChange={(e) => handleChange('points', 'max', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Tasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Задания</label>
          <div className="space-x-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={criteria.tasks.quiz}
                onChange={(e) => handleChange('tasks', 'quiz', e.target.checked)}
                className="rounded border-gray-300 text-[#865df6] focus:ring-[#865df6]"
              />
              <span className="ml-1 text-sm">Тест</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={criteria.tasks.keyword}
                onChange={(e) => handleChange('tasks', 'keyword', e.target.checked)}
                className="rounded border-gray-300 text-[#865df6] focus:ring-[#865df6]"
              />
              <span className="ml-1 text-sm">Слово</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={criteria.tasks.telegram}
                onChange={(e) => handleChange('tasks', 'telegram', e.target.checked)}
                className="rounded border-gray-300 text-[#865df6] focus:ring-[#865df6]"
              />
              <span className="ml-1 text-sm">Телеграм</span>
            </label>
          </div>
        </div>

        {/* Taps Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тапы</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="От"
              value={criteria.taps.min}
              onChange={(e) => handleChange('taps', 'min', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="До"
              value={criteria.taps.max}
              onChange={(e) => handleChange('taps', 'max', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Referrals Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Рефералы</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="От"
              value={criteria.referrals.min}
              onChange={(e) => handleChange('referrals', 'min', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="До"
              value={criteria.referrals.max}
              onChange={(e) => handleChange('referrals', 'max', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Prizes Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Призы</label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="От"
              value={criteria.prizes.min}
              onChange={(e) => handleChange('prizes', 'min', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
            <input
              type="number"
              placeholder="До"
              value={criteria.prizes.max}
              onChange={(e) => handleChange('prizes', 'max', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата регистрации</label>
          <div className="flex space-x-2">
            <input
              type="date"
              value={criteria.dates.start}
              onChange={(e) => handleChange('dates', 'start', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
            <input
              type="date"
              value={criteria.dates.end}
              onChange={(e) => handleChange('dates', 'end', e.target.value)}
              className="w-full px-3 py-1.5 border rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Participation Filter */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Участие</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={criteria.participation.new}
              onChange={(e) => handleChange('participation', 'new', e.target.checked)}
              className="rounded border-gray-300 text-[#865df6] focus:ring-[#865df6]"
            />
            <span className="ml-2 text-sm">Новые участники</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={criteria.participation.repeat}
              onChange={(e) => handleChange('participation', 'repeat', e.target.checked)}
              className="rounded border-gray-300 text-[#865df6] focus:ring-[#865df6]"
            />
            <span className="ml-2 text-sm">Повторные участники</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      {availableTags.length > 0 && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Метки</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  criteria.tags.includes(tag)
                    ? 'bg-[#865df6] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Сбросить
        </button>
        <button
          onClick={handleApplyFilter}
          className="bg-[#865df6] text-white px-4 py-2 rounded-lg hover:bg-[#7147f5] transition-colors"
        >
          Применить
        </button>
      </div>
    </div>
  );
}