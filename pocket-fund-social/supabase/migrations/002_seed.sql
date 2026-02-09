-- ============================================================
-- SEED DATA — Run AFTER 001_schema.sql
-- ============================================================

-- TEAM MEMBERS
INSERT INTO users (name, email, role, avatar, channels, is_admin, is_freelancer) VALUES
  ('Dev Shah',          'dev@pocketfund.com',     'Founder',           'DS', ARRAY['all'],       true,  false),
  ('Ritish Maheshwari', 'ritish@pocketfund.com',  'Social Media Head', 'RM', ARRAY['all'],       true,  false),
  ('Aryan Solanki',     'aryan@pocketfund.com',   'Instagram Head',    'AS', ARRAY['instagram'], false, false),
  ('Anika Multani',     'anika@pocketfund.com',   'Instagram Intern',  'AM', ARRAY['instagram'], false, false),
  ('Raveena',           'raveena@pocketfund.com', 'Graphic Designer',  'RA', ARRAY['instagram'], false, true),
  ('Debu',              'debu@pocketfund.com',    'Video Editor',      'DE', ARRAY['instagram'], false, true),
  ('Sakib',             'sakib@pocketfund.com',   'Video Editor',      'SA', ARRAY['instagram'], false, true),
  ('Yash',              'yash@pocketfund.com',    'LinkedIn Head',     'YA', ARRAY['linkedin'],  false, false),
  ('Pushkar Rathod',    'pushkar@pocketfund.com', 'X Head',            'PR', ARRAY['x'],         false, false),
  ('Rahul Mahto',       'rahul@pocketfund.com',   'YouTube Head',      'RM', ARRAY['youtube'],   false, true),
  ('Parth',             'parth@pocketfund.com',   'Video Editor',      'PA', ARRAY['youtube'],   false, true)
ON CONFLICT (email) DO NOTHING;

-- SAMPLE POSTS
DO $$
DECLARE
  v_dev UUID; v_aryan UUID; v_yash UUID; v_pushkar UUID;
  v_rahul UUID; v_raveena UUID; v_debu UUID; v_pid UUID;
