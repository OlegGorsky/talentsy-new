import { useState } from 'react';
import { SortField, SortDirection } from '../components/Admin/UserList/UserTableHeader';

interface UserData {
  id: string;
  telegram_id: string;
  first_name: string;
  points: number;
  total_taps?: number;
  quiz_completed: boolean;
  keyword_completed: boolean;
  telegram_subscribed: boolean;
  referral_count: number;
  prize_exchanges: any[];
  start_data?: any;
  created_at: string;
}

export function useUserSort(initialField: SortField = 'points', initialDirection: SortDirection = 'desc') {
  const [sortField, setSortField] = useState<SortField>(initialField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  const sortUsers = (users: UserData[]) => {
    if (!sortField) return users;

    return [...users].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'first_name':
          comparison = a.first_name.localeCompare(b.first_name);
          break;
        case 'taps':
          comparison = (a.total_taps || 0) - (b.total_taps || 0);
          break;
        case 'points':
          comparison = a.points - b.points;
          break;
        case 'tasks':
          const tasksA = Number(a.quiz_completed) + Number(a.keyword_completed) + Number(a.telegram_subscribed);
          const tasksB = Number(b.quiz_completed) + Number(b.keyword_completed) + Number(b.telegram_subscribed);
          comparison = tasksA - tasksB;
          break;
        case 'referral_count':
          comparison = a.referral_count - b.referral_count;
          break;
        case 'prize_count':
          comparison = a.prize_exchanges.length - b.prize_exchanges.length;
          break;
        case 'start_data':
          const tagA = a.start_data?.source || '';
          const tagB = b.start_data?.source || '';
          comparison = tagA.localeCompare(tagB);
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return {
    sortField,
    sortDirection,
    sortUsers,
    handleSort
  };
}