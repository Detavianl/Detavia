-- ============================================================
-- Storage buckets: 'cvs' (privé, alleen admins) en 'blog' (publieke covers)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('cvs', 'cvs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do nothing;

-- cv's: alleen interne admins mogen lezen/schrijven
create policy cvs_admin_read on storage.objects
  for select using (bucket_id = 'cvs' and public.is_admin());
create policy cvs_admin_write on storage.objects
  for insert with check (bucket_id = 'cvs' and public.is_admin());
create policy cvs_admin_delete on storage.objects
  for delete using (bucket_id = 'cvs' and public.is_admin());

-- blog-covers: publiek leesbaar, admins schrijven
create policy blog_public_read on storage.objects
  for select using (bucket_id = 'blog');
create policy blog_admin_write on storage.objects
  for insert with check (bucket_id = 'blog' and public.is_admin());
create policy blog_admin_delete on storage.objects
  for delete using (bucket_id = 'blog' and public.is_admin());
