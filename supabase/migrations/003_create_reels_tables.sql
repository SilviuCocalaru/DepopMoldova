-- Create reels table
CREATE TABLE IF NOT EXISTS public.reels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    clothing_style VARCHAR(50),
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create reel_likes table
CREATE TABLE IF NOT EXISTS public.reel_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reel_id UUID REFERENCES public.reels(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(reel_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reels_user_id ON public.reels(user_id);
CREATE INDEX IF NOT EXISTS idx_reels_created_at ON public.reels(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reel_likes_reel_id ON public.reel_likes(reel_id);
CREATE INDEX IF NOT EXISTS idx_reel_likes_user_id ON public.reel_likes(user_id);

-- Enable RLS
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reels table

-- Anyone can view reels
CREATE POLICY "Anyone can view reels"
    ON public.reels FOR SELECT
    USING (true);

-- Only authenticated users can create reels
CREATE POLICY "Authenticated users can create reels"
    ON public.reels FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can update their own reels
CREATE POLICY "Users can update own reels"
    ON public.reels FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own reels
CREATE POLICY "Users can delete own reels"
    ON public.reels FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for reel_likes table

-- Anyone can view likes
CREATE POLICY "Anyone can view reel likes"
    ON public.reel_likes FOR SELECT
    USING (true);

-- Authenticated users can like reels
CREATE POLICY "Authenticated users can like reels"
    ON public.reel_likes FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Users can unlike reels (delete their own likes)
CREATE POLICY "Users can unlike reels"
    ON public.reel_likes FOR DELETE
    USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_reels_updated_at BEFORE UPDATE ON public.reels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment likes count
CREATE OR REPLACE FUNCTION increment_reel_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.reels
    SET likes_count = likes_count + 1
    WHERE id = NEW.reel_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to decrement likes count
CREATE OR REPLACE FUNCTION decrement_reel_likes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.reels
    SET likes_count = likes_count - 1
    WHERE id = OLD.reel_id;
    RETURN OLD;
END;
$$ language 'plpgsql';

-- Triggers for automatic likes count
CREATE TRIGGER increment_reel_likes_trigger
    AFTER INSERT ON public.reel_likes
    FOR EACH ROW EXECUTE FUNCTION increment_reel_likes();

CREATE TRIGGER decrement_reel_likes_trigger
    AFTER DELETE ON public.reel_likes
    FOR EACH ROW EXECUTE FUNCTION decrement_reel_likes();
