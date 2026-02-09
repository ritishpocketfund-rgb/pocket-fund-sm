import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";

// ─── Contexts ────────────────────────────────────────────────────────────────
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);
const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const I = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="4" rx="2"/><rect x="14" y="10" width="7" height="11" rx="2"/><rect x="3" y="13" width="7" height="8" rx="2"/></svg>,
  calendar: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>,
  posts: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16"/><path d="M4 10h16"/><path d="M4 14h12"/><path d="M4 18h8"/></svg>,
  check: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>,
  upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M20 16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4"/></svg>,
  team: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><circle cx="17" cy="8" r="3"/><path d="M21 21v-2a3 3 0 00-2-2.8"/></svg>,
  bell: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21a2 2 0 004 0"/><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/></svg>,
  sun: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>,
  moon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  close: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  chevL: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>,
  chevR: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  link: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  draft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>,
  palette: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/><circle cx="7" cy="14" r="1.5" fill="currentColor"/></svg>,
  live: <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="#22C55E"/><circle cx="12" cy="12" r="8" stroke="#22C55E" strokeWidth="2" opacity="0.25"/></svg>,
  warn: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 20h20L12 2zM12 9v4"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>,
  alert: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><circle cx="12" cy="16" r=".5" fill="currentColor"/></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z"/></svg>,
  trash: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>,
  chat: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  chart: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 20V12M10 20V6M16 20V10M22 20V4"/></svg>,
  download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12M8 12l4 4 4-4M20 16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4"/></svg>,
  zap: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 14H12l-1 8L20 10h-8l1-8z"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  lock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/></svg>,
  task: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l3 3 5-5"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  hist: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M3 21c0-4.5 4-7 9-7s9 2.5 9 7"/></svg>,
  pin: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17v5M9 2l8 8-5 1.5L8.5 15l-1.5-1.5L10.5 10z"/></svg>,
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  arrowUp: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>,
  arrowDn: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>,
};

// ─── Config ──────────────────────────────────────────────────────────────────
const PLATFORMS = {
  instagram: { label: "Instagram", color: "#E1306C", bg: "#FDF2F8", abbr: "IG" },
  linkedin: { label: "LinkedIn", color: "#0A66C2", bg: "#EFF6FF", abbr: "LI" },
  youtube: { label: "YouTube", color: "#FF0000", bg: "#FEF2F2", abbr: "YT" },
  x: { label: "X (Twitter)", color: "#1DA1F2", bg: "#F0F9FF", abbr: "X" },
};
const STATUSES = { draft:{label:"Draft",color:"#94A3B8",bg:"#F1F5F9"}, in_review:{label:"In Review",color:"#F59E0B",bg:"#FFFBEB"}, approved:{label:"Approved",color:"#22C55E",bg:"#F0FDF4"}, scheduled:{label:"Scheduled",color:"#8B5CF6",bg:"#F5F3FF"}, published:{label:"Published",color:"#059669",bg:"#ECFDF5"} };
const TASK_TYPES = ["Copy","Design","Review","Publish","Edit Video","Graphic Design"];
const TASK_STATUSES = { todo:"To Do", in_progress:"In Progress", done:"Done", blocked:"Blocked" };
const POST_TYPES = ["Reel","Carousel","Static","Thread","Video","Post","Document"];
const ACOL = ["#6366F1","#EC4899","#14B8A6","#F59E0B","#8B5CF6","#EF4444","#0EA5E9","#D97706","#3B82F6","#10B981","#F97316"];

// ─── Team ────────────────────────────────────────────────────────────────────
const TEAM = [
  { id:1, name:"Dev Shah", role:"Founder", avatar:"DS", channels:["all"], isAdmin:true },
  { id:2, name:"Ritish Maheshwari", role:"Social Media Head", avatar:"RM", channels:["all"], isAdmin:true },
  { id:3, name:"Aryan Solanki", role:"Instagram Head", avatar:"AS", channels:["instagram"], isAdmin:false },
  { id:4, name:"Anika Multani", role:"Instagram Intern", avatar:"AM", channels:["instagram"], isAdmin:false },
  { id:5, name:"Raveena", role:"Graphic Designer", avatar:"RA", channels:["instagram"], isAdmin:false, isFreelancer:true },
  { id:6, name:"Debu", role:"Video Editor", avatar:"DE", channels:["instagram"], isAdmin:false, isFreelancer:true },
  { id:7, name:"Sakib", role:"Video Editor", avatar:"SA", channels:["instagram"], isAdmin:false, isFreelancer:true },
  { id:8, name:"Yash", role:"LinkedIn Head", avatar:"YA", channels:["linkedin"], isAdmin:false },
  { id:9, name:"Pushkar Rathod", role:"X Head", avatar:"PR", channels:["x"], isAdmin:false },
  { id:10, name:"Rahul Mahto", role:"YouTube Head", avatar:"RM", channels:["youtube"], isAdmin:false, isFreelancer:true },
  { id:11, name:"Parth", role:"Video Editor", avatar:"PA", channels:["youtube"], isAdmin:false, isFreelancer:true },
];
const getUserChannels = (u) => u.channels[0]==="all" ? Object.keys(PLATFORMS) : u.channels;
const canAccess = (u, ch) => u.channels[0]==="all" || u.channels.includes(ch);

// ─── Data ────────────────────────────────────────────────────────────────────
const TODAY = "2026-02-09";
const captions = ["Why micro search funds are the future of SMB acquisitions","3 lessons from our first 6 months of operations","Behind the scenes: Due diligence process breakdown","Founder insight: What I wish I knew before acquiring","Weekly market update: SMB valuations trending upward","How we evaluate management teams in 48 hours","Search fund vs traditional PE — key differences","Our content creation workflow revealed","Top 5 industries for first-time acquirers in 2026","Community AMA recap: Your questions answered","The power of operator-led acquisitions","Deal sourcing strategies that actually work","Thumbnail design tips for business YouTube","LinkedIn algorithm — what changed this quarter","Building in public: Our social media dashboard","Zero to 10K followers in 90 days","The underrated power of long-form LinkedIn posts","Why every founder needs a personal brand strategy","Due diligence checklist — free template download","Lessons from failing at our first acquisition","What LPs look for in emerging fund managers","How to write hooks that stop the scroll","The real cost of running a micro search fund","Q1 performance review across all channels","New series announcement: Fund Fundamentals"];
const chOwners = { instagram:[3,4,5,6,7], linkedin:[8], youtube:[10,11], x:[9] };
const initPosts = () => {
  const posts=[]; const td=new Date(2026,1,9); const pk=Object.keys(PLATFORMS);
  for(let i=0;i<28;i++){
    const off=Math.floor(Math.random()*35)-12; const d=new Date(td); d.setDate(d.getDate()+off);
    const pl=pk[i%4]; const ows=chOwners[pl]; const ow=TEAM[ows[Math.floor(Math.random()*ows.length)]-1]||TEAM[0];
    const st=off<-4?"published":off<-1?(Math.random()>.3?"published":"approved"):off<3?["draft","in_review","approved"][Math.floor(Math.random()*3)]:"draft";
    posts.push({ id:i+1, platform:pl, postType:POST_TYPES[Math.floor(Math.random()*POST_TYPES.length)], postDate:d.toISOString().split("T")[0], caption:captions[i%captions.length], status:st, owner:ow, campaign:["Founder Brand","Education","Thought Leadership","Community"][Math.floor(Math.random()*4)],
      links:{ draft:i%3===0?"https://docs.google.com/doc/d/1xK...":null, canva:i%2===0?"https://canva.com/design/DAGx...":null, asset:i%5===0?"https://drive.google.com/file/...":null, live:st==="published"?`https://${pl}.com/p/${(i*7919).toString(36)}`:null },
      metrics:st==="published"?{impressions:Math.floor(Math.random()*50000)+1000,engagement:(Math.random()*8+1).toFixed(1),followers:Math.floor(Math.random()*200)-30}:null,
      threads:[{id:1,user:ow,text:"Draft is ready for review. Updated brand colors and CTA placement.",time:new Date(2026,1,9,10,0).getTime()},{id:2,user:TEAM[0],text:"Looks great — can we make the hook stronger?",time:new Date(2026,1,9,11,0).getTime()}],
      approvalLog:st==="approved"||st==="published"||st==="scheduled"?[{by:TEAM[0],at:"Feb 7, 2026 3:22 PM",action:"Approved"}]:[],
      auditLog:[{action:"Created",by:ow.name,at:"Feb 3, 2026 10:00 AM"},{action:"Caption edited",by:ow.name,at:"Feb 4, 2026 2:15 PM"},...(st!=="draft"?[{action:"Submitted for review",by:ow.name,at:"Feb 5, 2026 11:00 AM"}]:[]),...(st==="approved"||st==="published"?[{action:"Approved",by:"Dev Shah",at:"Feb 7, 2026 3:22 PM"}]:[]),...(st==="published"?[{action:"Live link submitted",by:ow.name,at:"Feb 8, 2026 9:00 AM"}]:[])],
      tasks:[{id:i*10+1,type:TASK_TYPES[Math.floor(Math.random()*TASK_TYPES.length)],assignee:ow,dueDate:d.toISOString().split("T")[0],status:st==="published"?"done":st==="approved"?"done":"in_progress"},{id:i*10+2,type:"Review",assignee:TEAM[0],dueDate:d.toISOString().split("T")[0],status:st==="published"||st==="approved"?"done":"todo"}],
    });
  }
  return posts.sort((a,b)=>a.postDate.localeCompare(b.postDate));
};
const ALERTS = [{id:1,type:"overdue",message:"Task overdue: Design carousel for Instagram",post:3,time:"2h ago",platform:"instagram"},{id:2,type:"missing_link",message:"Missing live link: LinkedIn post due yesterday",post:8,time:"5h ago",platform:"linkedin"},{id:3,type:"stuck_draft",message:"Post stuck in Draft 5 days: YouTube video",post:12,time:"1d ago",platform:"youtube"},{id:4,type:"edit_after_approval",message:"Caption edited after approval on Instagram Reel",post:5,time:"30m ago",platform:"instagram"},{id:5,type:"overdue",message:"Review task overdue for X thread post",post:15,time:"3h ago",platform:"x"},{id:6,type:"missing_link",message:"Missing live link: Instagram Carousel from Feb 6",post:2,time:"8h ago",platform:"instagram"}];
const initChats = () => ({
  instagram:[{id:1,user:TEAM[2],text:"Team, all reels for this week are in Canva. Please review before Wednesday.",time:new Date(2026,1,7,9,0).getTime(),pinned:true},{id:2,user:TEAM[4],text:"Starting on carousel graphics today — any color preference for Valentine's?",time:new Date(2026,1,7,10,30).getTime()},{id:3,user:TEAM[0],text:"Use the new pink-to-coral gradient from the brand kit.",time:new Date(2026,1,7,11,0).getTime()},{id:4,user:TEAM[5],text:"Video edits for the founder reel are done. Uploading to Drive now.",time:new Date(2026,1,8,14,0).getTime()},{id:5,user:TEAM[3],text:"Can someone review the captions doc? Added this week's copies.",time:new Date(2026,1,9,9,0).getTime()}],
  linkedin:[{id:1,user:TEAM[7],text:"Published the thought leadership post. 2K impressions in 3 hours.",time:new Date(2026,1,8,16,0).getTime(),pinned:true},{id:2,user:TEAM[0],text:"Great work Yash! Let's double down on long-form.",time:new Date(2026,1,8,17,0).getTime()},{id:3,user:TEAM[7],text:"Next post scheduled for Wednesday — LP expectations draft is in Google Docs.",time:new Date(2026,1,9,10,0).getTime()}],
  youtube:[{id:1,user:TEAM[9],text:"Need the thumbnail for the explainer video by Thursday. @Parth?",time:new Date(2026,1,7,11,0).getTime()},{id:2,user:TEAM[10],text:"On it. Two options by tomorrow EOD.",time:new Date(2026,1,7,12,0).getTime()},{id:3,user:TEAM[0],text:"Rahul, let's prep description and tags. SEO is key for this one.",time:new Date(2026,1,8,10,0).getTime(),pinned:true}],
  x:[{id:1,user:TEAM[8],text:"Posted the deal sourcing thread. 5 tweets with different tactics.",time:new Date(2026,1,8,9,0).getTime()},{id:2,user:TEAM[0],text:"Nice! Quote tweet the first one from the brand account.",time:new Date(2026,1,8,10,0).getTime(),pinned:true},{id:3,user:TEAM[8],text:"Done. Also drafted a thread for next week on SMB valuations.",time:new Date(2026,1,9,8,0).getTime()}],
});
const DEMO_CSV = `platform,post_type,post_date,caption,owner,canva_link,draft_link,status,campaign\nInstagram,Reel,2026-03-05,"Founder insight: Why I chose micro search funds",Dev Shah,https://canva.com/design/example1,https://docs.google.com/doc/example1,Draft,Founder Brand\nInstagram,Carousel,2026-03-07,"5 KPIs every search fund investor should track",Aryan Solanki,https://canva.com/design/example2,https://docs.google.com/doc/example2,Draft,Education\nLinkedIn,Post,2026-03-08,"Weekly insight: What makes a great operator?",Yash,,https://docs.google.com/doc/example3,In Review,Thought Leadership\nLinkedIn,Document,2026-03-12,"Search Fund 101 - Complete Guide PDF",Dev Shah,https://canva.com/design/example4,,Draft,Education\nYouTube,Video,2026-03-10,"Search Fund Explained in 10 Minutes",Rahul Mahto,https://canva.com/design/example5,https://docs.google.com/doc/example5,Draft,Education\nYouTube,Video,2026-03-15,"Day in the Life of a Search Fund Founder",Rahul Mahto,,,Draft,Founder Brand\nX,Thread,2026-03-06,"Hot take: Why PE firms are losing deals to micro searchers",Pushkar Rathod,,https://docs.google.com/doc/example6,Draft,Thought Leadership\nX,Post,2026-03-09,"Deal sourcing tip of the week",Pushkar Rathod,,,Draft,Community\nInstagram,Static,2026-03-11,"Quote card: The best acquisitions start with operator conviction",Raveena,https://canva.com/design/example7,,Draft,Founder Brand\nInstagram,Reel,2026-03-14,"Behind the scenes: How we run due diligence",Debu,https://canva.com/design/example8,https://docs.google.com/doc/example8,Draft,Education`;

