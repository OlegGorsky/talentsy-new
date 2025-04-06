import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export type SortField = 'first_name' | 'points' | 'taps' | 'tasks' | 'referral_count' | 'prize_count' | 'created_at' | 'start_data';
export type SortDirection = 'asc' | 'desc';

interface SortButtonProps {
  field: SortField;
  currentField: SortField | null;
  direction: SortDirection;
  onClick: () => void;
  label: string;
}

function SortButton({ field, currentField, direction, onClick, label }: SortButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-1 group"
    >
      <span>{label}</span>
      <span className="text-gray-400 group-hover:text-gray-600">
        {field === currentField ? (
          direction === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />
        ) : (
          <ArrowUpDown size={16} />
        )}
      </span>
    </button>
  );
}

interface UserTableHeaderProps {
  onSelectAll: () => void;
  allSelected: boolean;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export function UserTableHeader({ 
  onSelectAll, 
  allSelected,
  sortField,
  sortDirection,
  onSort
}: UserTableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-50">
        <th className="px-4 py-3 text-left">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onSelectAll}
            className="rounded border-gray-300 text-[#865df6] focus:ring-[#865df6]"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="first_name"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('first_name')}
            label="Пользователь"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="taps"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('taps')}
            label="Всего тапов"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="points"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('points')}
            label="Баллы"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="tasks"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('tasks')}
            label="Задания"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="referral_count"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('referral_count')}
            label="Рефералы"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="prize_count"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('prize_count')}
            label="Призы"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="start_data"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('start_data')}
            label="Метка"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
          <SortButton
            field="created_at"
            currentField={sortField}
            direction={sortDirection}
            onClick={() => onSort('created_at')}
            label="Регистрация"
          />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
      </tr>
    </thead>
  );
}