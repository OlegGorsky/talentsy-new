-- Update default campaign month to April 2025
ALTER TABLE users 
ALTER COLUMN campaign_month 
SET DEFAULT '2025-04-01'::date;

-- Create function to handle new campaign registrations
CREATE OR REPLACE FUNCTION handle_new_campaign_registration()
RETURNS trigger AS $$
BEGIN
  -- Set campaign_month to April 2025 for new registrations
  NEW.campaign_month := '2025-04-01'::date;
  
  -- Check if user has participated in March campaign
  IF EXISTS (
    SELECT 1 
    FROM users 
    WHERE telegram_id = NEW.telegram_id 
    AND campaign_month = '2025-03-01'::date
  ) THEN
    NEW.is_repeat := true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new registrations
DROP TRIGGER IF EXISTS set_campaign_month ON users;
CREATE TRIGGER set_campaign_month
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_campaign_registration();