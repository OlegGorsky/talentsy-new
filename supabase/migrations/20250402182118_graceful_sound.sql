/*
  # Create new schema for April 2025 campaign

  1. New Tables
    - `campaign_users`
      - `id` (uuid, primary key)
      - `telegram_id` (text, unique)
      - `username` (text)
      - `avatar_url` (text)
      - `first_name` (text)
      - `points` (integer)
      - `created_at` (timestamptz)
      - `last_login` (timestamptz)
      - `onboarding_completed` (boolean)
      - `keyword_completed` (boolean)
      - `phone_number` (text)
      - `campaign_month` (date)
      - `is_repeat` (boolean)
      - `start_data` (jsonb)

    - `campaign_quiz_completions`
      - `id` (uuid, primary key)
      - `user_id` (text, references campaign_users.telegram_id)
      - `completed_at` (timestamptz)

    - `campaign_telegram_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (text, references campaign_users.telegram_id)
      - `subscribed_at` (timestamptz)

    - `campaign_referrals`
      - `id` (uuid, primary key)
      - `referrer_id` (text, references campaign_users.telegram_id)
      - `referred_id` (text, references campaign_users.telegram_id)
      - `created_at` (timestamptz)

    - `campaign_prize_exchanges`
      - `id` (uuid, primary key)
      - `user_id` (text, references campaign_users.telegram_id)
      - `prize_id` (integer)
      - `prize_name` (text)
      - `points_spent` (integer)
      - `bot_url` (text)
      - `created_at` (timestamptz)

    - `campaign_daily_taps`
      - `id` (uuid, primary key)
      - `user_id` (text, references campaign_users.telegram_id)
      - `tap_count` (integer)
      - `tap_date` (date)

  2. Security
    - Enable RLS on all tables
    - Add policies for full access
*/

-- Create campaign_users table
CREATE TABLE campaign_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id text UNIQUE NOT NULL,
  username text,
  avatar_url text,
  first_name text NOT NULL,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  onboarding_completed boolean DEFAULT false,
  keyword_completed boolean DEFAULT false,
  phone_number text UNIQUE,
  campaign_month date DEFAULT '2025-04-01'::date,
  is_repeat boolean DEFAULT false,
  start_data jsonb
);

-- Create campaign_quiz_completions table
CREATE TABLE campaign_quiz_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES campaign_users(telegram_id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create campaign_telegram_subscriptions table
CREATE TABLE campaign_telegram_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES campaign_users(telegram_id) ON DELETE CASCADE,
  subscribed_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create campaign_referrals table
CREATE TABLE campaign_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id text NOT NULL REFERENCES campaign_users(telegram_id) ON DELETE CASCADE,
  referred_id text NOT NULL REFERENCES campaign_users(telegram_id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referred_id)
);

-- Create campaign_prize_exchanges table
CREATE TABLE campaign_prize_exchanges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES campaign_users(telegram_id) ON DELETE CASCADE,
  prize_id integer NOT NULL,
  prize_name text NOT NULL,
  points_spent integer NOT NULL,
  bot_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create campaign_daily_taps table
CREATE TABLE campaign_daily_taps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES campaign_users(telegram_id) ON DELETE CASCADE,
  tap_count integer DEFAULT 0,
  tap_date date DEFAULT CURRENT_DATE,
  UNIQUE(user_id, tap_date)
);

-- Enable RLS on all tables
ALTER TABLE campaign_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_quiz_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_telegram_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_prize_exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_daily_taps ENABLE ROW LEVEL SECURITY;

-- Create policies for full access
CREATE POLICY "Enable full access for campaign_users"
  ON campaign_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable full access for campaign_quiz_completions"
  ON campaign_quiz_completions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable full access for campaign_telegram_subscriptions"
  ON campaign_telegram_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable full access for campaign_referrals"
  ON campaign_referrals
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable full access for campaign_prize_exchanges"
  ON campaign_prize_exchanges
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable full access for campaign_daily_taps"
  ON campaign_daily_taps
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX campaign_users_points_idx ON campaign_users(points DESC);
CREATE INDEX campaign_users_campaign_month_idx ON campaign_users(campaign_month);
CREATE INDEX campaign_users_is_repeat_idx ON campaign_users(is_repeat);
CREATE INDEX campaign_daily_taps_date_idx ON campaign_daily_taps(tap_date);