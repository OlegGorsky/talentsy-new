import React, { useState } from 'react';
import { UserTable } from './UserTable';
import { UserListHeader } from './UserListHeader';
import { FilterPanel } from './FilterPanel';
import { StatsSummary } from './StatsSummary';
import { AddUserModal } from './AddUserModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { TaskManagementModal } from '../TaskManagementModal';
import { PrizeManagementModal } from '../PrizeManagementModal';
import { ReferralsModal } from '../ReferralsModal';
import { PointsEditModal } from '../PointsEditModal';
import { useUserData } from '../../../hooks/useUserData';
import { useUserActions } from '../../../hooks/useUserActions';
import { useUserSort } from '../../../hooks/useUserSort';

interface UserListContainerProps {
  selectedMonth: Date;
}

export function UserListContainer({ selectedMonth }: UserListContainerProps) {
  const { users, loading, stats, availableTags, getTableName, fetchUsers } = useUserData(selectedMonth);
  const { addUser, deleteUsers, updatePoints, deleteUser } = useUserActions();
  const { sortField, sortDirection, sortUsers, handleSort } = useUserSort();

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUserForTasks, setSelectedUserForTasks] = useState<any>(null);
  const [selectedUserForPrizes, setSelectedUserForPrizes] = useState<any>(null);
  const [selectedUserForReferrals, setSelectedUserForReferrals] = useState<any>(null);
  const [selectedUserForPoints, setSelectedUserForPoints] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    telegram_id: '',
    first_name: '',
    username: '',
    points: 0
  });

  const handleAddUser = async () => {
    try {
      await addUser(newUser, getTableName('users'));
      setShowAddUser(false);
      setNewUser({ telegram_id: '', first_name: '', username: '', points: 0 });
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Ошибка при добавлении пользователя');
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteUsers(Array.from(selectedUsers), getTableName('users'));
      setSelectedUsers(new Set());
      setShowDeleteConfirmation(false);
      fetchUsers();
    } catch (error) {
      console.error('Error during bulk deletion:', error);
      alert('Ошибка при удалении пользователей');
    }
  };

  const handleUpdatePoints = async (userId: string, newPoints: number) => {
    try {
      await updatePoints(userId, newPoints, getTableName('users'));
      fetchUsers();
    } catch (error) {
      console.error('Error updating points:', error);
      throw error;
    }
  };

  const searchedUsers = filteredUsers.filter(user => 
    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.telegram_id.includes(search)
  );

  const sortedUsers = sortUsers(searchedUsers);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-2 border-[#865df6] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 mt-2">Загрузка пользователей...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <UserListHeader
        selectedCount={selectedUsers.size}
        onAddUser={() => setShowAddUser(true)}
        onShowDeleteConfirmation={() => setShowDeleteConfirmation(true)}
        onSearch={setSearch}
        searchValue={search}
      />

      <div className="px-4">
        <StatsSummary {...stats} />
      </div>

      <FilterPanel
        onFilter={() => {}}
        availableTags={availableTags}
      />

      <UserTable
        users={sortedUsers}
        selectedUsers={selectedUsers}
        onSelectUser={(userId) => {
          setSelectedUsers(prev => {
            const newSet = new Set(prev);
            if (newSet.has(userId)) {
              newSet.delete(userId);
            } else {
              newSet.add(userId);
            }
            return newSet;
          });
        }}
        onSelectAll={() => {
          if (selectedUsers.size === users.length) {
            setSelectedUsers(new Set());
          } else {
            setSelectedUsers(new Set(users.map(user => user.telegram_id)));
          }
        }}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onEditPoints={setSelectedUserForPoints}
        onManageTasks={setSelectedUserForTasks}
        onManagePrizes={setSelectedUserForPrizes}
        onManageReferrals={setSelectedUserForReferrals}
        onDeleteUser={async (user) => {
          if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            await deleteUser(user.telegram_id, getTableName('users'));
            fetchUsers();
          }
        }}
      />

      {showAddUser && (
        <AddUserModal
          user={newUser}
          onChange={setNewUser}
          onSubmit={handleAddUser}
          onClose={() => setShowAddUser(false)}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          selectedCount={selectedUsers.size}
          onConfirm={handleDeleteSelected}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}

      {selectedUserForTasks && (
        <TaskManagementModal
          user={selectedUserForTasks}
          onClose={() => setSelectedUserForTasks(null)}
          onRefresh={fetchUsers}
          selectedMonth={selectedMonth}
        />
      )}

      {selectedUserForPrizes && (
        <PrizeManagementModal
          user={selectedUserForPrizes}
          onClose={() => setSelectedUserForPrizes(null)}
          onRefresh={fetchUsers}
          selectedMonth={selectedMonth}
        />
      )}

      {selectedUserForReferrals && (
        <ReferralsModal
          user={selectedUserForReferrals}
          onClose={() => setSelectedUserForReferrals(null)}
          selectedMonth={selectedMonth}
        />
      )}

      {selectedUserForPoints && (
        <PointsEditModal
          user={selectedUserForPoints}
          onClose={() => setSelectedUserForPoints(null)}
          onSave={handleUpdatePoints}
        />
      )}
    </div>
  );
}