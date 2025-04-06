/*
  # Reset statistics for April 2025 campaign

  1. Changes
    - Reset points to 0 for all users in April campaign
    - Clear task completion statuses
    - Remove all task completion records
    - Remove all referrals
    - Remove all prize exchanges
    - Remove all daily taps
    - Keep user profiles but reset their progress

  2. Notes
    - Preserves user accounts and basic info
    - Only affects April 2025 campaign data
    - Maintains historical March 2025 data
*/

-- Reset points and task completion status for April users
UPDATE users
SET 
  points = 0,
  keyword_completed = false,
  onboarding_completed = false
WHERE campaign_month = '2025-04-01'::date;

-- Remove quiz completions for April
DELETE FROM quiz_completions
WHERE completed_at >= '2025-04-01'::date;

-- Remove telegram subscriptions for April
DELETE FROM telegram_subscriptions
WHERE subscribed_at >= '2025-04-01'::date;

-- Remove prize exchanges for April
DELETE FROM prize_exchanges
WHERE created_at >= '2025-04-01'::date;

-- Remove referrals for April
DELETE FROM referrals
WHERE created_at >= '2025-04-01'::date;

-- Remove daily taps for April
DELETE FROM daily_taps
WHERE tap_date >= '2025-04-01'::date;

-- Remove phone registration points for April
DELETE FROM phone_registration_points
WHERE created_at >= '2025-04-01'::date;