BEGIN
  SELECT id INTO v_dev FROM users WHERE email='dev@pocketfund.com';
  SELECT id INTO v_aryan FROM users WHERE email='aryan@pocketfund.com';
  SELECT id INTO v_yash FROM users WHERE email='yash@pocketfund.com';
  SELECT id INTO v_pushkar FROM users WHERE email='pushkar@pocketfund.com';
  SELECT id INTO v_rahul FROM users WHERE email='rahul@pocketfund.com';
  SELECT id INTO v_raveena FROM users WHERE email='raveena@pocketfund.com';
  SELECT id INTO v_debu FROM users WHERE email='debu@pocketfund.com';

  -- IG: Published Reel
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('instagram','Reel','2026-02-03','Why micro search funds are the future of SMB acquisitions','published',v_aryan,'Founder Brand') RETURNING id INTO v_pid;
  INSERT INTO links (post_id,link_type,url,is_locked,created_by) VALUES (v_pid,'live','https://instagram.com/p/abc123',true,v_aryan);
  INSERT INTO tasks (post_id,task_type,assignee_id,due_date,status) VALUES (v_pid,'Design',v_raveena,'2026-02-02','done');
  INSERT INTO tasks (post_id,task_type,assignee_id,due_date,status) VALUES (v_pid,'Review',v_dev,'2026-02-03','done');
  INSERT INTO metrics (post_id,snapshot_type,impressions,engagement_rate,follower_change) VALUES (v_pid,'24h',12500,4.2,85);
  INSERT INTO audit_logs (post_id,action,performed_by) VALUES (v_pid,'Created',v_aryan),(v_pid,'Approved',v_dev),(v_pid,'Published',v_aryan);

  -- IG: Published Carousel
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('instagram','Carousel','2026-02-06','3 lessons from our first 6 months of operations','published',v_raveena,'Education') RETURNING id INTO v_pid;
  INSERT INTO links (post_id,link_type,url,is_locked,created_by) VALUES (v_pid,'live','https://instagram.com/p/def456',true,v_aryan);
  INSERT INTO metrics (post_id,snapshot_type,impressions,engagement_rate,follower_change) VALUES (v_pid,'24h',8700,5.1,42);

  -- IG: In Review Reel
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('instagram','Reel','2026-02-10','Behind the scenes: Due diligence process','in_review',v_debu,'Founder Brand') RETURNING id INTO v_pid;
  INSERT INTO links (post_id,link_type,url,created_by) VALUES (v_pid,'edit','https://canva.com/design/DAGx003',v_debu);
  INSERT INTO tasks (post_id,task_type,assignee_id,due_date,status) VALUES (v_pid,'Edit Video',v_debu,'2026-02-09','done'),(v_pid,'Review',v_dev,'2026-02-10','todo');

  -- IG: Draft
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('instagram','Static','2026-02-14','Founder insight: What I wish I knew before acquiring','draft',v_raveena,'Community') RETURNING id INTO v_pid;
  INSERT INTO tasks (post_id,task_type,assignee_id,due_date,status) VALUES (v_pid,'Design',v_raveena,'2026-02-12','in_progress');

  -- LI: Published
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('linkedin','Post','2026-02-04','Weekly market update: SMB valuations trending upward','published',v_yash,'Thought Leadership') RETURNING id INTO v_pid;
  INSERT INTO links (post_id,link_type,url,is_locked,created_by) VALUES (v_pid,'live','https://linkedin.com/posts/yash_abc',true,v_yash);
  INSERT INTO metrics (post_id,snapshot_type,impressions,engagement_rate,follower_change) VALUES (v_pid,'24h',22000,3.8,120);

  -- LI: Approved
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('linkedin','Document','2026-02-11','Search fund vs traditional PE — key differences','approved',v_yash,'Education') RETURNING id INTO v_pid;
  INSERT INTO approval_logs (post_id,action,performed_by) VALUES (v_pid,'approved',v_dev);

  -- LI: Draft
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('linkedin','Post','2026-02-17','The underrated power of long-form LinkedIn posts','draft',v_yash,'Thought Leadership');

  -- YT: Published
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('youtube','Video','2026-02-05','How we evaluate management teams in 48 hours','published',v_rahul,'Education') RETURNING id INTO v_pid;
  INSERT INTO links (post_id,link_type,url,is_locked,created_by) VALUES (v_pid,'live','https://youtube.com/watch?v=abc123',true,v_rahul);
  INSERT INTO metrics (post_id,snapshot_type,impressions,engagement_rate,follower_change) VALUES (v_pid,'24h',45000,6.2,310);

  -- YT: Draft
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('youtube','Video','2026-02-15','Thumbnail design tips for business YouTube','draft',v_rahul,'Education');

  -- X: Published
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('x','Thread','2026-02-07','Deal sourcing strategies that actually work','published',v_pushkar,'Community') RETURNING id INTO v_pid;
  INSERT INTO links (post_id,link_type,url,is_locked,created_by) VALUES (v_pid,'live','https://x.com/pocketfund/status/123',true,v_pushkar);
  INSERT INTO metrics (post_id,snapshot_type,impressions,engagement_rate,follower_change) VALUES (v_pid,'24h',18000,7.1,95);

  -- X: In Review
  INSERT INTO posts (platform,post_type,post_date,caption,status,owner_id,campaign) VALUES
    ('x','Post','2026-02-12','Hot take: Why PE firms are losing deals to micro searchers','in_review',v_pushkar,'Thought Leadership');

  -- CHAT MESSAGES
  INSERT INTO chat_messages (channel,user_id,content,is_pinned) VALUES
    ('instagram',v_aryan,'Team, all reels for this week are in Canva. Review before Wednesday.',true),
    ('instagram',v_raveena,'Starting carousel graphics — any color preference for Valentines?',false),
    ('instagram',v_dev,'Use the new pink-to-coral gradient from the brand kit.',false),
    ('instagram',v_debu,'Video edits for founder reel done. Uploading to Drive.',false),
    ('linkedin',v_yash,'Published thought leadership post. 2K impressions in 3 hours.',true),
    ('linkedin',v_dev,'Great work! Double down on long-form format.',false),
    ('youtube',v_rahul,'Need thumbnail for explainer video by Thursday.',false),
    ('youtube',v_dev,'Rahul, prep description and tags. SEO is key.',true),
    ('x',v_pushkar,'Posted deal sourcing thread. 5 tweets with different tactics.',false),
    ('x',v_dev,'Nice! Quote tweet from the brand account too.',true);

END $$;
