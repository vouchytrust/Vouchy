
-- Create videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view videos (public bucket)
CREATE POLICY "Video files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

-- Anyone can upload videos (public collection page)
CREATE POLICY "Anyone can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'videos');

-- Space owners can delete videos
CREATE POLICY "Authenticated users can delete videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
