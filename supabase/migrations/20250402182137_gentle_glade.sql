/*
  # Create functions for new campaign tables

  1. Functions
    - add_campaign_points - Add points to user
    - increment_campaign_taps - Increment daily taps
    - handle_campaign_quiz_completion - Handle quiz completion and points
    - process_campaign_referral - Handle referral points
    - notify_campaign_events - Send webhook notifications
*/

-- Function to add points safely
CREATE OR REPLACE FUNCTION add_campaign_points(user_id_param TEXT, points_to_add INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  success BOOLEAN;
BEGIN
  success := FALSE;
  
  UPDATE campaign_users
  SET points = COALESCE(points, 0) + points_to_add
  WHERE telegram_id = user_id_param;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success;
END;
$$ LANGUAGE plpgsql;

-- Function to increment daily taps
CREATE OR REPLACE FUNCTION increment_campaign_taps(user_id_param text)
RETURNS boolean AS $$
DECLARE
  current_count integer;
BEGIN
  -- Insert or update tap count for today
  INSERT INTO campaign_daily_taps (user_id, tap_count, tap_date)
  VALUES (user_id_param, 1, CURRENT_DATE)
  ON CONFLICT (user_id, tap_date)
  DO UPDATE SET tap_count = campaign_daily_taps.tap_count + 1
  RETURNING tap_count INTO current_count;

  -- Add points if under limit
  IF current_count <= 10 THEN
    PERFORM add_campaign_points(user_id_param, 2);
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- Function to handle quiz completion
CREATE OR REPLACE FUNCTION handle_campaign_quiz_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Add points for completing the quiz
  PERFORM add_campaign_points(NEW.user_id, 200);
  
  -- Add points for referral if this user was referred
  IF EXISTS (
    SELECT 1 
    FROM campaign_referrals 
    WHERE referred_id = NEW.user_id
  ) THEN
    UPDATE campaign_users
    SET points = points + 100
    WHERE telegram_id IN (
      SELECT referrer_id
      FROM campaign_referrals
      WHERE referred_id = NEW.user_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for quiz completion
CREATE TRIGGER on_campaign_quiz_completion
  AFTER INSERT ON campaign_quiz_completions
  FOR EACH ROW
  EXECUTE FUNCTION handle_campaign_quiz_completion();

-- Function to send webhook notifications
CREATE OR REPLACE FUNCTION notify_campaign_events()
RETURNS trigger AS $$
DECLARE
  webhook_url text := 'https://gorskybase.store/webhook/97e3b188-77e1-48ec-bdf4-823312e9f3b0';
  event_name text;
  user_id text;
BEGIN
  -- Determine event name and user ID based on the table
  CASE TG_TABLE_NAME
    WHEN 'campaign_users' THEN
      event_name := 'user_registration';
      user_id := NEW.telegram_id;
    WHEN 'campaign_quiz_completions' THEN
      event_name := 'quiz_completion';
      user_id := NEW.user_id;
    WHEN 'campaign_telegram_subscriptions' THEN
      event_name := 'telegram_subscription';
      user_id := NEW.user_id;
  END CASE;

  -- Send webhook notification
  PERFORM http_post(
    webhook_url,
    json_build_object(
      'event', event_name,
      'user_id', user_id,
      'timestamp', CURRENT_TIMESTAMP
    )::text,
    'application/json'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for webhook notifications
CREATE TRIGGER notify_campaign_user_registration
  AFTER INSERT ON campaign_users
  FOR EACH ROW
  EXECUTE FUNCTION notify_campaign_events();

CREATE TRIGGER notify_campaign_quiz_completion
  AFTER INSERT ON campaign_quiz_completions
  FOR EACH ROW
  EXECUTE FUNCTION notify_campaign_events();

CREATE TRIGGER notify_campaign_telegram_subscription
  AFTER INSERT ON campaign_telegram_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION notify_campaign_events();

-- Function to notify keyword completion
CREATE OR REPLACE FUNCTION notify_campaign_keyword_completion()
RETURNS trigger AS $$
DECLARE
  webhook_url text := 'https://gorskybase.store/webhook/97e3b188-77e1-48ec-bdf4-823312e9f3b0';
BEGIN
  -- Only send notification when keyword_completed changes from false to true
  IF NEW.keyword_completed = true AND (OLD.keyword_completed = false OR OLD.keyword_completed IS NULL) THEN
    PERFORM http_post(
      webhook_url,
      json_build_object(
        'event', 'keyword_completion',
        'user_id', NEW.telegram_id,
        'timestamp', CURRENT_TIMESTAMP
      )::text,
      'application/json'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for keyword completion
CREATE TRIGGER notify_campaign_keyword_completion
  AFTER UPDATE OF keyword_completed ON campaign_users
  FOR EACH ROW
  EXECUTE FUNCTION notify_campaign_keyword_completion();