import React, { useState, useEffect } from 'react';
import { Users, Search, Trash2, Link } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { UserListHeader } from './UserList/UserListHeader';
import { UserTableHeader, SortField, SortDirection } from './UserList/UserTableHeader';
import { UserRow } from './UserList/UserRow';
import { AddUserModal } from './UserList/AddUserModal';
import { DeleteConfirmationModal } from './UserList/DeleteConfirmationModal';
import { TaskManagementModal } from './TaskManagementModal';
import { PrizeManagementModal } from './PrizeManagementModal';
import { ReferralsModal } from './ReferralsModal';
import { FilterPanel } from './UserList/FilterPanel';
import { StatsSummary } from './UserList/StatsSummary';

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

interface NewUser {
  telegram_id: string;
  first_name: string;
  username?: string;
  points: number;
}

interface UsersTabProps {
  selectedMonth: Date;
}

export function UsersTab({ selectedMonth }: UsersTabProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editPoints, setEditPoints] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUserForTasks, setSelectedUserForTasks] = useState<UserData | null>(null);
  const [selectedUserForPrizes, setSelectedUserForPrizes] = useState<UserData | null>(null);
  const [selectedUserForReferrals, setSelectedUserForReferrals] = useState<UserData | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [sortField, setSortField] = useState<SortField>('points');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalReferrals: 0,
    taskStats: {
      quiz: 0,
      keyword: 0,
      telegram: 0
    },
    totalPrizes: 0,
    repeatParticipants: 0
  });
  const [newUser, setNewUser] = useState<NewUser>({
    telegram_id: '',
    first_name: '',
    username: '',
    points: 0
  });

  const getTableName = (table: string) => {
    const isAprilCampaign = selectedMonth.getMonth() === 3; // April is 3 (0-based)
    const prefix = isAprilCampaign ? 'campaign_' : '';
    return `${prefix}${table}`;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const startOfMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
      
      const { data: usersData, error: usersError } = await supabase
        .from(getTableName('users'))
        .select('*')
        .eq('campaign_month', startOfMonth.toISOString().split('T')[0]);

      if (usersError) throw usersError;

      const [
        { data: allSubscriptions },
        { data: allQuizCompletions },
        { data: allReferrals },
        { data: allPrizeExchanges },
        { data: allTaps }
      ] = await Promise.all([
        supabase
          .from(getTableName('telegram_subscriptions'))
          .select('user_id'),
        supabase
          .from(getTableName('quiz_completions'))
          .select('user_id'),
        supabase
          .from(getTableName('referrals'))
          .select('referrer_id, referred_id'),
        supabase
          .from(getTableName('prize_exchanges'))
          .select('*'),
        supabase
          .from(getTableName('daily_taps'))
          .select('user_id, tap_count')
      ]);

      const subscriptionsMap = new Set(allSubscriptions?.map(s => s.user_id) || []);
      const quizCompletionsMap = new Set(allQuizCompletions?.map(q => q.user_id) || []);
      const referralCountMap = new Map();
      const prizeExchangesMap = new Map();
      const totalTapsMap = new Map();

      allReferrals?.forEach(ref => {
        referralCountMap.set(
          ref.referrer_id,
          (referralCountMap.get(ref.referrer_id) || 0) + 1
        );
      });

      allPrizeExchanges?.forEach(prize => {
        if (!prizeExchangesMap.has(prize.user_id)) {
          prizeExchangesMap.set(prize.user_id, []);
        }
        prizeExchangesMap.get(prize.user_id).push(prize);
      });

      allTaps?.forEach(tap => {
        totalTapsMap.set(
          tap.user_id,
          (totalTapsMap.get(tap.user_id) || 0) + (tap.tap_count || 0)
        );
      });

      const enhancedUsers = (usersData || []).map(user => ({
        ...user,
        telegram_subscribed: subscriptionsMap.has(user.telegram_id),
        quiz_completed: quizCompletionsMap.has(user.telegram_id),
        referral_count: referralCountMap.get(user.telegram_id) || 0,
        prize_exchanges: prizeExchangesMap.get(user.telegram_id) || [],
        total_taps: totalTapsMap.get(user.telegram_id) || 0
      }));

      setUsers(enhancedUsers);
      setFilteredUsers(enhancedUsers);

      setStats({
        totalUsers: enhancedUsers.length,
        totalReferrals: Array.from(referralCountMap.values()).reduce((sum, count) => sum + count, 0),
        taskStats: {
          quiz: quizCompletionsMap.size || 0,
          keyword: enhancedUsers.filter(u => u.keyword_completed).length,
          telegram: subscriptionsMap.size || 0
        },
        totalPrizes: Array.from(prizeExchangesMap.values()).reduce((sum, prizes) => sum + prizes.length, 0),
        repeatParticipants: enhancedUsers.filter(u => u.is_repeat).length
      });

      const tags = new Set<string>();
      enhancedUsers.forEach(user => {
        if (user.start_data?.source) {
          tags.add(user.start_data.source);
        }
      });
      setAvailableTags(Array.from(tags));

    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const channel = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: getTableName('users') },
        () => {
          fetchUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedMonth]);

  const handleFilter = (criteria: FilterCriteria) => {
    const filtered = users.filter(user => {
      if (criteria.points.min && user.points < parseInt(criteria.points.min)) return false;
      if (criteria.points.max && user.points > parseInt(criteria.points.max)) return false;

      if (criteria.tasks.quiz && !user.quiz_completed) return false;
      if (criteria.tasks.keyword && !user.keyword_completed) return false;
      if (criteria.tasks.telegram && !user.telegram_subscribed) return false;

      if (criteria.taps.min && (user.total_taps || 0) < parseInt(criteria.taps.min)) return false;
      if (criteria.taps.max && (user.total_taps || 0) > parseInt(criteria.taps.max)) return false;

      if (criteria.referrals.min && user.referral_count < parseInt(criteria.referrals.min)) return false;
      if (criteria.referrals.max && user.referral_count > parseInt(criteria.referrals.max)) return false;

      if (criteria.prizes.min && user.prize_exchanges.length < parseInt(criteria.prizes.min)) return false;
      if (criteria.prizes.max && user.prize_exchanges.length > parseInt(criteria.prizes.max)) return false;

      if (criteria.dates.start && new Date(user.created_at) < new Date(criteria.dates.start)) return false;
      if (criteria.dates.end && new Date(user.created_at) > new Date(criteria.dates.end)) return false;

      if (criteria.participation.repeat && !user.is_repeat) return false;
      if (criteria.participation.new && user.is_repeat) return false;

      if (criteria.tags.length > 0) {
        const userTag = user.start_data?.source;
        if (!userTag || !criteria.tags.includes(userTag)) return false;
      }

      return true;
    });

    setFilteredUsers(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

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

  const searchedUsers = filteredUsers.filter(user => 
    user.first_name.toLowerCase().includes(search.toLowerCase()) ||
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.telegram_id.includes(search)
  );

  const sortedUsers = sortUsers(searchedUsers);

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
        onFilter={handleFilter}
        availableTags={availableTags}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <UserTableHeader
            onSelectAll={() => {
              if (selectedUsers.size === users.length) {
                setSelectedUsers(new Set());
              } else {
                setSelectedUsers(new Set(users.map(user => user.telegram_id)));
              }
            }}
            allSelected={selectedUsers.size === users.length}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <tbody className="divide-y divide-gray-100">
            {sortedUsers.map((user, index) => (
              <UserRow
                key={user.id}
                user={user}
                isSelected={selectedUsers.has(user.telegram_id)}
                onSelect={(userId) => {
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
                onEditPoints={setEditingUser}
                onManageTasks={setSelectedUserForTasks}
                onManagePrizes={setSelectedUserForPrizes}
                onManageReferrals={setSelectedUserForReferrals}
                onDelete={() => {
                  if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
                    supabase
                      .from(getTableName('users'))
                      .delete()
                      .eq('telegram_id', user.telegram_id)
                      .then(() => {
                        setUsers(users.filter(u => u.telegram_id !== user.telegram_id));
                      });
                  }
                }}
                rowIndex={index}
                isTopFive={sortField === 'points' && sortDirection === 'desc'}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showAddUser && (
        <AddUserModal
          user={newUser}
          onChange={setNewUser}
          onSubmit={async () => {
            try {
              const { error } = await supabase
                .from(getTableName('users'))
                .insert([newUser])
                .select()
                .single();

              if (error) throw error;
              
              setShowAddUser(false);
              setNewUser({
                telegram_id: '',
                first_name: '',
                username: '',
                points: 0
              });
              fetchUsers();
            } catch (error) {
              console.error('Error adding user:', error);
              alert('Ошибка при добавлении пользователя');
            }
          }}
          onClose={() => setShowAddUser(false)}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          selectedCount={selectedUsers.size}
          onConfirm={async () => {
            setIsDeleting(true);
            try {
              const { error } = await supabase
                .from(getTableName('users'))
                .delete()
                .in('telegram_id', Array.from(selectedUsers));

              if (error) throw error;

              setUsers(users.filter(user => !selectedUsers.has(user.telegram_id)));
              setSelectedUsers(new Set());
            } catch (error) {
              console.error('Error during bulk deletion:', error);
              alert('Ошибка при удалении пользователей');
            } finally {
              setIsDeleting(false);
              setShowDeleteConfirmation(false);
            }
          }}
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
    </div>
  );
}