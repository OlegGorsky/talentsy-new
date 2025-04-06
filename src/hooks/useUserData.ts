import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

interface UserStats {
  totalUsers: number;
  totalReferrals: number;
  taskStats: {
    quiz: number;
    keyword: number;
    telegram: number;
  };
  totalPrizes: number;
  repeatParticipants: number;
}

export function useUserData(selectedMonth: Date) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
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
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const getTableName = (table: string) => {
    const isAprilCampaign = selectedMonth.getMonth() === 3;
    const prefix = isAprilCampaign ? 'campaign_' : '';
    return `${prefix}${table}`;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const [
        { data: usersData },
        { data: quizData },
        { data: telegramData },
        { data: referralsData },
        { data: prizesData },
        { data: tapsData }
      ] = await Promise.all([
        supabase.from(getTableName('users')).select('*'),
        supabase.from(getTableName('quiz_completions')).select('user_id'),
        supabase.from(getTableName('telegram_subscriptions')).select('user_id'),
        supabase.from(getTableName('referrals')).select('referrer_id, referred_id'),
        supabase.from(getTableName('prize_exchanges')).select('*'),
        supabase.from(getTableName('daily_taps')).select('user_id, tap_count')
      ]);

      if (!usersData) {
        throw new Error('Failed to fetch users');
      }

      const quizCompletions = new Set(quizData?.map(q => q.user_id) || []);
      const telegramSubs = new Set(telegramData?.map(t => t.user_id) || []);
      
      const referralCounts = new Map();
      referralsData?.forEach(ref => {
        referralCounts.set(
          ref.referrer_id,
          (referralCounts.get(ref.referrer_id) || 0) + 1
        );
      });

      const prizeExchangesMap = new Map();
      prizesData?.forEach(prize => {
        if (!prizeExchangesMap.has(prize.user_id)) {
          prizeExchangesMap.set(prize.user_id, []);
        }
        prizeExchangesMap.get(prize.user_id).push(prize);
      });

      const totalTapsMap = new Map();
      tapsData?.forEach(tap => {
        totalTapsMap.set(
          tap.user_id,
          (totalTapsMap.get(tap.user_id) || 0) + (tap.tap_count || 0)
        );
      });

      const enhancedUsers = usersData.map(user => ({
        ...user,
        quiz_completed: quizCompletions.has(user.telegram_id),
        telegram_subscribed: telegramSubs.has(user.telegram_id),
        referral_count: referralCounts.get(user.telegram_id) || 0,
        prize_exchanges: prizeExchangesMap.get(user.telegram_id) || [],
        total_taps: totalTapsMap.get(user.telegram_id) || 0
      }));

      setUsers(enhancedUsers);

      setStats({
        totalUsers: enhancedUsers.length,
        totalReferrals: Array.from(referralCounts.values()).reduce((sum, count) => sum + count, 0),
        taskStats: {
          quiz: quizCompletions.size,
          keyword: enhancedUsers.filter(u => u.keyword_completed).length,
          telegram: telegramSubs.size
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

    const channels = [
      'users',
      'quiz_completions',
      'telegram_subscriptions',
      'prize_exchanges',
      'referrals',
      'daily_taps'
    ].map(table => 
      supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: getTableName(table) },
          () => fetchUsers()
        )
        .subscribe()
    );

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [selectedMonth]);

  return {
    users,
    loading,
    stats,
    availableTags,
    getTableName,
    fetchUsers
  };
}