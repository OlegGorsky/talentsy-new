/*
  # Add month tracking to users table

  1. Changes
    - Add month column to users table to track which month's campaign the user belongs to
    - Add index on month column for faster filtering
    - Add function to get current campaign month

  2. Security
    - Maintain existing RLS policies
*/

-- Add month column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS campaign_month DATE DEFAULT date_trunc('month', CURRENT_DATE);

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS users_campaign_month_idx ON users(campaign_month);

-- Function to get current campaign month
CREATE OR REPLACE FUNCTION get_current_campaign_month()
RETURNS DATE AS $$
BEGIN
  RETURN date_trunc('month', CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;