// ─── Utilities ───────────────────────────────────────────────────────────────
const fmt=n=>n>=1000?(n/1000).toFixed(1)+"K":""+n;
const fmtTime=ts=>{const d=new Date(ts);const h=d.getHours();const m=d.getMinutes();return `${h>12?h-12:h||12}:${m<10?"0"+m:m} ${h>=12?"PM":"AM"}`;};
const fmtDate=ts=>{const d=new Date(ts);const mn=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return `${mn[d.getMonth()]} ${d.getDate()}`;};
const getWeek=(base)=>{const d=new Date(base);const day=d.getDay();const m=new Date(d);m.setDate(d.getDate()-(day===0?6:day-1));return Array.from({length:7},(_,i)=>{const dd=new Date(m);dd.setDate(m.getDate()+i);return dd;});};
const getMonth=(y,mo)=>{const f=new Date(y,mo,1);const l=new Date(y,mo+1,0);const sd=(f.getDay()+6)%7;const d=[];for(let i=0;i<sd;i++)d.push(null);for(let i=1;i<=l.getDate();i++)d.push(new Date(y,mo,i));while(d.length%7!==0)d.push(null);return d;};
const MN=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DN=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--f:'Outfit',sans-serif;--fm:'JetBrains Mono',monospace;--r:12px;--rs:8px;--rl:16px;--t:0.18s ease;--blue:#3B82F6;--blue-bg:#EFF6FF;--green:#22C55E;--green-bg:#F0FDF4;--red:#EF4444;--red-bg:#FEF2F2;--amber:#F59E0B;--amber-bg:#FFFBEB;--purple:#8B5CF6;--purple-bg:#F5F3FF}
[data-theme="light"]{--bg:#F8FAFC;--card:#FFFFFF;--card2:#F8FAFC;--card3:#F1F5F9;--border:#E2E8F0;--border2:#CBD5E1;--text:#0F172A;--text2:#475569;--text3:#94A3B8;--shadow:0 1px 3px rgba(0,0,0,.04),0 1px 2px rgba(0,0,0,.06);--shadow-m:0 4px 6px -1px rgba(0,0,0,.06),0 2px 4px -2px rgba(0,0,0,.06);--shadow-l:0 10px 25px -5px rgba(0,0,0,.08),0 8px 10px -6px rgba(0,0,0,.06);--shadow-xl:0 20px 50px -12px rgba(0,0,0,.15)}
[data-theme="dark"]{--bg:#0B0E14;--card:#131720;--card2:#1A1F2E;--card3:#222838;--border:#1E2536;--border2:#2D3548;--text:#E2E8F0;--text2:#94A3B8;--text3:#64748B;--shadow:0 1px 3px rgba(0,0,0,.3);--shadow-m:0 4px 6px rgba(0,0,0,.35);--shadow-l:0 10px 25px rgba(0,0,0,.4);--shadow-xl:0 20px 50px rgba(0,0,0,.55)}
body,#root{font-family:var(--f);background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased}
.app{display:grid;grid-template-columns:260px 1fr;min-height:100vh}

/* Sidebar */
.sb{background:var(--card);border-right:1px solid var(--border);padding:24px 0;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.sb-logo{padding:0 24px 24px;border-bottom:1px solid var(--border);margin-bottom:16px}
.sb-logo-row{display:flex;align-items:center;gap:10px}
.sb-logo-icon{width:36px;height:36px;background:linear-gradient(135deg,#3B82F6,#6366F1);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff}
.sb-logo h1{font-size:17px;font-weight:700;letter-spacing:-.4px;color:var(--text)}
.sb-logo p{font-size:12px;color:var(--text3);margin-top:1px;padding-left:46px}
.sb-section{padding:0 12px;margin-bottom:8px}
.sb-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;color:var(--text3);padding:12px 14px 6px}
.sb-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--rs);cursor:pointer;transition:all var(--t);font-size:14px;color:var(--text2);font-weight:450}
.sb-item:hover{background:var(--card2);color:var(--text)}
.sb-item.active{background:var(--blue-bg);color:var(--blue);font-weight:600}
[data-theme="dark"] .sb-item.active{background:rgba(59,130,246,.12)}
.sb-item .icon{width:20px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sb-badge{margin-left:auto;background:var(--red);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:12px;min-width:20px;text-align:center}
.sb-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.sb-count{margin-left:auto;font-size:11px;color:var(--text3);font-family:var(--fm)}
.sb-footer{margin-top:auto;padding:16px 12px 0;border-top:1px solid var(--border)}
.sb-user{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--rs)}
.sb-user-info{flex:1}.sb-user-name{font-size:13px;font-weight:600;color:var(--text)}.sb-user-role{font-size:11px;color:var(--text3)}
.sb-logout{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--rs);cursor:pointer;transition:all var(--t);font-size:13px;color:var(--red);font-weight:500;margin-top:4px}
.sb-logout:hover{background:var(--red-bg)}

/* Main */
.main{padding:28px 36px;overflow-y:auto;max-height:100vh}

/* Page Header */
.page-h{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}
.page-h h2{font-size:24px;font-weight:700;letter-spacing:-.5px}
.page-h-sub{font-size:13px;color:var(--text3);margin-top:3px}
.page-h-actions{display:flex;gap:10px;align-items:center}

/* Buttons */
.btn{padding:9px 18px;border-radius:var(--rs);border:1px solid var(--border);background:var(--card);color:var(--text);font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all var(--t);font-family:var(--f);line-height:1}
.btn:hover{background:var(--card2);border-color:var(--border2)}.btn-p{background:var(--blue);border-color:var(--blue);color:#fff}.btn-p:hover{background:#2563EB;border-color:#2563EB}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:6px}.btn-ghost{background:transparent;border-color:transparent;color:var(--text2)}.btn-ghost:hover{background:var(--card2);color:var(--text)}
.btn-icon{padding:8px;border:none;background:transparent;color:var(--text2);cursor:pointer;display:flex;align-items:center;border-radius:var(--rs);transition:all var(--t)}.btn-icon:hover{background:var(--card2);color:var(--text)}

/* Theme Toggle */
.theme-toggle{display:flex;align-items:center;background:var(--card2);border:1px solid var(--border);border-radius:20px;padding:3px}
.theme-btn{padding:5px 8px;border:none;background:transparent;color:var(--text3);cursor:pointer;border-radius:16px;display:flex;align-items:center;transition:all var(--t)}.theme-btn.active{background:var(--card);color:var(--text);box-shadow:var(--shadow)}

/* Stat Cards - Sociolyze style */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.stat-card{background:var(--card);border:1px solid var(--border);border-radius:var(--rl);padding:20px 22px;position:relative;transition:all var(--t);overflow:hidden}
.stat-card:hover{box-shadow:var(--shadow-m);transform:translateY(-1px)}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--rl) var(--rl) 0 0}
.stat-card[data-accent="blue"]::before{background:var(--blue)}.stat-card[data-accent="green"]::before{background:var(--green)}.stat-card[data-accent="amber"]::before{background:var(--amber)}.stat-card[data-accent="red"]::before{background:var(--red)}.stat-card[data-accent="purple"]::before{background:var(--purple)}
.stat-label{font-size:12px;font-weight:500;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px}
.stat-value{font-size:30px;font-weight:700;font-family:var(--fm);letter-spacing:-1.5px;color:var(--text)}
.stat-change{display:inline-flex;align-items:center;gap:3px;font-size:12px;font-weight:600;padding:2px 8px;border-radius:20px;margin-top:6px}
.stat-change.up{background:var(--green-bg);color:var(--green)}.stat-change.down{background:var(--red-bg);color:var(--red)}
.stat-sub{font-size:12px;color:var(--text3);margin-top:6px}

