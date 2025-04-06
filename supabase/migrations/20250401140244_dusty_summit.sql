-- Update all existing users to March 2025
UPDATE users 
SET campaign_month = '2025-03-01'::date
WHERE campaign_month IS NULL OR campaign_month < '2025-03-01'::date;

-- Set default for new users to March 2025
ALTER TABLE users 
ALTER COLUMN campaign_month 
SET DEFAULT '2025-03-01'::date;

-- Update is_repeat for users who have participated before
WITH previous_participants AS (
  SELECT DISTINCT telegram_id
  FROM users
  WHERE campaign_month < '2025-03-01'::date
)
UPDATE users
SET is_repeat = true
WHERE telegram_id IN (SELECT telegram_id FROM previous_participants)
AND campaign_month = '2025-03-01'::date;