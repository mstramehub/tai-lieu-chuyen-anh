-- Ms Trâm English Hub — Web Tài liệu Chuyên Anh
-- Chạy TOÀN BỘ file này trong Supabase → SQL Editor → New query → Run.
-- Chạy lại nhiều lần vẫn an toàn: không xoá tài liệu hay file đã có.
-- Mọi bảng và hàm đều có tiền tố ca_, nên dùng chung project với web IELTS Writing không ảnh hưởng gì.

-- 1. Giáo viên --------------------------------------------------------------
-- Danh sách email được quyền đăng tài liệu và đổi mã.
create table if not exists public.ca_teachers (
  email text primary key check (email = lower(email))
);

create or replace function public.ca_is_teacher()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.ca_teachers
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 2. Mã truy cập và thư mục file ---------------------------------------------
-- Một dòng duy nhất. prefix là tên thư mục ngẫu nhiên chứa file; đổi mã thì đổi luôn prefix.
create table if not exists public.ca_settings (
  id         smallint primary key default 1 check (id = 1),
  code       text not null check (code ~ '^[A-Z0-9-]{4,24}$'),
  prefix     text not null check (prefix ~ '^[a-z0-9]{24,64}$'),
  updated_at timestamptz not null default now()
);

-- 3. Tài liệu ------------------------------------------------------------------
-- exam / answer / audio: {"path": "...", "name": "...", "mime": "...", "size": 123}
create table if not exists public.ca_items (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(title) between 1 and 160),
  topic        text not null default '' check (char_length(topic) <= 80),
  skill        text not null,
  kind         text not null,
  level        text not null default 'B2',
  descr        text not null default '' check (char_length(descr) <= 500),
  link         text,
  show_answers boolean not null default true,
  exam         jsonb,
  answer       jsonb,
  audio        jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists ca_items_created_idx on public.ca_items (created_at desc);

-- 4. Quyền truy cập ------------------------------------------------------------
-- Học sinh không đọc bảng trực tiếp: chỉ đọc qua hàm ca_list kèm mã đúng.
alter table public.ca_teachers enable row level security;
alter table public.ca_settings enable row level security;
alter table public.ca_items    enable row level security;

drop policy if exists "ca teachers read" on public.ca_teachers;
create policy "ca teachers read" on public.ca_teachers for select to authenticated using (public.ca_is_teacher());

drop policy if exists "ca settings teacher" on public.ca_settings;
create policy "ca settings teacher" on public.ca_settings for all to authenticated
  using (public.ca_is_teacher()) with check (public.ca_is_teacher());

drop policy if exists "ca items teacher" on public.ca_items;
create policy "ca items teacher" on public.ca_items for all to authenticated
  using (public.ca_is_teacher()) with check (public.ca_is_teacher());

-- 5. Hàm cho học sinh: nhập mã đúng mới nhận được danh sách tài liệu -------------
create or replace function public.ca_list(p_code text)
returns jsonb language plpgsql volatile security definer set search_path = public as $$
declare
  ok boolean;
begin
  select exists (
    select 1 from public.ca_settings
    where id = 1 and code = upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'))
  ) into ok;
  if not ok then
    perform pg_sleep(0.6);            -- làm chậm việc đoán mã
    raise exception 'invalid_code' using errcode = '28000';
  end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', i.id, 'title', i.title, 'topic', i.topic, 'skill', i.skill, 'kind', i.kind,
      'level', i.level, 'descr', i.descr, 'link', i.link, 'show_answers', i.show_answers,
      'exam', i.exam, 'audio', i.audio,
      'answer', case when i.show_answers then i.answer else null end,
      'has_answer', i.answer is not null,
      'created_at', i.created_at
    ) order by i.created_at desc)
    from public.ca_items i
  ), '[]'::jsonb);
end $$;

revoke all on function public.ca_list(text) from public;
grant execute on function public.ca_list(text) to anon, authenticated;
grant execute on function public.ca_is_teacher() to anon, authenticated;

-- 6. Kho file ------------------------------------------------------------------
-- Bucket công khai nhưng mọi file nằm trong thư mục tên ngẫu nhiên (prefix).
-- Không ai liệt kê được thư mục; chỉ ai nhập đúng mã mới nhận được đường dẫn.
insert into storage.buckets (id, name, public, file_size_limit)
values ('chuyen-anh', 'chuyen-anh', true, 52428800)
on conflict (id) do update set public = true, file_size_limit = 52428800;

drop policy if exists "ca files read"   on storage.objects;
drop policy if exists "ca files insert" on storage.objects;
drop policy if exists "ca files update" on storage.objects;
drop policy if exists "ca files delete" on storage.objects;
create policy "ca files read"   on storage.objects for select to authenticated
  using (bucket_id = 'chuyen-anh' and public.ca_is_teacher());
create policy "ca files insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'chuyen-anh' and public.ca_is_teacher());
create policy "ca files update" on storage.objects for update to authenticated
  using (bucket_id = 'chuyen-anh' and public.ca_is_teacher())
  with check (bucket_id = 'chuyen-anh' and public.ca_is_teacher());
create policy "ca files delete" on storage.objects for delete to authenticated
  using (bucket_id = 'chuyen-anh' and public.ca_is_teacher());

-- 7. Thêm email giáo viên (sửa email rồi bỏ dấu -- ở đầu dòng dưới để chạy) -------
-- insert into public.ca_teachers (email) values ('email_cua_ban@gmail.com') on conflict do nothing;
