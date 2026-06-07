create extension if not exists vector;

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  display_name text,
  birth_date date,
  description text,
  avatar_url text,
  voice_sample_url text,
  elevenlabs_voice_id text,
  created_at timestamptz default now()
);

create table if not exists memory_fragments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  content_text text not null,
  content_type text check (content_type in ('text','voice','image','diary','social')),
  original_url text,
  emotion_score float check (emotion_score between 0 and 5),
  emotion_label text check (emotion_label in ('joy','sadness','anger','fear','surprise','neutral')),
  people text[],
  places text[],
  topics text[],
  importance_score float default 0.5,
  memory_date timestamptz,
  summary text,
  parse_status text default 'complete' check (parse_status in ('complete','pending')),
  embedding vector(1024),
  created_at timestamptz default now()
);

alter table memory_fragments add column if not exists source_kind text default 'manual'
  check (source_kind in ('manual','voice','image','video','chat','interview','import'));
alter table memory_fragments add column if not exists source_asset_id uuid;
alter table memory_fragments add column if not exists confidence_score float default 0.75
  check (confidence_score between 0 and 1);
alter table memory_fragments add column if not exists specificity_score float default 0.5
  check (specificity_score between 0 and 1);
alter table memory_fragments add column if not exists user_confirmed boolean default false;
alter table memory_fragments add column if not exists duplicate_of uuid references memory_fragments(id) on delete set null;
alter table memory_fragments add column if not exists quality_notes text;
alter table memory_fragments add column if not exists metadata jsonb default '{}'::jsonb;

create index if not exists memory_fragments_embedding_idx
on memory_fragments
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create index if not exists memory_fragments_profile_date_idx
on memory_fragments (profile_id, memory_date desc);

create index if not exists memory_fragments_quality_idx
on memory_fragments (profile_id, user_confirmed, importance_score desc, confidence_score desc);

create table if not exists profile_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  asset_type text not null check (asset_type in ('voice','image','video')),
  role text default 'reference',
  url text,
  file_name text,
  mime_type text,
  file_size bigint,
  transcript text,
  quality_score float default 0.5 check (quality_score between 0 and 1),
  is_primary boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists profile_assets_profile_type_idx
on profile_assets (profile_id, asset_type, created_at desc);

create table if not exists memory_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  query text,
  answer text,
  source_fragment_ids uuid[],
  rating int check (rating between 1 and 5),
  feedback_type text check (feedback_type in ('accurate','wrong','not_like_person','useful','missing_memory','other')),
  comment text,
  created_at timestamptz default now()
);

create index if not exists memory_feedback_profile_created_idx
on memory_feedback (profile_id, created_at desc);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  messages jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
alter table memory_fragments enable row level security;
alter table conversations enable row level security;
alter table profile_assets enable row level security;
alter table memory_feedback enable row level security;

drop policy if exists "profiles owner access" on profiles;
create policy "profiles owner access" on profiles
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "memory fragments owner access" on memory_fragments;
create policy "memory fragments owner access" on memory_fragments
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "conversations owner access" on conversations;
create policy "conversations owner access" on conversations
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profile assets owner access" on profile_assets;
create policy "profile assets owner access" on profile_assets
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "memory feedback owner access" on memory_feedback;
create policy "memory feedback owner access" on memory_feedback
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function match_memory_fragments(
  query_embedding vector(1024),
  match_profile_id uuid,
  match_user_id uuid,
  match_count int default 5
)
returns table (
  id uuid,
  content_text text,
  content_type text,
  original_url text,
  emotion_score float,
  emotion_label text,
  people text[],
  places text[],
  topics text[],
  importance_score float,
  memory_date timestamptz,
  summary text,
  confidence_score float,
  specificity_score float,
  user_confirmed boolean,
  similarity float
)
language sql stable
as $match_memory_fragments$
  select
    mf.id,
    mf.content_text,
    mf.content_type,
    mf.original_url,
    mf.emotion_score,
    mf.emotion_label,
    mf.people,
    mf.places,
    mf.topics,
    mf.importance_score,
    mf.memory_date,
    mf.summary,
    mf.confidence_score,
    mf.specificity_score,
    mf.user_confirmed,
    1 - (mf.embedding <=> query_embedding) as similarity
  from memory_fragments mf
  where mf.profile_id = match_profile_id
    and mf.user_id = match_user_id
    and mf.embedding is not null
  order by
    (
      (1 - (mf.embedding <=> query_embedding)) * 0.82
      + coalesce(mf.importance_score, 0.5) * 0.08
      + coalesce(mf.confidence_score, 0.75) * 0.06
      + case when mf.user_confirmed then 0.04 else 0 end
    ) desc
  limit match_count;
$match_memory_fragments$;

create or replace function append_conversation_messages(
  conversation_id_input uuid,
  user_id_input uuid,
  new_messages jsonb
)
returns void
language plpgsql
as $append_conversation_messages$
begin
  update conversations
  set messages = coalesce(messages, '[]'::jsonb) || new_messages,
      updated_at = now()
  where id = conversation_id_input
    and user_id = user_id_input;
end;
$append_conversation_messages$;