/* Platform Cards */
.plat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.plat-card{background:var(--card);border:1px solid var(--border);border-radius:var(--rl);padding:18px 20px;transition:all var(--t);cursor:pointer}
.plat-card:hover{box-shadow:var(--shadow-m)}
.plat-card-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.plat-card-name{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600}
.plat-icon{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;letter-spacing:-.3px}
.plat-metrics{display:flex;justify-content:space-between}.plat-m{text-align:center}.plat-m .v{font-size:20px;font-weight:700;font-family:var(--fm)}.plat-m .l{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}

/* Alert Panel */
.alert-panel{background:var(--card);border:1px solid var(--border);border-radius:var(--rl);margin-bottom:28px;overflow:hidden}
.alert-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid var(--border)}
.alert-head h3{font-size:15px;font-weight:600;display:flex;align-items:center;gap:8px}
.alert-item{display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid var(--border);cursor:pointer;transition:background var(--t)}
.alert-item:last-child{border-bottom:none}.alert-item:hover{background:var(--card2)}
.alert-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.alert-dot.overdue{background:var(--red)}.alert-dot.missing_link{background:var(--amber)}.alert-dot.stuck_draft{background:var(--purple)}.alert-dot.edit_after_approval{background:var(--blue)}
.alert-msg{flex:1;font-size:13px;color:var(--text2)}.alert-time{font-size:11px;color:var(--text3);font-family:var(--fm);white-space:nowrap}

/* Tables */
.table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--border);border-radius:var(--rl);overflow:hidden}
.table th{text-align:left;padding:12px 16px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--text3);background:var(--card2);border-bottom:1px solid var(--border)}
.table td{padding:12px 16px;font-size:13px;border-bottom:1px solid var(--border);color:var(--text2)}.table tr:last-child td{border-bottom:none}.table tbody tr{cursor:pointer;transition:background var(--t)}.table tbody tr:hover{background:var(--card2)}

/* Status Badge */
.status-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;letter-spacing:.2px}
/* Platform Tag */
.plat-tag{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.2px}
/* Avatar */
.avatar{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0}

/* Filter Bar */
.filter-bar{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;align-items:center}
.filter-chip{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:500;border:1px solid var(--border);background:var(--card);color:var(--text2);cursor:pointer;transition:all var(--t);display:flex;align-items:center;gap:5px}
.filter-chip:hover{border-color:var(--border2);background:var(--card2)}.filter-chip.active{background:var(--blue);border-color:var(--blue);color:#fff}

/* Tabs */
.tabs{display:flex;gap:0;border-bottom:2px solid var(--border);margin-bottom:24px}
.tab{padding:11px 20px;font-size:13px;font-weight:500;color:var(--text3);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all var(--t)}.tab:hover{color:var(--text2)}.tab.active{color:var(--blue);border-bottom-color:var(--blue);font-weight:600}

/* Calendar */
.cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.cal-title{display:flex;align-items:center;gap:12px}
.cal-title h3{font-size:16px;font-weight:600;min-width:240px;text-align:center}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:var(--rl);overflow:hidden}
.cal-header{background:var(--card2);padding:10px;text-align:center;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.8px;color:var(--text3)}
.cal-day{background:var(--card);min-height:110px;padding:8px;cursor:pointer;transition:background var(--t)}.cal-day:hover{background:var(--card2)}.cal-day.today{background:var(--blue-bg)}
[data-theme="dark"] .cal-day.today{background:rgba(59,130,246,.06)}
.cal-day.empty{opacity:.35}
.cal-date{font-size:13px;font-weight:600;font-family:var(--fm);color:var(--text2);margin-bottom:4px}
.cal-date.today{background:var(--blue);color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px}
.cal-date.other{color:var(--text3);opacity:.4}
.cal-post{padding:3px 7px;border-radius:6px;font-size:11px;margin-bottom:3px;cursor:pointer;display:flex;align-items:center;gap:4px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;border-left:3px solid;font-weight:500;transition:opacity var(--t)}.cal-post:hover{opacity:.75}

/* Slide Panel */
.panel-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.4);z-index:100;display:flex;justify-content:flex-end;animation:fadeIn .15s ease}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
.panel{width:700px;max-width:94vw;background:var(--card);border-left:1px solid var(--border);overflow-y:auto;animation:slideIn .2s ease;box-shadow:var(--shadow-xl)}
.panel-header{position:sticky;top:0;background:var(--card);border-bottom:1px solid var(--border);padding:16px 24px;display:flex;align-items:center;justify-content:space-between;z-index:5}
.panel-body{padding:24px}
.panel-section{margin-bottom:24px}
.panel-section-title{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:10px;display:flex;align-items:center;gap:7px}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.detail-field{background:var(--card2);border-radius:var(--rs);padding:12px 14px}.detail-field .label{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}.detail-field .value{font-size:13px;color:var(--text);font-weight:500}
.link-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--card2);border-radius:var(--rs);margin-bottom:6px}
.link-type{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.4px;color:var(--text3);min-width:55px}
.link-url{color:var(--blue);font-size:12px;text-decoration:none;font-family:var(--fm);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.link-url:hover{text-decoration:underline}
.metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.metric-card{background:var(--card2);border-radius:var(--rs);padding:14px;text-align:center}.metric-card .v{font-size:22px;font-weight:700;font-family:var(--fm)}.metric-card .l{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-top:3px}

/* Thread / Comments */
.thread-box{background:var(--card2);border-radius:var(--rl);overflow:hidden}
.thread-msg{display:flex;gap:12px;padding:14px 16px;border-bottom:1px solid var(--border)}.thread-msg:last-of-type{border-bottom:none}
.thread-msg-body{flex:1}.thread-msg-meta{display:flex;align-items:center;gap:8px;margin-bottom:3px}
.thread-name{font-size:13px;font-weight:600;color:var(--text)}.thread-time{font-size:11px;color:var(--text3);font-family:var(--fm)}
.thread-text{font-size:13px;color:var(--text2);line-height:1.55}
.thread-input{display:flex;gap:10px;padding:12px 16px;background:var(--card3);border-top:1px solid var(--border)}
.input{flex:1;background:var(--card);border:1px solid var(--border);border-radius:var(--rs);padding:9px 14px;color:var(--text);font-size:13px;font-family:var(--f);outline:none;transition:border var(--t)}.input:focus{border-color:var(--blue)}.input::placeholder{color:var(--text3)}

/* Task rows */
.task-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--card2);border-radius:var(--rs);margin-bottom:6px}
.task-check{width:20px;height:20px;border-radius:6px;border:2px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.task-check.done{background:var(--green);border-color:var(--green);color:#fff}
.task-check.in_progress{background:var(--amber);border-color:var(--amber);color:#fff}
.task-badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}

/* Audit Log */
.audit-item{display:flex;align-items:flex-start;gap:12px;padding:8px 0;position:relative}
.audit-line{position:absolute;left:11px;top:28px;bottom:-8px;width:2px;background:var(--border);border-radius:1px}
.audit-dot{width:22px;height:22px;border-radius:50%;background:var(--card2);border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;z-index:1}
.audit-dot.done{background:var(--green);border-color:var(--green)}

/* Login */
.login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);padding:24px}
.login-box{background:var(--card);border:1px solid var(--border);border-radius:var(--rl);padding:44px;width:460px;max-width:100%;box-shadow:var(--shadow-xl)}
.login-box h1{font-size:24px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:10px}
.login-box .sub{font-size:13px;color:var(--text3);margin-bottom:32px}
.login-list{display:flex;flex-direction:column;gap:6px}
.login-user{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1px solid var(--border);border-radius:var(--r);cursor:pointer;transition:all var(--t)}
.login-user:hover{background:var(--card2);border-color:var(--border2);box-shadow:var(--shadow)}
.login-user .info{flex:1}.login-user .info .name{font-size:14px;font-weight:600;color:var(--text)}.login-user .info .role{font-size:11.5px;color:var(--text3)}
.login-user .channels{display:flex;gap:4px}

/* Modal */
.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;animation:fadeIn .15s ease}
.modal{background:var(--card);border:1px solid var(--border);border-radius:var(--rl);padding:32px;width:560px;max-width:92vw;max-height:85vh;overflow-y:auto;box-shadow:var(--shadow-xl)}
.modal h3{font-size:18px;font-weight:700;margin-bottom:4px;display:flex;align-items:center;gap:8px}
.modal .sub{font-size:12.5px;color:var(--text3);margin-bottom:24px}
.modal-field{margin-bottom:16px}
.modal-field label{font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:5px}
.modal-field input,.modal-field select,.modal-field textarea{width:100%;padding:10px 14px;border:1px solid var(--border);border-radius:var(--rs);background:var(--card2);color:var(--text);font-size:13px;font-family:var(--f);outline:none;transition:border var(--t);resize:vertical}
.modal-field input:focus,.modal-field select:focus,.modal-field textarea:focus{border-color:var(--blue)}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:24px}

