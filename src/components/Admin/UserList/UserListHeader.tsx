import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface UserListHeaderProps {
  selectedCount: number;
  onAddUser: () => void;
  onShowDeleteConfirmation: () => void;
  onSearch: (value: string) => void;
  searchValue: string;
}

export function UserListHeader({ 
  selectedCount, 
  onAddUser, 
  onShowDeleteConfirmation,
  onSearch,
  searchValue
}: UserListHeaderProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onAddUser}
          className="bg-[#865df6] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#7147f5] transition-colors"
        >
          <Plus size={20} />
          <span>Добавить пользователя</span>
        </button>
        
        {selectedCount > 0 && (
          <button
            onClick={onShowDeleteConfirmation}
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
          >
            <Trash2 size={20} />
            <span>Удалить выбранных ({selectedCount})</span>
          </button>
        )}
      </div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Поиск пользователей..."
          className="w-full pl-4 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#865df6] focus:border-transparent"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </div>
  );
}