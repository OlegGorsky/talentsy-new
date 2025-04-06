import React from 'react';
import { UserTableHeader, SortField, SortDirection } from './UserTableHeader';
import { UserRow } from './UserRow';

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

interface UserTableProps {
  users: UserData[];
  selectedUsers: Set<string>;
  onSelectUser: (userId: string) => void;
  onSelectAll: () => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onEditPoints: (user: UserData) => void;
  onManageTasks: (user: UserData) => void;
  onManagePrizes: (user: UserData) => void;
  onManageReferrals: (user: UserData) => void;
  onDeleteUser: (user: UserData) => void;
}

export function UserTable({
  users,
  selectedUsers,
  onSelectUser,
  onSelectAll,
  sortField,
  sortDirection,
  onSort,
  onEditPoints,
  onManageTasks,
  onManagePrizes,
  onManageReferrals,
  onDeleteUser
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <UserTableHeader
          onSelectAll={onSelectAll}
          allSelected={selectedUsers.size === users.length}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={onSort}
        />
        <tbody className="divide-y divide-gray-100">
          {users.map((user, index) => (
            <UserRow
              key={user.id}
              user={user}
              isSelected={selectedUsers.has(user.telegram_id)}
              onSelect={onSelectUser}
              onEditPoints={onEditPoints}
              onManageTasks={onManageTasks}
              onManagePrizes={onManagePrizes}
              onManageReferrals={onManageReferrals}
              onDelete={onDeleteUser}
              rowIndex={index}
              isTopFive={sortField === 'points' && sortDirection === 'desc'}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}