/* Chat Page */
.chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 150px);background:var(--card);border:1px solid var(--border);border-radius:var(--rl);overflow:hidden}
.chat-header{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.chat-header h3{font-size:15px;font-weight:600;display:flex;align-items:center;gap:10px}
.chat-body{flex:1;overflow-y:auto;padding:16px 20px;display:flex;flex-direction:column;gap:4px}
.chat-msg{display:flex;gap:12px;padding:10px 0}
.chat-msg.pinned{background:var(--blue-bg);margin:0 -20px;padding:10px 20px;border-left:3px solid var(--blue)}
[data-theme="dark"] .chat-msg.pinned{background:rgba(59,130,246,.06)}
.chat-msg-name{font-size:13px;font-weight:600;color:var(--text)}
.chat-msg-time{font-size:11px;color:var(--text3);font-family:var(--fm)}
.chat-msg-pin{font-size:10px;color:var(--blue);display:flex;align-items:center;gap:3px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}
.chat-msg-text{font-size:13.5px;color:var(--text2);line-height:1.55;margin-top:2px}
.chat-input{display:flex;gap:10px;padding:14px 20px;border-top:1px solid var(--border);background:var(--card2)}

/* CSV */
.upload-zone{border:2px dashed var(--border2);border-radius:var(--rl);padding:50px;text-align:center;cursor:pointer;transition:all var(--t);background:var(--card)}.upload-zone:hover{border-color:var(--blue);background:var(--blue-bg)}
[data-theme="dark"] .upload-zone:hover{background:rgba(59,130,246,.04)}
.csv-preview{max-height:320px;overflow:auto;border:1px solid var(--border);border-radius:var(--rl);margin:16px 0}
.csv-preview table{width:100%;border-collapse:collapse;font-size:12px}
.csv-preview th{background:var(--card2);padding:8px 12px;text-align:left;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;font-size:10px;position:sticky;top:0}
.csv-preview td{padding:7px 12px;border-bottom:1px solid var(--border);color:var(--text2)}
.csv-preview tr.error td{background:rgba(239,68,68,.04)}
.csv-status{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:var(--rs);font-size:13px;font-weight:500;margin:10px 0}
.csv-status.ok{background:var(--green-bg);color:var(--green)}.csv-status.err{background:var(--red-bg);color:var(--red)}

/* Notification Bell */
.notif-bell{position:relative;cursor:pointer;padding:8px;display:flex;align-items:center;color:var(--text2);border-radius:var(--rs);transition:all var(--t)}.notif-bell:hover{background:var(--card2);color:var(--text)}
.notif-count{position:absolute;top:2px;right:2px;background:var(--red);color:#fff;font-size:9px;font-weight:700;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center}

/* Misc */
.empty-state{text-align:center;padding:48px 24px;color:var(--text3)}
.section-title{font-size:15px;font-weight:600;margin-bottom:14px;color:var(--text)}
.link-icons{display:flex;gap:6px;align-items:center}
.link-icon-box{width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:4px}
.approval-check{width:22px;height:22px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff}
.pinned-area{padding:10px 20px;background:var(--blue-bg);border-bottom:1px solid var(--border)}
[data-theme="dark"] .pinned-area{background:rgba(59,130,246,.05)}
`;

// ─── Small Components ────────────────────────────────────────────────────────
const SB = ({status}) => {const s=STATUSES[status];return <span className="status-badge" style={{background:s.bg,color:s.color}}><span style={{width:6,height:6,borderRadius:"50%",background:s.color}}/>{s.label}</span>;};
const PT = ({platform}) => {const p=PLATFORMS[platform];return <span className="plat-tag" style={{background:p.bg,color:p.color}}>{p.abbr}</span>;};
const AV = ({user,size=28}) => <div className="avatar" style={{background:ACOL[user.id%ACOL.length],width:size,height:size,fontSize:size*.36}}>{user.avatar}</div>;
const PI = ({platform}) => {const p=PLATFORMS[platform];return <div className="plat-icon" style={{background:p.color}}>{p.abbr}</div>;};
const TT = () => {const{theme,setTheme}=useTheme();return <div className="theme-toggle"><button className={`theme-btn ${theme==="light"?"active":""}`} onClick={()=>setTheme("light")}>{I.sun}</button><button className={`theme-btn ${theme==="dark"?"active":""}`} onClick={()=>setTheme("dark")}>{I.moon}</button></div>;};
const TSB = ({status}) => {const c={todo:["#94A3B8","#F1F5F9"],in_progress:["#F59E0B","#FFFBEB"],done:["#22C55E","#F0FDF4"],blocked:["#EF4444","#FEF2F2"]};return <span className="task-badge" style={{background:c[status][1],color:c[status][0]}}>{TASK_STATUSES[status]}</span>;};

// ─── Login ───────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}){
  return <div className="login-wrap"><div className="login-box">
    <h1><span style={{color:"var(--blue)"}}>{I.zap}</span> Pocket Fund</h1>
    <div className="sub">Social Command Center — Select your account</div>
    <div className="login-list">{TEAM.map(u=><div key={u.id} className="login-user" onClick={()=>onLogin(u)}><AV user={u} size={36}/><div className="info"><div className="name">{u.name}{u.isAdmin&&<span style={{fontSize:10,background:"var(--blue-bg)",color:"var(--blue)",padding:"2px 6px",borderRadius:10,marginLeft:6,fontWeight:700}}>ADMIN</span>}</div><div className="role">{u.role}{u.isFreelancer?" · Freelancer":""}</div></div><div className="channels">{getUserChannels(u).map(ch=><span key={ch} className="sb-dot" style={{background:PLATFORMS[ch]?.color}} title={PLATFORMS[ch]?.label}/>)}</div></div>)}</div>
  </div></div>;
}

// ─── Add Post Modal ──────────────────────────────────────────────────────────
function AddPostModal({onClose,onAdd,defaultDate,defaultPlatform}){
  const{user}=useAuth();const ch=getUserChannels(user);
  const[f,sf]=useState({platform:defaultPlatform||ch[0],postType:"Post",postDate:defaultDate||TODAY,caption:"",campaign:"Founder Brand",owner:user.name,draftLink:"",canvaLink:""});
  const set=(k,v)=>sf(p=>({...p,[k]:v}));
  const submit=()=>{if(!f.caption.trim()){alert("Caption is required");return;}onAdd(f);onClose();};
  return <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <h3>{I.plus} Create New Post</h3><div className="sub">Add a new content item to the calendar</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div className="modal-field"><label>Platform</label><select value={f.platform} onChange={e=>set("platform",e.target.value)}>{ch.map(c=><option key={c} value={c}>{PLATFORMS[c].label}</option>)}</select></div>
      <div className="modal-field"><label>Post Type</label><select value={f.postType} onChange={e=>set("postType",e.target.value)}>{POST_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div className="modal-field"><label>Post Date</label><input type="date" value={f.postDate} onChange={e=>set("postDate",e.target.value)}/></div>
      <div className="modal-field"><label>Campaign</label><select value={f.campaign} onChange={e=>set("campaign",e.target.value)}>{["Founder Brand","Education","Thought Leadership","Community"].map(c=><option key={c}>{c}</option>)}</select></div>
    </div>
    <div className="modal-field"><label>Caption</label><textarea rows={3} placeholder="Write your caption..." value={f.caption} onChange={e=>set("caption",e.target.value)}/></div>
    <div className="modal-field"><label>Owner</label><select value={f.owner} onChange={e=>set("owner",e.target.value)}>{TEAM.filter(t=>canAccess(t,f.platform)).map(t=><option key={t.id} value={t.name}>{t.name} ({t.role})</option>)}</select></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <div className="modal-field"><label>Draft Link</label><input placeholder="https://docs.google.com/..." value={f.draftLink} onChange={e=>set("draftLink",e.target.value)}/></div>
      <div className="modal-field"><label>Canva Link</label><input placeholder="https://canva.com/..." value={f.canvaLink} onChange={e=>set("canvaLink",e.target.value)}/></div>
    </div>
    <div className="modal-actions"><button className="btn" onClick={onClose}>Cancel</button><button className="btn btn-p" onClick={submit}>{I.plus} Create Post</button></div>
  </div></div>;
}

// ─── Live Link Modal ─────────────────────────────────────────────────────────
function LiveLinkModal({post,onClose,onSubmit}){
  const[url,setUrl]=useState("");const[err,setErr]=useState("");
  const go=()=>{if(!url.trim()){setErr("URL is required");return;}if(!url.startsWith("https://")){setErr("Must start with https://");return;}onSubmit(post.id,url);onClose();};
  return <div className="modal-overlay" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <h3>Submit Live Link</h3><div className="sub">Paste the published URL for this {post.postType} on {PLATFORMS[post.platform].label}</div>
    <div className="modal-field"><label>Live URL</label><input placeholder={`https://${post.platform}.com/p/...`} value={url} onChange={e=>{setUrl(e.target.value);setErr("");}}/>{err&&<div style={{color:"var(--red)",fontSize:11,marginTop:4}}>{err}</div>}</div>
    <div style={{background:"var(--card2)",borderRadius:"var(--rs)",padding:"14px 16px",marginBottom:16}}>
      <div style={{fontSize:11,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:4,fontWeight:600}}>What happens next</div>
      <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6}}>URL validated and recorded. Post status changes to Published, link gets locked, and founder is notified.</div>
    </div>
    <div className="modal-actions"><button className="btn" onClick={onClose}>Cancel</button><button className="btn btn-p" onClick={go}>{I.link} Submit Link</button></div>
  </div></div>;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({page,nav,alertCount,posts}){
  const{user,logout}=useAuth();const ch=getUserChannels(user);
  const revC=posts.filter(p=>p.status==="in_review"&&canAccess(user,p.platform)).length;
  return <aside className="sb">
    <div className="sb-logo"><div className="sb-logo-row"><div className="sb-logo-icon">{I.zap}</div><h1>Pocket Fund</h1></div><p>Social Command Center</p></div>
    <div className="sb-section">
      <div className="sb-label">Overview</div>
      {user.isAdmin&&<div className={`sb-item ${page==="dashboard"?"active":""}`} onClick={()=>nav("dashboard")}><span className="icon">{I.dashboard}</span>Dashboard{alertCount>0&&<span className="sb-badge">{alertCount}</span>}</div>}
      <div className={`sb-item ${page==="calendar"?"active":""}`} onClick={()=>nav("calendar")}><span className="icon">{I.calendar}</span>Calendar</div>
      <div className={`sb-item ${page==="posts"?"active":""}`} onClick={()=>nav("posts")}><span className="icon">{I.posts}</span>All Posts</div>
      {(user.isAdmin||user.role.includes("Head"))&&<div className={`sb-item ${page==="approvals"?"active":""}`} onClick={()=>nav("approvals")}><span className="icon">{I.check}</span>Approvals{revC>0&&<span className="sb-badge">{revC}</span>}</div>}
      <div className={`sb-item ${page==="tasks"?"active":""}`} onClick={()=>nav("tasks")}><span className="icon">{I.task}</span>Tasks</div>
    </div>
    <div className="sb-section">
      <div className="sb-label">Channels</div>
      {ch.map(c=><div key={c} className={`sb-item ${page===`ch-${c}`?"active":""}`} onClick={()=>nav(`ch-${c}`)}><span className="sb-dot" style={{background:PLATFORMS[c].color}}/>{PLATFORMS[c].label}<span className="sb-count">{posts.filter(p=>p.platform===c).length}</span></div>)}
    </div>
    <div className="sb-section">
      <div className="sb-label">Chat</div>
      {ch.map(c=><div key={`chat-${c}`} className={`sb-item ${page===`chat-${c}`?"active":""}`} onClick={()=>nav(`chat-${c}`)}><span className="icon">{I.chat}</span>{PLATFORMS[c].label}</div>)}
    </div>
    {(user.isAdmin||user.role.includes("Head"))&&<div className="sb-section">
      <div className="sb-label">Tools</div>
      <div className={`sb-item ${page==="upload"?"active":""}`} onClick={()=>nav("upload")}><span className="icon">{I.upload}</span>CSV Upload</div>
      {user.isAdmin&&<div className={`sb-item ${page==="team"?"active":""}`} onClick={()=>nav("team")}><span className="icon">{I.team}</span>Team</div>}
    </div>}
    <div className="sb-footer">
      <div className="sb-user"><AV user={user} size={32}/><div className="sb-user-info"><div className="sb-user-name">{user.name}</div><div className="sb-user-role">{user.role}</div></div><TT/></div>
      <div className="sb-logout" onClick={logout}><span className="icon">{I.logout}</span>Sign Out</div>
    </div>
  </aside>;
}

