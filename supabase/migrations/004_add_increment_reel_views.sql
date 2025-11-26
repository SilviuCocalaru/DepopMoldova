-- Function to increment reel views count
CREATE OR REPLACE FUNCTION increment_reel_views(reel_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.reels
    SET views_count = views_count + 1
    WHERE id = reel_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
