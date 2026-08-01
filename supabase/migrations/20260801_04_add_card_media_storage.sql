-- Phase 4: Card Editor Overhaul — storage for per-card images/audio
-- Applied directly to the live Supabase project on 2026-08-01 via the Supabase MCP.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'card-media',
  'card-media',
  true,
  10485760, -- 10MB ceiling; images are further capped at 5MB by the API route
  array['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg']
);

-- Public read (bucket is public, but an explicit SELECT policy is still required for storage.objects)
create policy "Public read access to card media"
  on storage.objects for select
  using (bucket_id = 'card-media');

-- Only the owning user can upload/update/delete — path is always {userId}/{deckId}/{cardIndex}/{file}
create policy "Users manage their own card media"
  on storage.objects for insert
  with check (bucket_id = 'card-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users update their own card media"
  on storage.objects for update
  using (bucket_id = 'card-media' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users delete their own card media"
  on storage.objects for delete
  using (bucket_id = 'card-media' and (storage.foldername(name))[1] = auth.uid()::text);
