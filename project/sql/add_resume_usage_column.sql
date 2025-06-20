-- Add resume_usage column to profiles table as a JSONB type
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS resume_usage JSONB DEFAULT '{
  "total_count": 0,
  "monthly_count": 0
}'::jsonb;

-- Update existing profiles to have default resume_usage if they don't already
UPDATE profiles 
SET resume_usage = '{
  "total_count": 0,
  "monthly_count": 0
}'::jsonb
WHERE resume_usage IS NULL;

-- Add comment to document the column
COMMENT ON COLUMN profiles.resume_usage IS 'Tracks resume usage stats including total count, monthly count, and reset date';
