/*
  # Add repeat participant tracking

  1. Changes
    - Add is_repeat column to users table to track repeat participants
    - Add index on is_repeat column for faster filtering
    - Update existing functions to handle repeat participants

  2. Security
    - Maintain existing RLS policies
*/

-- Add is_repeat column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_repeat BOOLEAN DEFAULT FALSE;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS users_is_repeat_idx ON users(is_repeat);