-- ============================================================
-- POCKET FUND SOCIAL COMMAND — Database Schema
-- Run in: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- 1. USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'XX',
  channels TEXT[] NOT NULL DEFAULT '{}',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  is_freelancer BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. POSTS
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL CHECK (platform IN ('instagram','linkedin','youtube','x')),
  post_type TEXT NOT NULL DEFAULT 'Post',
  post_date DATE NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','in_review','approved','scheduled','published')),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  campaign TEXT DEFAULT 'Uncategorized',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(post_date);
CREATE INDEX IF NOT EXISTS idx_posts_platform ON posts(platform);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- 3. LINKS
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('draft','edit','asset','live')),
  url TEXT NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_at TIMESTAMPTZ,
  UNIQUE(post_id, link_type)
);

-- 4. TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  assignee_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','done','blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_tasks_post ON tasks(post_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee ON tasks(assignee_id);

-- 5. COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  content TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

-- 6. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  channel TEXT NOT NULL CHECK (channel IN ('instagram','linkedin','youtube','x')),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  content TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_chat_channel ON chat_messages(channel, created_at);

-- 7. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by UUID NOT NULL REFERENCES users(id),
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_post ON audit_logs(post_id);

-- 8. APPROVAL LOGS
CREATE TABLE IF NOT EXISTS approval_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('submitted','approved','rejected','changes_requested')),
  performed_by UUID NOT NULL REFERENCES users(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. METRICS
CREATE TABLE IF NOT EXISTS metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  snapshot_type TEXT NOT NULL DEFAULT '24h',
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  follower_change INTEGER DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AUTO-UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_ts BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_posts_ts BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_tasks_ts BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;

-- MVP: Open policies (tighten for production)
CREATE POLICY "open" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON chat_messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON approval_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "open" ON metrics FOR ALL USING (true) WITH CHECK (true);

-- ENABLE REALTIME for chat
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE posts;

-- DASHBOARD VIEW
CREATE OR REPLACE VIEW platform_summary AS
SELECT platform,
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'published') AS published,
  COUNT(*) FILTER (WHERE status = 'in_review') AS in_review,
  COUNT(*) FILTER (WHERE status = 'draft') AS drafts
FROM posts GROUP BY platform;
