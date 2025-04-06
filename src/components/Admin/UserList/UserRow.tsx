import React from 'react';
import { User, BookOpen, Gift, Users, X, Pencil } from 'lucide-react';

interface UserData {
  id: string;
  telegram_id: string;
  username?: string;
  avatar_url: string | null;
  first_name: string;
  points: number;
  created_at: string;
  onboarding_completed: boolean;
  keyword_completed: boolean;
  telegram_subscribed: boolean;
  quiz_completed: boolean;
  referral_count: number;
  total_taps?: number;
  start_data?: any;
  is_repeat: boolean;
  prize_exchanges: Array<{
    id: string;
    prize_name: string;
    points_spent: number;
    created_at: string;
  }>;
}

interface UserRowProps {
  user: UserData;
  isSelected: boolean;
  onSelect: (userId: string) => void;
  onEditPoints: (user: UserData) => void;
  onManageTasks: (user: UserData) => void;
  onManagePrizes: (user: UserData) => void;
  onManageReferrals: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  rowIndex: number;
  isTopFive: boolean;
}

export function UserRow({
  user,
  isSelected,
  onSelect,
  onEditPoints,
  onManageTasks,
  onManagePrizes,
  onManageReferrals,
  onDelete,
  rowIndex,
  isTopFive
}: UserRowProps) {
  const getRowStyle = () => {
    if (!isTopFive) return '';
    
    const styles = {
      background: '',
      border: ''
    };

    switch (rowIndex) {
      case 0:
        styles.background = 'bg-yellow-50';
        styles.border = 'border-l-4 border-yellow-400';
        break;
      case 1:
        styles.background = 'bg-gray-50';
        styles.border = 'border-l-4 border-gray-400';
        break;
      case 2:
        styles.background = 'bg-orange-50';
        styles.border = 'border-l-4 border-orange-400';
        break;
      case 3:
        styles.background = 'bg-purple-50';
        styles.border = 'border-l-4 border-purple-400';
        break;
      case 4:
        styles.background = 'bg-blue-50';
        styles.border = 'border-l-4 border-blue-400';
        break;
    }

    return `${styles.background} ${styles.border}`;
  };

  const getStartDataDisplay = () => {
    if (!user.start_data) return 'Нет метки';
    
    try {
      if (typeof user.start_data === 'string') {
        try {
          const parsed = JSON.parse(user.start_data);
          return parsed.source || user.start_data;
        } catch {
          return user.start_data;
        }
      }
      
      if (typeof user.start_data === 'object' && user.start_data.source) {
        return user.start_data.source;
      }
      
      return JSON.stringify(user.start_data);
    } catch (error) {
      console.error('Error parsing start_data:', error);
      return 'Ошибка формата';
    }
  };

  return (
    <tr className={`hover:bg-gray-50 transition-colors ${getRowStyle()}`}>
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(user.telegram_id)}
          className="rounded border-gray-300 text-[#865df6] focus:ring-[#865df6]"
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.first_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={16} className="text-gray-400" />
            </div>
          )}
          <div className="ml-3">
            <div className="font-medium flex items-center">
              {user.first_name}
              {user.is_repeat && (
                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                  Повторный
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {user.username ? `@${user.username}` : 'Нет username'} • ID: {user.telegram_id}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        {user.total_taps || 0}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <span>{user.points.toLocaleString()}</span>
          <button
            onClick={() => onEditPoints(user)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Pencil size={16} />
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onManageTasks(user)}
          className="flex items-center space-x-2 text-[#865df6] hover:text-[#7147f5]"
        >
          <BookOpen size={16} />
          <span className="text-sm">Управлять</span>
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center text-sm">
          <button
            onClick={() => onManageReferrals(user)}
            className="flex items-center text-[#865df6] hover:text-[#7147f5]"
          >
            <Users size={14} className="mr-1" />
            <span>{user.referral_count}</span>
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onManagePrizes(user)}
          className="flex items-center space-x-2 text-[#865df6] hover:text-[#7147f5]"
        >
          <Gift size={16} />
          <span className="text-sm">Управлять</span>
          {user.prize_exchanges.length > 0 && (
            <div className="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-xs text-yellow-700 border-2 border-white">
              {user.prize_exchanges.length}
            </div>
          )}
        </button>
      </td>
      <td className="px-4 py-3 text-sm">
        <div className="max-w-xs truncate text-gray-500" title={getStartDataDisplay()}>
          {getStartDataDisplay()}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onDelete(user)}
          className="p-1 text-gray-400 hover:text-red-600"
        >
          <X size={18} />
        </button>
      </td>
    </tr>
  );
}