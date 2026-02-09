import { supabase, isSupabaseConnected } from './supabase';

// ─── USERS ───────────────────────────────────────────────
export async function getUsers() {
  if (!isSupabaseConnected()) return [];
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data;
}

// ─── POSTS ───────────────────────────────────────────────
export async function getPosts(filters = {}) {
  if (!isSupabaseConnected()) return [];
  let query = supabase
    .from('posts')
    .select(`
      *,
      owner:users!posts_owner_id_fkey (id, name, avatar, role, channels, is_admin, is_freelancer),
      links (*),
      tasks (*, assignee:users!tasks_assignee_id_fkey (id, name, avatar, role)),
      comments (*, user:users!comments_user_id_fkey (id, name, avatar)),
      audit_logs (*, performer:users!audit_logs_performed_by_fkey (id, name)),
      approval_logs (*, performer:users!approval_logs_performed_by_fkey (id, name)),
      metrics (*)
    `)
    .order('post_date', { ascending: true });

  if (filters.platform) query = query.eq('platform', filters.platform);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.platforms?.length) query = query.in('platform', filters.platforms);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createPost(postData, userId) {
  if (!isSupabaseConnected()) return null;
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      platform: postData.platform,
      post_type: postData.postType,
      post_date: postData.postDate,
      caption: postData.caption,
      status: 'draft',
      owner_id: postData.ownerId,
      campaign: postData.campaign,
    })
    .select()
    .single();
  if (error) throw error;

  const links = [];
  if (postData.draftLink) links.push({ post_id: post.id, link_type: 'draft', url: postData.draftLink, created_by: userId });
  if (postData.canvaLink) links.push({ post_id: post.id, link_type: 'edit', url: postData.canvaLink, created_by: userId });
  if (links.length) await supabase.from('links').insert(links);

  await supabase.from('tasks').insert({ post_id: post.id, task_type: 'Review', assignee_id: postData.ownerId, due_date: postData.postDate, status: 'todo' });
  await supabase.from('audit_logs').insert({ post_id: post.id, action: 'Created', performed_by: userId });

  return post;
}

export async function submitLiveLink(postId, url, userId) {
  if (!isSupabaseConnected()) return;
  await supabase.from('links').upsert({ post_id: postId, link_type: 'live', url, is_locked: true, locked_at: new Date().toISOString(), created_by: userId }, { onConflict: 'post_id,link_type' });
  await supabase.from('posts').update({ status: 'published' }).eq('id', postId);
  await supabase.from('audit_logs').insert({ post_id: postId, action: 'Live link submitted', performed_by: userId });
}

export async function approvePost(postId, userId) {
  if (!isSupabaseConnected()) return;
  await supabase.from('approval_logs').insert({ post_id: postId, action: 'approved', performed_by: userId });
  await supabase.from('posts').update({ status: 'approved' }).eq('id', postId);
  await supabase.from('audit_logs').insert({ post_id: postId, action: 'Approved', performed_by: userId });
}

export async function rejectPost(postId, userId, notes) {
  if (!isSupabaseConnected()) return;
  await supabase.from('approval_logs').insert({ post_id: postId, action: 'rejected', performed_by: userId, notes });
  await supabase.from('posts').update({ status: 'draft' }).eq('id', postId);
}

// ─── TASKS ───────────────────────────────────────────────
export async function updateTaskStatus(taskId, status) {
  if (!isSupabaseConnected()) return;
  await supabase.from('tasks').update({ status }).eq('id', taskId);
}

// ─── COMMENTS ────────────────────────────────────────────
export async function getComments(postId) {
  if (!isSupabaseConnected()) return [];
  const { data, error } = await supabase.from('comments').select('*, user:users!comments_user_id_fkey (id, name, avatar)').eq('post_id', postId).order('created_at');
  if (error) throw error;
  return data;
}

export async function addComment(postId, userId, content) {
  if (!isSupabaseConnected()) return null;
  const { data, error } = await supabase.from('comments').insert({ post_id: postId, user_id: userId, content }).select('*, user:users!comments_user_id_fkey (id, name, avatar)').single();
  if (error) throw error;
  return data;
}

// ─── CHAT ────────────────────────────────────────────────
export async function getChatMessages(channel) {
  if (!isSupabaseConnected()) return [];
  const { data, error } = await supabase.from('chat_messages').select('*, user:users!chat_messages_user_id_fkey (id, name, avatar, role)').eq('channel', channel).order('created_at');
  if (error) throw error;
  return data;
}

export async function sendChatMessage(channel, userId, content) {
  if (!isSupabaseConnected()) return null;
  const { data, error } = await supabase.from('chat_messages').insert({ channel, user_id: userId, content }).select('*, user:users!chat_messages_user_id_fkey (id, name, avatar, role)').single();
  if (error) throw error;
  return data;
}

// ─── CSV BULK IMPORT ─────────────────────────────────────
export async function bulkImportPosts(rows, userId) {
  if (!isSupabaseConnected()) return { success: 0, errors: [] };
  const results = { success: 0, errors: [] };
  for (const row of rows) {
    try {
      const { data: owner } = await supabase.from('users').select('id').ilike('name', `%${row.owner}%`).limit(1).single();
      const ownerId = owner?.id || userId;
      const sm = { draft: 'draft', 'in review': 'in_review', approved: 'approved', scheduled: 'scheduled', published: 'published' };
      const { data: post, error } = await supabase.from('posts').insert({ platform: row.platform.toLowerCase(), post_type: row.post_type || 'Post', post_date: row.post_date, caption: row.caption, status: sm[row.status?.toLowerCase()] || 'draft', owner_id: ownerId, campaign: row.campaign || 'Uncategorized' }).select().single();
      if (error) throw error;
      if (row.draft_link) await supabase.from('links').insert({ post_id: post.id, link_type: 'draft', url: row.draft_link, created_by: userId });
      if (row.canva_link) await supabase.from('links').insert({ post_id: post.id, link_type: 'edit', url: row.canva_link, created_by: userId });
      await supabase.from('audit_logs').insert({ post_id: post.id, action: 'Created via CSV', performed_by: userId });
      results.success++;
    } catch (err) { results.errors.push({ row, error: err.message }); }
  }
  return results;
}

// ─── REALTIME ────────────────────────────────────────────
export function subscribeToChat(channel, callback) {
  if (!isSupabaseConnected()) return null;
  return supabase.channel(`chat:${channel}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `channel=eq.${channel}` }, payload => callback(payload.new)).subscribe();
}

export function subscribeToPosts(callback) {
  if (!isSupabaseConnected()) return null;
  return supabase.channel('posts:all').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, payload => callback(payload)).subscribe();
}
