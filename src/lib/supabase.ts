import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

// Helper function to get current user ID
export const getCurrentUserId = () => {
  const tg = window.Telegram?.WebApp;
  return tg?.initDataUnsafe?.user?.id;
};

// Database table names
export const DB_TABLES = {
  USERS: 'campaign_users',
  QUIZ_COMPLETIONS: 'campaign_quiz_completions',
  TELEGRAM_SUBSCRIPTIONS: 'campaign_telegram_subscriptions',
  REFERRALS: 'campaign_referrals',
  PRIZE_EXCHANGES: 'campaign_prize_exchanges',
  DAILY_TAPS: 'campaign_daily_taps'
} as const;

// Helper functions for common database operations
export const dbHelpers = {
  // Get user data
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from(DB_TABLES.USERS)
      .select('*')
      .eq('telegram_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update user points
  async updatePoints(userId: string, points: number) {
    const { error } = await supabase.rpc('add_campaign_points', {
      user_id_param: userId,
      points_to_add: points
    });
    
    if (error) throw error;
  },

  // Increment daily taps
  async incrementTaps(userId: string) {
    const { data, error } = await supabase.rpc('increment_campaign_taps', {
      user_id_param: userId
    });
    
    if (error) throw error;
    return data;
  },

  // Get user's daily tap count
  async getDailyTaps(userId: string) {
    const { data, error } = await supabase
      .from(DB_TABLES.DAILY_TAPS)
      .select('tap_count')
      .eq('user_id', userId)
      .eq('tap_date', new Date().toISOString().split('T')[0])
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data?.tap_count || 0;
  },

  // Check if user has completed quiz
  async hasCompletedQuiz(userId: string) {
    const { data, error } = await supabase
      .from(DB_TABLES.QUIZ_COMPLETIONS)
      .select('completed_at')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  },

  // Check if user has subscribed to Telegram
  async hasSubscribedToTelegram(userId: string) {
    const { data, error } = await supabase
      .from(DB_TABLES.TELEGRAM_SUBSCRIPTIONS)
      .select('subscribed_at')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  },

  // Get user's referral count
  async getReferralCount(userId: string) {
    const { count, error } = await supabase
      .from(DB_TABLES.REFERRALS)
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId);
    
    if (error) throw error;
    return count || 0;
  }
};