// ─── Post Detail ─────────────────────────────────────────────────────────────
function PostDetail({post,onClose,onThread,onSubmitLive}){
  const[msg,setMsg]=useState("");const[showLL,setShowLL]=useState(false);const{user}=useAuth();
  const send=()=>{if(!msg.trim())return;onThread(post.id,msg);setMsg("");};
  const kd=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};
  if(!post)return null;
  return<><div className="panel-overlay" onClick={onClose}><div className="panel" onClick={e=>e.stopPropagation()}>
    <div className="panel-header"><div style={{display:"flex",alignItems:"center",gap:10}}><PT platform={post.platform}/><SB status={post.status}/><span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--fm)"}}>#{post.id}</span></div><button className="btn-icon" onClick={onClose}>{I.close}</button></div>
    <div className="panel-body">
      <div className="panel-section"><div className="panel-section-title">{I.posts} Caption</div><p style={{fontSize:14,lineHeight:1.7,color:"var(--text)",background:"var(--card2)",padding:"14px 16px",borderRadius:"var(--rs)"}}>{post.caption}</p></div>
      <div className="panel-section"><div className="panel-section-title">{I.dashboard} Details</div><div className="detail-grid">
        <div className="detail-field"><div className="label">Post Type</div><div className="value">{post.postType}</div></div>
        <div className="detail-field"><div className="label">Post Date</div><div className="value">{post.postDate}</div></div>
        <div className="detail-field"><div className="label">Campaign</div><div className="value">{post.campaign}</div></div>
        <div className="detail-field"><div className="label">Owner</div><div className="value" style={{display:"flex",alignItems:"center",gap:8}}><AV user={post.owner} size={22}/>{post.owner.name}</div></div>
      </div></div>
      <div className="panel-section"><div className="panel-section-title">{I.link} Links</div>
        {post.links.draft&&<div className="link-row"><span className="link-type">Draft</span><a className="link-url" href={post.links.draft}>{post.links.draft}</a></div>}
        {post.links.canva&&<div className="link-row"><span className="link-type">Canva</span><a className="link-url" href={post.links.canva}>{post.links.canva}</a></div>}
        {post.links.asset&&<div className="link-row"><span className="link-type">Asset</span><a className="link-url" href={post.links.asset}>{post.links.asset}</a></div>}
        {post.links.live?<div className="link-row" style={{borderLeft:"3px solid var(--green)"}}><span className="link-type" style={{color:"var(--green)"}}>Live</span><a className="link-url" href={post.links.live}>{post.links.live}</a><span style={{color:"var(--text3)"}}>{I.lock}</span></div>
        :<button className="btn btn-p" style={{width:"100%",marginTop:6}} onClick={()=>setShowLL(true)}>{I.link} Submit Live Link</button>}
      </div>
      {post.metrics&&<div className="panel-section"><div className="panel-section-title">{I.chart} Performance</div><div className="metric-grid"><div className="metric-card"><div className="v">{fmt(post.metrics.impressions)}</div><div className="l">Impressions</div></div><div className="metric-card"><div className="v">{post.metrics.engagement}%</div><div className="l">Engagement</div></div><div className="metric-card"><div className="v" style={{color:post.metrics.followers>=0?"var(--green)":"var(--red)"}}>{post.metrics.followers>=0?"+":""}{post.metrics.followers}</div><div className="l">Followers</div></div></div></div>}
      <div className="panel-section"><div className="panel-section-title">{I.task} Tasks ({post.tasks.length})</div>
        {post.tasks.map(t=><div key={t.id} className="task-row"><div className={`task-check ${t.status}`}>{t.status==="done"&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{t.type}</div><div style={{fontSize:11,color:"var(--text3)"}}>Assigned to {t.assignee.name} · Due {t.dueDate}</div></div><TSB status={t.status}/></div>)}
      </div>
      {(user.isAdmin||user.role.includes("Head"))&&post.status==="in_review"&&<div className="panel-section"><div style={{display:"flex",gap:10}}><button className="btn btn-p" style={{flex:1}}>{I.check} Approve</button><button className="btn" style={{flex:1,borderColor:"var(--red)",color:"var(--red)"}}>Request Changes</button></div></div>}
      {post.approvalLog.length>0&&<div className="panel-section"><div className="panel-section-title">{I.check} Approval Log</div>{post.approvalLog.map((l,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"var(--card2)",borderRadius:"var(--rs)",marginBottom:6}}><div className="approval-check"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg></div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{l.action} by {l.by.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{l.at}</div></div></div>)}</div>}
      <div className="panel-section"><div className="panel-section-title">{I.hist} Audit Log</div><div style={{paddingLeft:4}}>{post.auditLog.map((a,i)=><div key={i} className="audit-item">{i<post.auditLog.length-1&&<div className="audit-line"/>}<div className={`audit-dot ${i===post.auditLog.length-1?"done":""}`}/><div><div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{a.action}</div><div style={{fontSize:11,color:"var(--text3)"}}>{a.by} · {a.at}</div></div></div>)}</div></div>
      <div className="panel-section"><div className="panel-section-title">{I.chat} Thread ({post.threads.length})</div>
        <div className="thread-box">
          {post.threads.map(m=><div key={m.id} className="thread-msg"><AV user={m.user} size={30}/><div className="thread-msg-body"><div className="thread-msg-meta"><span className="thread-name">{m.user.name}</span><span className="thread-time">{typeof m.time==="number"?fmtTime(m.time):m.time}</span></div><div className="thread-text">{m.text}</div></div></div>)}
          <div className="thread-input"><input className="input" placeholder="Reply to thread..." value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={kd}/><button className="btn btn-p btn-sm" onClick={send}>{I.send}</button></div>
        </div>
      </div>
    </div>
  </div></div>{showLL&&<LiveLinkModal post={post} onClose={()=>setShowLL(false)} onSubmit={onSubmitLive}/>}</>;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function DashboardPage({sel,posts}){
  const{user}=useAuth();const ua=ALERTS.filter(a=>canAccess(user,a.platform));const up=posts.filter(p=>canAccess(user,p.platform));
  const todayP=up.filter(p=>p.postDate===TODAY);const pubTotal=up.filter(p=>p.status==="published").length;
  return<div>
    <div className="page-h"><div><h2>Command Center</h2><div className="page-h-sub">Monday, February 9, 2026 — Welcome back, {user.name.split(" ")[0]}</div></div><div className="page-h-actions"><div className="notif-bell">{I.bell}<span className="notif-count">{ua.length}</span></div></div></div>
    <div className="stats-grid">
      <div className="stat-card" data-accent="blue"><div className="stat-label">Today's Posts</div><div className="stat-value">{todayP.length}</div><div className="stat-sub">{todayP.filter(p=>p.status==="published").length} published today</div></div>
      <div className="stat-card" data-accent="green"><div className="stat-label">Published Total</div><div className="stat-value">{pubTotal}</div><span className="stat-change up">{I.arrowUp} 12.4%</span></div>
      <div className="stat-card" data-accent="amber"><div className="stat-label">Awaiting Approval</div><div className="stat-value">{up.filter(p=>p.status==="in_review").length}</div><div className="stat-sub">Needs attention</div></div>
      <div className="stat-card" data-accent="red"><div className="stat-label">Overdue / Blocked</div><div className="stat-value">{up.filter(p=>p.postDate<TODAY&&p.status!=="published").length}</div><span className="stat-change down">{I.arrowDn} Past deadline</span></div>
    </div>
    <div className="section-title">Platform Overview</div>
    <div className="plat-grid">{getUserChannels(user).map(ch=>{const pp=up.filter(p=>p.platform===ch);return<div key={ch} className="plat-card"><div className="plat-card-head"><div className="plat-card-name"><PI platform={ch}/>{PLATFORMS[ch].label}</div><span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--fm)"}}>{pp.length} posts</span></div><div className="plat-metrics"><div className="plat-m"><div className="v" style={{color:"var(--green)"}}>{pp.filter(p=>p.status==="published").length}</div><div className="l">Live</div></div><div className="plat-m"><div className="v" style={{color:"var(--amber)"}}>{pp.filter(p=>p.status==="in_review").length}</div><div className="l">Review</div></div><div className="plat-m"><div className="v" style={{color:"var(--text3)"}}>{pp.filter(p=>p.status==="draft").length}</div><div className="l">Draft</div></div></div></div>})}</div>
    <div className="alert-panel"><div className="alert-head"><h3>{I.alert} Alerts ({ua.length})</h3></div>{ua.map(a=><div key={a.id} className="alert-item"><div className={`alert-dot ${a.type}`}/><span className="alert-msg">{a.message}</span><span className="plat-tag" style={{background:PLATFORMS[a.platform].bg,color:PLATFORMS[a.platform].color,fontSize:10}}>{PLATFORMS[a.platform].abbr}</span><span className="alert-time">{a.time}</span></div>)}</div>
    <div className="section-title">Upcoming Posts</div>
    <table className="table"><thead><tr><th>Platform</th><th>Caption</th><th>Type</th><th>Date</th><th>Status</th><th>Owner</th></tr></thead><tbody>{up.filter(p=>p.postDate>=TODAY).slice(0,8).map(p=><tr key={p.id} onClick={()=>sel(p)}><td><PT platform={p.platform}/></td><td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text)",fontWeight:500}}>{p.caption}</td><td>{p.postType}</td><td style={{fontFamily:"var(--fm)",fontSize:12}}>{p.postDate}</td><td><SB status={p.status}/></td><td><div style={{display:"flex",alignItems:"center",gap:7}}><AV user={p.owner} size={24}/><span style={{fontSize:12}}>{p.owner.name.split(" ")[0]}</span></div></td></tr>)}</tbody></table>
  </div>;
}

// ─── Calendar ────────────────────────────────────────────────────────────────
function CalendarPage({sel,posts,onAddPost}){
  const{user}=useAuth();const[view,setView]=useState("week");const[off,setOff]=useState(0);const[pf,setPf]=useState("all");const[addDate,setAddDate]=useState(null);
  const ch=getUserChannels(user);const up=posts.filter(p=>canAccess(user,p.platform));const filtered=pf==="all"?up:up.filter(p=>p.platform===pf);
  const renderDay=(d,i,isMonth)=>{if(!d)return<div key={`e${i}`} className="cal-day empty" style={{minHeight:isMonth?90:110}}/>;
    const ds=d.toISOString().split("T")[0];const isT=ds===TODAY;const dp=filtered.filter(p=>p.postDate===ds);
    return<div key={i} className={`cal-day ${isT?"today":""}`} style={{minHeight:isMonth?90:110}} onClick={()=>setAddDate(ds)}>
      <div style={{marginBottom:4}}><span className={`cal-date ${isT?"today":""}`}>{d.getDate()}</span></div>
      {dp.slice(0,3).map(p=><div key={p.id} className="cal-post" style={{background:`${PLATFORMS[p.platform].color}08`,borderLeftColor:PLATFORMS[p.platform].color,color:PLATFORMS[p.platform].color}} onClick={e=>{e.stopPropagation();sel(p);}}><span style={{fontSize:9,fontWeight:800}}>{PLATFORMS[p.platform].abbr}</span><span style={{fontSize:10.5,color:"var(--text2)",overflow:"hidden",textOverflow:"ellipsis"}}>{p.caption.slice(0,20)}</span></div>)}
      {dp.length>3&&<div style={{fontSize:10,color:"var(--text3)",padding:"2px 7px"}}>+{dp.length-3} more</div>}
    </div>;
  };
  const base=view==="month"?new Date(2026,1+off,1):(()=>{const b=new Date(2026,1,9);b.setDate(b.getDate()+off*7);return b;})();
  return<div>
    <div className="page-h"><div><h2>Content Calendar</h2><div className="page-h-sub">Click any date to add a post</div></div><div className="page-h-actions"><button className="btn btn-p" onClick={()=>setAddDate(TODAY)}>{I.plus} Add Post</button></div></div>
    <div className="filter-bar">{ch.length>1&&<><div className={`filter-chip ${pf==="all"?"active":""}`} onClick={()=>setPf("all")}>All Channels</div>{ch.map(c=><div key={c} className={`filter-chip ${pf===c?"active":""}`} onClick={()=>setPf(c)}><span className="sb-dot" style={{background:PLATFORMS[c].color}}/>{PLATFORMS[c].label}</div>)}</>}
      <div style={{marginLeft:"auto",display:"flex",gap:6}}><button className={`btn btn-sm ${view==="week"?"btn-p":""}`} onClick={()=>{setView("week");setOff(0);}}>Week</button><button className={`btn btn-sm ${view==="month"?"btn-p":""}`} onClick={()=>{setView("month");setOff(0);}}>Month</button></div>
    </div>
    <div className="cal-nav"><div className="cal-title"><button className="btn-icon" onClick={()=>setOff(o=>o-1)}>{I.chevL}</button><h3>{view==="month"?`${MN[base.getMonth()]} ${base.getFullYear()}`:`${MN[getWeek(base)[0].getMonth()]} ${getWeek(base)[0].getDate()} – ${MN[getWeek(base)[6].getMonth()]} ${getWeek(base)[6].getDate()}, ${getWeek(base)[0].getFullYear()}`}</h3><button className="btn-icon" onClick={()=>setOff(o=>o+1)}>{I.chevR}</button><button className="btn btn-sm" onClick={()=>setOff(0)}>Today</button></div></div>
    {view==="month"?<div className="cal-grid">{DN.map(d=><div key={d} className="cal-header">{d}</div>)}{getMonth(base.getFullYear(),base.getMonth()).map((d,i)=>renderDay(d,i,true))}</div>
    :<div className="cal-grid">{DN.map((d,i)=><div key={d} className="cal-header">{d}</div>)}{getWeek(base).map((d,i)=>renderDay(d,i,false))}</div>}
    {addDate&&<AddPostModal onClose={()=>setAddDate(null)} onAdd={onAddPost} defaultDate={addDate} defaultPlatform={pf!=="all"?pf:undefined}/>}
  </div>;
}

// ─── All Posts ────────────────────────────────────────────────────────────────
function PostsPage({sel,posts,onAddPost}){
  const{user}=useAuth();const[sf,setSf]=useState("all");const[pf,setPf]=useState("all");const[showAdd,setShowAdd]=useState(false);
  const ch=getUserChannels(user);const all=posts.filter(p=>canAccess(user,p.platform));const filtered=all.filter(p=>(sf==="all"||p.status===sf)&&(pf==="all"||p.platform===pf));
  return<div>
    <div className="page-h"><div><h2>All Posts</h2><div className="page-h-sub">{all.length} total across your channels</div></div><div className="page-h-actions"><button className="btn btn-p" onClick={()=>setShowAdd(true)}>{I.plus} Add Post</button></div></div>
    <div className="filter-bar">{ch.length>1&&<><div className={`filter-chip ${pf==="all"?"active":""}`} onClick={()=>setPf("all")}>All</div>{ch.map(c=><div key={c} className={`filter-chip ${pf===c?"active":""}`} onClick={()=>setPf(c)}><span className="sb-dot" style={{background:PLATFORMS[c].color}}/>{PLATFORMS[c].label}</div>)}</>}
      <div style={{width:1,background:"var(--border)",margin:"0 4px",height:20}}/>
      <div className={`filter-chip ${sf==="all"?"active":""}`} onClick={()=>setSf("all")}>All Status</div>
      {Object.entries(STATUSES).map(([k,s])=><div key={k} className={`filter-chip ${sf===k?"active":""}`} onClick={()=>setSf(k)}>{s.label}</div>)}
    </div>
    <table className="table"><thead><tr><th>Platform</th><th>Caption</th><th>Type</th><th>Date</th><th>Status</th><th>Links</th><th>Owner</th></tr></thead>
      <tbody>{filtered.map(p=><tr key={p.id} onClick={()=>sel(p)}><td><PT platform={p.platform}/></td><td style={{maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text)",fontWeight:500}}>{p.caption}</td><td>{p.postType}</td><td style={{fontFamily:"var(--fm)",fontSize:12}}>{p.postDate}</td><td><SB status={p.status}/></td><td><div className="link-icons">{p.links.draft&&<span className="link-icon-box" style={{color:"var(--text3)"}}>{I.draft}</span>}{p.links.canva&&<span className="link-icon-box" style={{color:"var(--text3)"}}>{I.palette}</span>}{p.links.live&&<span className="link-icon-box">{I.live}</span>}</div></td><td><div style={{display:"flex",alignItems:"center",gap:7}}><AV user={p.owner} size={24}/><span style={{fontSize:12}}>{p.owner.name.split(" ")[0]}</span></div></td></tr>)}</tbody></table>
    {showAdd&&<AddPostModal onClose={()=>setShowAdd(false)} onAdd={onAddPost}/>}
  </div>;
}

// ─── Tasks ───────────────────────────────────────────────────────────────────
function TasksPage({sel,posts}){
  const{user}=useAuth();const[tf,setTf]=useState("all");
  const allT=posts.filter(p=>canAccess(user,p.platform)).flatMap(p=>p.tasks.map(t=>({...t,post:p})));
  const filtered=tf==="all"?allT:allT.filter(t=>t.status===tf);
  return<div>
    <div className="page-h"><div><h2>Tasks</h2><div className="page-h-sub">{allT.length} tasks across your channels</div></div></div>
    <div className="filter-bar"><div className={`filter-chip ${tf==="all"?"active":""}`} onClick={()=>setTf("all")}>All ({allT.length})</div>{Object.entries(TASK_STATUSES).map(([k,v])=><div key={k} className={`filter-chip ${tf===k?"active":""}`} onClick={()=>setTf(k)}>{v} ({allT.filter(t=>t.status===k).length})</div>)}</div>
    <table className="table"><thead><tr><th>Task</th><th>Post</th><th>Platform</th><th>Assigned To</th><th>Due Date</th><th>Status</th></tr></thead>
      <tbody>{filtered.map(t=><tr key={t.id} onClick={()=>sel(t.post)}><td style={{color:"var(--text)",fontWeight:500}}>{t.type}</td><td style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.post.caption.slice(0,35)}</td><td><PT platform={t.post.platform}/></td><td><div style={{display:"flex",alignItems:"center",gap:7}}><AV user={t.assignee} size={24}/><span style={{fontSize:12}}>{t.assignee.name.split(" ")[0]}</span></div></td><td style={{fontFamily:"var(--fm)",fontSize:12}}>{t.dueDate}</td><td><TSB status={t.status}/></td></tr>)}</tbody></table>
  </div>;
}

// ─── Approvals ───────────────────────────────────────────────────────────────
function ApprovalsPage({sel,posts}){
  const{user}=useAuth();const[tab,setTab]=useState("pending");
  const all=posts.filter(p=>canAccess(user,p.platform));const pending=all.filter(p=>p.status==="in_review");const approved=all.filter(p=>p.status==="approved"||p.status==="scheduled");
  const list=tab==="pending"?pending:approved;
  return<div>
    <div className="page-h"><div><h2>Approvals</h2><div className="page-h-sub">{pending.length} posts awaiting approval</div></div></div>
    <div className="tabs"><div className={`tab ${tab==="pending"?"active":""}`} onClick={()=>setTab("pending")}>Pending ({pending.length})</div><div className={`tab ${tab==="approved"?"active":""}`} onClick={()=>setTab("approved")}>Approved ({approved.length})</div></div>
    {list.length===0?<div className="empty-state"><p style={{fontSize:14}}>No posts in this category</p></div>:
    <table className="table"><thead><tr><th>Platform</th><th>Caption</th><th>Type</th><th>Date</th><th>Owner</th><th>Action</th></tr></thead>
      <tbody>{list.map(p=><tr key={p.id} onClick={()=>sel(p)}><td><PT platform={p.platform}/></td><td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text)",fontWeight:500}}>{p.caption}</td><td>{p.postType}</td><td style={{fontFamily:"var(--fm)",fontSize:12}}>{p.postDate}</td><td><div style={{display:"flex",alignItems:"center",gap:7}}><AV user={p.owner} size={24}/><span style={{fontSize:12}}>{p.owner.name.split(" ")[0]}</span></div></td><td onClick={e=>e.stopPropagation()}>{tab==="pending"?<div style={{display:"flex",gap:6}}><button className="btn btn-p btn-sm">Approve</button><button className="btn btn-sm" style={{color:"var(--red)",borderColor:"var(--red)"}}>Reject</button></div>:<SB status={p.status}/>}</td></tr>)}</tbody></table>}
  </div>;
}

// ─── Channel Chat ────────────────────────────────────────────────────────────
function ChatPage({platform,chats,onSend}){
  const{user}=useAuth();const[msg,setMsg]=useState("");const ref=useRef(null);
  const msgs=chats[platform]||[];const ct=TEAM.filter(u=>canAccess(u,platform));const pinned=msgs.filter(m=>m.pinned);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs.length]);
  const send=()=>{if(!msg.trim())return;onSend(platform,msg);setMsg("");};
  const kd=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}};
  return<div>
    <div className="page-h"><div style={{display:"flex",alignItems:"center",gap:12}}><PI platform={platform}/><div><h2>{PLATFORMS[platform].label} Chat</h2><div className="page-h-sub">{ct.length} members · {msgs.length} messages</div></div></div></div>
    <div className="chat-wrap">
      <div className="chat-header"><h3>{I.chat} Channel Chat</h3><div style={{display:"flex",gap:4}}>{ct.slice(0,6).map(u=><AV key={u.id} user={u} size={26}/>)}{ct.length>6&&<span style={{fontSize:11,color:"var(--text3)",alignSelf:"center",marginLeft:4}}>+{ct.length-6}</span>}</div></div>
      {pinned.length>0&&<div className="pinned-area"><div style={{fontSize:10,fontWeight:600,color:"var(--blue)",textTransform:"uppercase",letterSpacing:".5px",marginBottom:4,display:"flex",alignItems:"center",gap:4}}>{I.pin} Pinned</div>{pinned.map(m=><div key={m.id} style={{fontSize:12.5,color:"var(--text2)",marginBottom:2}}><strong style={{color:"var(--text)"}}>{m.user.name}:</strong> {m.text.slice(0,80)}{m.text.length>80?"...":""}</div>)}</div>}
      <div className="chat-body" ref={ref}>{msgs.map(m=><div key={m.id} className={`chat-msg ${m.pinned?"pinned":""}`}><AV user={m.user} size={32}/><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><span className="chat-msg-name">{m.user.name}</span><span className="chat-msg-time">{fmtDate(m.time)} {fmtTime(m.time)}</span>{m.pinned&&<span className="chat-msg-pin">{I.pin} Pinned</span>}</div><div className="chat-msg-text">{m.text}</div></div></div>)}</div>
      <div className="chat-input"><input className="input" placeholder={`Message #${PLATFORMS[platform].label.toLowerCase()}...`} value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={kd}/><button className="btn btn-p" onClick={send}>{I.send} Send</button></div>
    </div>
  </div>;
}

// ─── CSV Upload ──────────────────────────────────────────────────────────────
function UploadPage({onImport}){
  const[step,setStep]=useState("upload");const[rows,setRows]=useState([]);const[errors,setErrors]=useState([]);const ref=useRef(null);
  const downloadDemo=()=>{const b=new Blob([DEMO_CSV],{type:"text/csv"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="pocket_fund_template.csv";a.click();URL.revokeObjectURL(u);};
  const parseCSV=(text)=>{const lines=text.trim().split("\n");const headers=lines[0].split(",").map(h=>h.trim().toLowerCase().replace(/"/g,""));const parsed=[];const errs=[];const vp=Object.values(PLATFORMS).map(p=>p.label.toLowerCase());
    for(let i=1;i<lines.length;i++){const vals=[];let inQ=false;let cur="";for(let c=0;c<lines[i].length;c++){const ch=lines[i][c];if(ch==='"')inQ=!inQ;else if(ch===","&&!inQ){vals.push(cur.trim());cur="";}else cur+=ch;}vals.push(cur.trim());
      const row={};headers.forEach((h,idx)=>{row[h]=vals[idx]||"";});const re=[];
      if(!row.platform||!vp.includes(row.platform.toLowerCase()))re.push(`Invalid platform: "${row.platform}"`);if(!row.post_date||!/^\d{4}-\d{2}-\d{2}$/.test(row.post_date))re.push(`Invalid date`);if(!row.caption)re.push("Caption empty");
      parsed.push({...row,_row:i,_errors:re});if(re.length>0)errs.push({row:i,errors:re});}return{parsed,errs};};
  const handleFile=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>{const{parsed,errs}=parseCSV(ev.target.result);setRows(parsed);setErrors(errs);setStep("preview");};r.readAsText(f);};
  const handleDrop=e=>{e.preventDefault();const f=e.dataTransfer.files?.[0];if(!f||!f.name.endsWith(".csv"))return;const r=new FileReader();r.onload=ev=>{const{parsed,errs}=parseCSV(ev.target.result);setRows(parsed);setErrors(errs);setStep("preview");};r.readAsText(f);};
  const confirm=()=>{onImport(rows.filter(r=>r._errors.length===0));setStep("done");};

  if(step==="done")return<div><div className="page-h"><div><h2>Upload Complete</h2></div></div><div style={{textAlign:"center",padding:"48px 20px"}}><div style={{width:60,height:60,borderRadius:"50%",background:"var(--green-bg)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",color:"var(--green)"}}><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg></div><p style={{fontSize:18,fontWeight:600,marginBottom:6}}>{rows.filter(r=>r._errors.length===0).length} posts imported</p>{errors.length>0&&<p style={{fontSize:13,color:"var(--text3)"}}>{errors.length} rows skipped</p>}<button className="btn btn-p" style={{marginTop:18}} onClick={()=>{setStep("upload");setRows([]);setErrors([]);}}>Upload Another</button></div></div>;

  if(step==="preview")return<div><div className="page-h"><div><h2>Preview Import</h2><div className="page-h-sub">{rows.length} rows found</div></div><div className="page-h-actions"><button className="btn" onClick={()=>{setStep("upload");setRows([]);setErrors([]);}}>Back</button></div></div>
    {errors.length===0?<div className="csv-status ok">{I.check} All {rows.length} rows passed validation</div>:<div className="csv-status err">{I.alert} {errors.length} row{errors.length>1?"s":""} with errors (will be skipped)</div>}
    <div className="csv-preview"><table><thead><tr><th>#</th><th>Platform</th><th>Type</th><th>Date</th><th>Caption</th><th>Owner</th><th>Status</th><th>Issues</th></tr></thead><tbody>{rows.map((r,i)=><tr key={i} className={r._errors.length>0?"error":""}><td>{r._row}</td><td>{r.platform}</td><td>{r.post_type}</td><td style={{fontFamily:"var(--fm)"}}>{r.post_date}</td><td style={{maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.caption}</td><td>{r.owner}</td><td>{r.status}</td><td>{r._errors.length>0?<span style={{color:"var(--red)",fontSize:10}}>{r._errors.join("; ")}</span>:<span style={{color:"var(--green)",fontSize:10}}>OK</span>}</td></tr>)}</tbody></table></div>
    <div className="modal-actions" style={{marginTop:16}}><button className="btn" onClick={()=>{setStep("upload");setRows([]);setErrors([]);}}>Cancel</button><button className="btn btn-p" onClick={confirm}>{I.check} Import {rows.filter(r=>r._errors.length===0).length} Posts</button></div></div>;

  return<div><div className="page-h"><div><h2>Upload Monthly Plan</h2><div className="page-h-sub">Import content calendar from CSV</div></div></div>
    <div className="upload-zone" onClick={()=>ref.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={handleDrop}>
      <input ref={ref} type="file" accept=".csv" style={{display:"none"}} onChange={handleFile}/>
      <div style={{color:"var(--text3)",marginBottom:12}}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M8 8l4-4 4 4M20 16v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4"/></svg></div>
      <p style={{fontSize:16,fontWeight:600,marginBottom:4}}>Drop CSV file here or click to browse</p>
      <p style={{fontSize:13,color:"var(--text3)"}}>Supports .csv files — validates before import</p>
    </div>
    <div style={{marginTop:24,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}><div className="section-title" style={{marginBottom:0}}>Template Format</div><button className="btn" onClick={downloadDemo}>{I.download} Download Template</button></div>
    <table className="table"><thead><tr><th>platform</th><th>post_type</th><th>post_date</th><th>caption</th><th>owner</th><th>status</th><th>campaign</th></tr></thead><tbody>
      <tr><td>Instagram</td><td>Reel</td><td style={{fontFamily:"var(--fm)"}}>2026-03-05</td><td>Founder insight</td><td>Dev Shah</td><td>Draft</td><td>Founder Brand</td></tr>
      <tr><td>LinkedIn</td><td>Post</td><td style={{fontFamily:"var(--fm)"}}>2026-03-07</td><td>Weekly insight</td><td>Yash</td><td>In Review</td><td>Thought Leadership</td></tr>
      <tr><td>YouTube</td><td>Video</td><td style={{fontFamily:"var(--fm)"}}>2026-03-10</td><td>Search Fund Explained</td><td>Rahul Mahto</td><td>Draft</td><td>Education</td></tr>
    </tbody></table>
    <div style={{marginTop:14,padding:"14px 18px",background:"var(--card2)",borderRadius:"var(--rs)",fontSize:13,color:"var(--text2)",lineHeight:1.6,border:"1px solid var(--border)"}}><strong style={{color:"var(--text)"}}>Validation:</strong> Platform names checked · Date format YYYY-MM-DD · URLs must start with https:// · Empty captions flagged · Fix errors before confirming</div>
  </div>;
}

// ─── Team Page ───────────────────────────────────────────────────────────────
function TeamPage(){return<div><div className="page-h"><div><h2>Team</h2><div className="page-h-sub">{TEAM.length} members</div></div><div className="page-h-actions"><button className="btn btn-p">{I.plus} Add Member</button></div></div>
  <table className="table"><thead><tr><th>Member</th><th>Role</th><th>Channels</th><th>Access</th><th>Status</th><th>Actions</th></tr></thead><tbody>{TEAM.map(u=><tr key={u.id}><td><div style={{display:"flex",alignItems:"center",gap:10}}><AV user={u} size={30}/><span style={{color:"var(--text)",fontWeight:500}}>{u.name}</span></div></td>
    <td><span className="status-badge" style={{background:u.isAdmin?"var(--blue-bg)":u.isFreelancer?"var(--card3)":"var(--green-bg)",color:u.isAdmin?"var(--blue)":u.isFreelancer?"var(--text3)":"var(--green)"}}>{u.role}</span></td>
    <td>{u.channels[0]==="all"?<span style={{fontSize:12,color:"var(--text2)"}}>All channels</span>:<div style={{display:"flex",gap:4}}>{u.channels.map(ch=><PT key={ch} platform={ch}/>)}</div>}</td>
    <td><span style={{fontSize:12,color:u.isAdmin?"var(--blue)":u.isFreelancer?"var(--text3)":"var(--green)",fontWeight:600}}>{u.isAdmin?"Admin":u.isFreelancer?"Freelancer":u.role.includes("Head")?"Channel Head":"Member"}</span></td>
    <td><span style={{color:"var(--green)",fontSize:12,fontWeight:600}}>Active</span></td>
    <td><div style={{display:"flex",gap:4}}><button className="btn-icon" title="Edit">{I.edit}</button>{!u.isAdmin&&<button className="btn-icon" title="Remove" style={{color:"var(--red)"}}>{I.trash}</button>}</div></td></tr>)}</tbody></table></div>;}

// ─── Channel Page ────────────────────────────────────────────────────────────
function ChannelPage({platform,sel,posts,onAddPost}){
  const[showAdd,setShowAdd]=useState(false);const p=PLATFORMS[platform];const ps=posts.filter(po=>po.platform===platform);
  const pub=ps.filter(po=>po.status==="published");const totalImp=pub.reduce((s,po)=>s+(po.metrics?.impressions||0),0);
  const avgEng=pub.length>0?(pub.reduce((s,po)=>s+parseFloat(po.metrics?.engagement||0),0)/pub.length).toFixed(1):"0";
  const ct=TEAM.filter(u=>canAccess(u,platform));const best=pub.sort((a,b)=>(b.metrics?.impressions||0)-(a.metrics?.impressions||0))[0];
  return<div>
    <div className="page-h"><div style={{display:"flex",alignItems:"center",gap:12}}><PI platform={platform}/><div><h2>{p.label}</h2><div className="page-h-sub">{ps.length} posts · {pub.length} published · {ct.length} members</div></div></div><div className="page-h-actions"><button className="btn btn-p" onClick={()=>setShowAdd(true)}>{I.plus} Add Post</button></div></div>
    <div className="stats-grid">
      <div className="stat-card" data-accent="blue"><div className="stat-label">Total Posts</div><div className="stat-value">{ps.length}</div></div>
      <div className="stat-card" data-accent="green"><div className="stat-label">Published</div><div className="stat-value">{pub.length}</div><span className="stat-change up">{I.arrowUp} Live</span></div>
      <div className="stat-card" data-accent="purple"><div className="stat-label">Impressions</div><div className="stat-value">{fmt(totalImp)}</div><div className="stat-sub">Compared to last month</div></div>
      <div className="stat-card" data-accent="amber"><div className="stat-label">Avg Engagement</div><div className="stat-value">{avgEng}%</div><span className="stat-change up">{I.arrowUp} 1.2%</span></div>
    </div>
    {best&&<div style={{marginBottom:24}}><div className="section-title">Best Performing Post</div><div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--rl)",padding:"16px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",transition:"all var(--t)"}} onClick={()=>sel(best)}><div style={{color:"var(--amber)"}}>{I.chart}</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:"var(--text)"}}>{best.caption.slice(0,60)}</div><div style={{fontSize:12,color:"var(--text3)",marginTop:2}}>{fmt(best.metrics.impressions)} impressions · {best.metrics.engagement}% engagement</div></div><SB status={best.status}/></div></div>}
    <div className="section-title">Channel Team</div>
    <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>{ct.map(u=><div key={u.id} style={{display:"flex",alignItems:"center",gap:8,background:"var(--card)",border:"1px solid var(--border)",padding:"8px 14px",borderRadius:24,fontSize:13}}><AV user={u} size={24}/>{u.name}<span style={{color:"var(--text3)",fontSize:11}}>({u.role})</span></div>)}</div>
    {ps.filter(p2=>p2.status==="in_review").length>0&&<><div className="section-title">Awaiting Approval</div><div style={{marginBottom:24}}>{ps.filter(p2=>p2.status==="in_review").map(p2=><div key={p2.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"var(--rs)",marginBottom:6,cursor:"pointer"}} onClick={()=>sel(p2)}><span style={{color:"var(--amber)"}}>{I.clock}</span><span style={{flex:1,fontSize:13,color:"var(--text)"}}>{p2.caption.slice(0,50)}</span><span style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--fm)"}}>{p2.postDate}</span></div>)}</div></>}
    <div className="section-title">All Posts</div>
    <table className="table"><thead><tr><th>Caption</th><th>Type</th><th>Date</th><th>Status</th><th>Links</th><th>Performance</th></tr></thead>
      <tbody>{ps.map(po=><tr key={po.id} onClick={()=>sel(po)}><td style={{maxWidth:220,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text)",fontWeight:500}}>{po.caption}</td><td>{po.postType}</td><td style={{fontFamily:"var(--fm)",fontSize:12}}>{po.postDate}</td><td><SB status={po.status}/></td><td><div className="link-icons">{po.links.draft&&<span style={{color:"var(--text3)"}}>{I.draft}</span>}{po.links.canva&&<span style={{color:"var(--text3)"}}>{I.palette}</span>}{po.links.live&&<span>{I.live}</span>}</div></td><td>{po.metrics?<span style={{fontFamily:"var(--fm)",fontSize:12}}>{fmt(po.metrics.impressions)} / {po.metrics.engagement}%</span>:<span style={{fontSize:12,color:"var(--text3)"}}>—</span>}</td></tr>)}</tbody></table>
    {showAdd&&<AddPostModal onClose={()=>setShowAdd(false)} onAdd={onAddPost} defaultPlatform={platform}/>}
  </div>;
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App(){
  const[page,setPage]=useState("dashboard");const[selPost,setSelPost]=useState(null);const[theme,setTheme]=useState("light");const[user,setUser]=useState(null);
  const[posts,setPosts]=useState(initPosts);const[chats,setChats]=useState(initChats);

  const logout=()=>{setUser(null);setPage("dashboard");};
  const login=u=>{setUser(u);if(!u.isAdmin){const ch=getUserChannels(u);setPage(`ch-${ch[0]}`);}};

  const addThread=(postId,text)=>{setPosts(p=>p.map(po=>po.id!==postId?po:{...po,threads:[...po.threads,{id:po.threads.length+1,user,text,time:Date.now()}]}));
    setSelPost(p=>{if(!p||p.id!==postId)return p;return{...p,threads:[...p.threads,{id:p.threads.length+1,user,text,time:Date.now()}]};});};
  const submitLive=(postId,url)=>{const now=new Date().toLocaleString();setPosts(p=>p.map(po=>po.id!==postId?po:{...po,status:"published",links:{...po.links,live:url},auditLog:[...po.auditLog,{action:"Live link submitted",by:user.name,at:now}]}));
    setSelPost(p=>{if(!p||p.id!==postId)return p;return{...p,status:"published",links:{...p.links,live:url},auditLog:[...p.auditLog,{action:"Live link submitted",by:user.name,at:new Date().toLocaleString()}]};});};
  const addPost=form=>{const ow=TEAM.find(t=>t.name===form.owner)||user;
    setPosts(p=>[...p,{id:p.length+100+Math.floor(Math.random()*900),platform:form.platform,postType:form.postType,postDate:form.postDate,caption:form.caption,status:"draft",owner:ow,campaign:form.campaign,links:{draft:form.draftLink||null,canva:form.canvaLink||null,asset:null,live:null},metrics:null,threads:[],approvalLog:[],auditLog:[{action:"Created",by:user.name,at:new Date().toLocaleString()}],tasks:[{id:Date.now(),type:"Review",assignee:TEAM[0],dueDate:form.postDate,status:"todo"}]}].sort((a,b)=>a.postDate.localeCompare(b.postDate)));};
  const importCSV=rows=>{const nw=rows.map((r,i)=>{const pk=Object.entries(PLATFORMS).find(([k,v])=>v.label.toLowerCase()===r.platform?.toLowerCase())?.[0]||"instagram";const ow=TEAM.find(t=>t.name.toLowerCase()===r.owner?.toLowerCase())||user;const sm={"draft":"draft","in review":"in_review","approved":"approved","scheduled":"scheduled","published":"published"};
    return{id:posts.length+200+i,platform:pk,postType:r.post_type||"Post",postDate:r.post_date,caption:r.caption,status:sm[r.status?.toLowerCase()]||"draft",owner:ow,campaign:r.campaign||"Founder Brand",links:{draft:r.draft_link||null,canva:r.canva_link||null,asset:null,live:null},metrics:null,threads:[],approvalLog:[],auditLog:[{action:"Created via CSV",by:user.name,at:new Date().toLocaleString()}],tasks:[{id:Date.now()+i,type:"Review",assignee:TEAM[0],dueDate:r.post_date,status:"todo"}]};});
    setPosts(p=>[...p,...nw].sort((a,b)=>a.postDate.localeCompare(b.postDate)));};
  const sendChat=(platform,text)=>{setChats(p=>({...p,[platform]:[...p[platform],{id:p[platform].length+100,user,text,time:Date.now()}]}));};

  const spd=selPost?posts.find(p=>p.id===selPost.id)||selPost:null;
  const ua=user?ALERTS.filter(a=>canAccess(user,a.platform)):[];

  const render=()=>{if(!user)return null;
    if(page==="dashboard"&&user.isAdmin)return<DashboardPage sel={setSelPost} posts={posts}/>;
    if(page==="calendar")return<CalendarPage sel={setSelPost} posts={posts} onAddPost={addPost}/>;
    if(page==="posts")return<PostsPage sel={setSelPost} posts={posts} onAddPost={addPost}/>;
    if(page==="approvals")return<ApprovalsPage sel={setSelPost} posts={posts}/>;
    if(page==="tasks")return<TasksPage sel={setSelPost} posts={posts}/>;
    if(page==="upload")return<UploadPage onImport={importCSV}/>;
    if(page==="team")return<TeamPage/>;
    if(page.startsWith("chat-"))return<ChatPage platform={page.replace("chat-","")} chats={chats} onSend={sendChat}/>;
    if(page.startsWith("ch-"))return<ChannelPage platform={page.replace("ch-","")} sel={setSelPost} posts={posts} onAddPost={addPost}/>;
    const ch=getUserChannels(user);return<ChannelPage platform={ch[0]} sel={setSelPost} posts={posts} onAddPost={addPost}/>;
  };

  return<ThemeContext.Provider value={{theme,setTheme}}><AuthContext.Provider value={{user,logout}}>
    <style>{CSS}</style>
    <div data-theme={theme} style={{minHeight:"100vh",background:"var(--bg)"}}>
      {!user?<LoginScreen onLogin={login}/>:<div className="app"><Sidebar page={page} nav={setPage} alertCount={ua.length} posts={posts}/><main className="main">{render()}</main></div>}
      {spd&&<PostDetail post={spd} onClose={()=>setSelPost(null)} onThread={addThread} onSubmitLive={submitLive}/>}
    </div>
  </AuthContext.Provider></ThemeContext.Provider>;
}
