-- Set all dates to March 2025
UPDATE users 
SET campaign_month = '2025-03-01'::date;

-- Update all related tables to March 2025
UPDATE quiz_completions
SET completed_at = date_trunc('month', '2025-03-01'::date) + 
  (EXTRACT(day FROM completed_at)::integer - 1 || ' days')::interval +
  EXTRACT(hour FROM completed_at)::integer * interval '1 hour' +
  EXTRACT(minute FROM completed_at)::integer * interval '1 minute' +
  EXTRACT(second FROM completed_at)::integer * interval '1 second';

UPDATE telegram_subscriptions
SET subscribed_at = date_trunc('month', '2025-03-01'::date) + 
  (EXTRACT(day FROM subscribed_at)::integer - 1 || ' days')::interval +
  EXTRACT(hour FROM subscribed_at)::integer * interval '1 hour' +
  EXTRACT(minute FROM subscribed_at)::integer * interval '1 minute' +
  EXTRACT(second FROM subscribed_at)::integer * interval '1 second';

UPDATE prize_exchanges
SET created_at = date_trunc('month', '2025-03-01'::date) + 
  (EXTRACT(day FROM created_at)::integer - 1 || ' days')::interval +
  EXTRACT(hour FROM created_at)::integer * interval '1 hour' +
  EXTRACT(minute FROM created_at)::integer * interval '1 minute' +
  EXTRACT(second FROM created_at)::integer * interval '1 second';

UPDATE referrals
SET created_at = date_trunc('month', '2025-03-01'::date) + 
  (EXTRACT(day FROM created_at)::integer - 1 || ' days')::interval +
  EXTRACT(hour FROM created_at)::integer * interval '1 hour' +
  EXTRACT(minute FROM created_at)::integer * interval '1 minute' +
  EXTRACT(second FROM created_at)::integer * interval '1 second';

UPDATE daily_taps
SET tap_date = date_trunc('month', '2025-03-01'::date) + 
  (EXTRACT(day FROM tap_date)::integer - 1 || ' days')::interval;

-- Update users created_at and last_login
UPDATE users
SET 
  created_at = date_trunc('month', '2025-03-01'::date) + 
    (EXTRACT(day FROM created_at)::integer - 1 || ' days')::interval +
    EXTRACT(hour FROM created_at)::integer * interval '1 hour' +
    EXTRACT(minute FROM created_at)::integer * interval '1 minute' +
    EXTRACT(second FROM created_at)::integer * interval '1 second',
  last_login = date_trunc('month', '2025-03-01'::date) + 
    (EXTRACT(day FROM last_login)::integer - 1 || ' days')::interval +
    EXTRACT(hour FROM last_login)::integer * interval '1 hour' +
    EXTRACT(minute FROM last_login)::integer * interval '1 minute' +
    EXTRACT(second FROM last_login)::integer * interval '1 second';