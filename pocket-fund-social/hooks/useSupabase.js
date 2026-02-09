/**
 * Supabase Data Hooks
 *
 * HOW TO MIGRATE from mock data to live Supabase:
 *
 * In Dashboard.jsx, replace:
 *   const [posts, setPosts] = useState(initPosts);
 * With:
 *   const { posts, loading, addPost } = usePosts(user);
 *
 * Replace:
 *   const [chats, setChats] = useState(initChats);
 * With:
 *   const { messages, sendMessage } = useChat('instagram', user);
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConnected } from '@/lib/supabase';
import * as db from '@/lib/db';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    db.getUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  }, []);
  return { users, loading };
}

export function usePosts(user) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    const channels = user.channels?.[0] === 'all' ? ['instagram','linkedin','youtube','x'] : user.channels;
    const data = await db.getPosts({ platforms: channels });
    setPosts(data);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetch();
    const sub = db.subscribeToPosts(() => fetch());
    return () => { if (sub && isSupabaseConnected()) supabase.removeChannel(sub); };
  }, [fetch]);

  const addPost = useCallback(async (d) => { await db.createPost(d, user.id); fetch(); }, [user, fetch]);
  const submitLiveLink = useCallback(async (pid, url) => { await db.submitLiveLink(pid, url, user.id); fetch(); }, [user, fetch]);
  const approve = useCallback(async (pid) => { await db.approvePost(pid, user.id); fetch(); }, [user, fetch]);
  const reject = useCallback(async (pid, n) => { await db.rejectPost(pid, user.id, n); fetch(); }, [user, fetch]);
  const importCSV = useCallback(async (rows) => { const r = await db.bulkImportPosts(rows, user.id); fetch(); return r; }, [user, fetch]);

  return { posts, loading, addPost, submitLiveLink, approve, reject, importCSV, refresh: fetch };
}

export function useChat(channel, user) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channel || !user) return;
    db.getChatMessages(channel).then(setMessages).catch(console.error).finally(() => setLoading(false));
    const sub = db.subscribeToChat(channel, async (msg) => {
      if (!isSupabaseConnected()) return;
      const { data } = await supabase.from('chat_messages').select('*, user:users!chat_messages_user_id_fkey (id, name, avatar, role)').eq('id', msg.id).single();
      if (data) setMessages(p => p.find(m => m.id === data.id) ? p : [...p, data]);
    });
    return () => { if (sub && isSupabaseConnected()) supabase.removeChannel(sub); };
  }, [channel, user]);

  const send = useCallback(async (text) => {
    const msg = await db.sendChatMessage(channel, user.id, text);
    if (msg) setMessages(p => p.find(m => m.id === msg.id) ? p : [...p, msg]);
  }, [channel, user]);

  return { messages, loading, send };
}

export function useComments(postId, user) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;
    db.getComments(postId).then(setComments).catch(console.error).finally(() => setLoading(false));
  }, [postId]);

  const add = useCallback(async (text) => {
    const c = await db.addComment(postId, user.id, text);
    if (c) setComments(p => [...p, c]);
  }, [postId, user]);

  return { comments, loading, add };
}
