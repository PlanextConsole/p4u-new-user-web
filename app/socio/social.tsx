"use client";

import { useState, useRef } from "react";
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal,
  Search, X, PlusCircle, Phone, Video, Info, Image as ImageIcon,
  Smile, ArrowLeft, Volume2, VolumeX,
  ChevronRight, ChevronLeft, Camera, Lock, Users, Eye,
  Bell, Archive, Activity, Globe, Clock, Star, FileText,
  MessageSquare, Tag, Share2, UserPlus, ThumbsUp,
  UserX, Check, Edit3,
} from "lucide-react";

const HeartIcon = Heart;
import { STORIES, POSTS, CONTACTS, NOTIFICATIONS, RECENT_SEARCHES, SUGGESTIONS } from "./socialData";
import type { Section } from "./SocialPage";

export const TEAL = "linear-gradient(135deg,#0d9488,#14b8a6)";

const FILTER_CSS: Record<string, string> = {
  Normal:    "none",
  Clarendon: "contrast(1.2) saturate(1.35)",
  Gingham:   "brightness(1.05) hue-rotate(-10deg)",
  Moon:      "grayscale(1) contrast(1.1)",
  Lark:      "contrast(0.9) brightness(1.1) saturate(1.2)",
  Reyes:     "sepia(0.22) contrast(0.85) brightness(1.1) saturate(0.75)",
  Juno:      "sepia(0.35) contrast(1.15) brightness(1.15) saturate(1.8)",
  Slumber:   "saturate(0.66) brightness(1.05)",
  Crema:     "contrast(1.04) saturate(0.85) brightness(1.15) sepia(0.08)",
  Ludwig:    "contrast(1.05) brightness(1.05) saturate(1.1)",
};
const FILTER_NAMES = Object.keys(FILTER_CSS);

type StoryViewState = { open: boolean; story: typeof STORIES[0] | null };

function StoryViewer({ story, onClose }: { story: typeof STORIES[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={onClose}>
      <div className="relative w-80 h-[560px] rounded-2xl overflow-hidden bg-gray-900" onClick={e => e.stopPropagation()}>
        <img src={story.avatar ?? "https://i.pravatar.cc/400?img=1"} alt={story.label} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent flex items-center gap-3">
          <img src={story.avatar ?? "https://i.pravatar.cc/40"} alt="" className="w-9 h-9 rounded-full border-2 border-teal-400 object-cover" />
          <span className="text-white text-sm font-bold">{story.label}</span>
          <span className="text-white/60 text-xs ml-auto">1h</span>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 rounded-full p-1.5"><X className="w-4 h-4 text-white" /></button>
        <div className="absolute top-2 left-2 right-2 h-0.5 bg-white/30 rounded-full">
          <div className="h-full bg-white rounded-full w-1/3" />
        </div>
      </div>
    </div>
  );
}

function StoryCircle({ story, onClick }: { story: typeof STORIES[0]; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer" onClick={onClick}>
      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 overflow-hidden transition-transform hover:scale-105 ${story.mine ? "border-dashed border-gray-300" : "border-teal-400"}`}>
        {story.mine
          ? <div className="w-full h-full bg-gray-100 flex items-center justify-center"><PlusCircle className="w-5 h-5 text-teal-400" /></div>
          : <img src={story.avatar!} alt={story.label} className="w-full h-full object-cover" />}
      </div>
      <span className="text-[10px] text-gray-500 truncate w-14 text-center">{story.label}</span>
    </div>
  );
}

function PostCard({ post: p }: { post: typeof POSTS[0] }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(p.likes);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative w-10 h-10 shrink-0">
          <img src={p.avatarA} alt={p.user} className="w-10 h-10 rounded-full object-cover border-2 border-teal-400" />
          {p.avatarB && <img src={p.avatarB} alt="" className="w-7 h-7 rounded-full object-cover border-2 border-white absolute -bottom-1 -right-1" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{p.user} {p.co && <span className="font-normal text-gray-500 text-xs">{p.co}</span>}</p>
          <p className="text-[11px] text-gray-400">{p.location} · {p.time}</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(v => !v)} className="p-1 text-gray-400 hover:text-gray-700"><MoreHorizontal className="w-4 h-4" /></button>
          {showMenu && (
            <div className="absolute right-0 top-7 bg-white rounded-xl shadow-lg border border-gray-100 z-10 w-40 overflow-hidden">
              {["Save post","Share","Report","Unfollow"].map(item => (
                <button key={item} onClick={() => setShowMenu(false)} className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition">{item}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <img src={p.image} alt="post" className="w-full h-full object-cover" />
      </div>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button onClick={() => { setLiked(v => !v); setLikes(v => liked ? v - 1 : v + 1); }} className="flex items-center gap-1 group">
              <Heart className={`w-5 h-5 transition-all ${liked ? "fill-red-500 text-red-500 scale-110" : "text-gray-500 group-hover:text-red-400"}`} />
              <span className="text-xs font-semibold text-gray-600">{likes.toLocaleString()}</span>
            </button>
            <button onClick={() => setShowComments(v => !v)} className="flex items-center gap-1 group">
              <MessageCircle className="w-5 h-5 text-gray-500 group-hover:text-teal-500 transition" />
              <span className="text-xs font-semibold text-gray-600">{p.comments + comments.length}</span>
            </button>
            <button className="flex items-center gap-1 group">
              <Send className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition" />
              <span className="text-xs font-semibold text-gray-600">{p.shares}</span>
            </button>
          </div>
          <button onClick={() => setSaved(v => !v)}>
            <Bookmark className={`w-5 h-5 transition ${saved ? "fill-teal-500 text-teal-500" : "text-gray-400 hover:text-teal-500"}`} />
          </button>
        </div>
        <p className="text-xs text-gray-700 mb-1">{p.caption}</p>
        <p className="text-xs text-teal-600">{p.hashtags}</p>
        {showComments && comments.length > 0 && (
          <div className="mt-2 space-y-1">
            {comments.map((c, i) => <p key={i} className="text-xs text-gray-700"><span className="font-semibold">you </span>{c}</p>)}
          </div>
        )}
        <div className="mt-2 flex gap-2">
          <input value={comment} onChange={e => setComment(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && comment.trim()) { setComments(p => [...p, comment.trim()]); setComment(""); setShowComments(true); }}}
            placeholder="Add a comment… (Enter to post)"
            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 outline-none focus:border-teal-400" />
          {comment.trim() && (
            <button onClick={() => { setComments(p => [...p, comment.trim()]); setComment(""); setShowComments(true); }}
              className="text-xs font-bold text-teal-500 hover:text-teal-700 px-2">Post</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomeSection() {
  const [searches, setSearches] = useState(RECENT_SEARCHES);
  const [q, setQ] = useState("");
  const [storyView, setStoryView] = useState<StoryViewState>({ open: false, story: null });
  const [showCreateStory, setShowCreateStory] = useState(false);

  const filtered = q ? searches.filter(s => s.name.toLowerCase().includes(q.toLowerCase())) : searches;

  return ( 
   <div className="w-full px-3 sm:px-6 py-4 flex gap-6 items-start bg-gray-50 min-h-screen">
      {storyView.open && storyView.story && <StoryViewer story={storyView.story} onClose={() => setStoryView({ open: false, story: null })} />}
      {showCreateStory && <CreateStoryModal onClose={() => setShowCreateStory(false)} />}
 
   <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 mb-5">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Stories</p>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {STORIES.map(s => (
              <StoryCircle key={s.id} story={s}
                onClick={() => s.mine ? setShowCreateStory(true) : setStoryView({ open: true, story: s })} />
            ))}
          </div>
        </div>
        {POSTS.map(post => <PostCard key={post.id} post={post} />)}
      </div>
 
      <aside className="hidden xl:block w-64 shrink-0 space-y-4 self-start sticky top-0">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">Search</p>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 mb-4">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="flex-1 text-xs bg-transparent outline-none text-gray-700" />
            <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700">Recent</span>
            <button onClick={() => setSearches([])} className="text-[11px] text-teal-500 hover:underline">Clear all</button>
          </div>
          <div className="space-y-2.5">
            {filtered.map(r => (
              <div key={r.id} className="flex items-center gap-2.5">
                <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 flex items-center gap-1">{r.name}{r.verified && <span className="text-teal-500 text-[10px]">✓</span>}</p>
                  {r.sub && <p className="text-[10px] text-gray-400 truncate">{r.sub}</p>}
                </div>
                <button onClick={() => setSearches(p => p.filter(x => x.id !== r.id))}><X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-700" /></button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-700">Suggestions for you</span>
            <button className="text-[11px] text-teal-500 hover:underline">See All</button>
          </div>
          <div className="space-y-3">
            {SUGGESTIONS.map(s => (
              <div key={s.id} className="flex items-center gap-2.5">
                <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-400">{s.sub}</p>
                </div>
                <button className="text-[11px] font-bold text-teal-500 hover:text-teal-700">Follow</button>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function CreateStoryModal({ onClose }: { onClose: () => void }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [filter, setFilter] = useState("Normal");
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Create Story</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        {!preview ? (
          <div onClick={() => fileRef.current?.click()} className="flex flex-col items-center justify-center py-20 cursor-pointer hover:bg-gray-50 transition">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-teal-300 flex items-center justify-center mb-3">
              <ImageIcon className="w-7 h-7 text-teal-400" />
            </div>
            <p className="text-sm text-gray-500">Click to upload a photo or video</p>
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
          </div>
        ) : (
          <div className="flex gap-0">
            <div className="flex-1 bg-black aspect-[9/16] max-h-72 relative overflow-hidden">
              <img src={preview} alt="story" className="w-full h-full object-cover" style={{ filter: FILTER_CSS[filter] }} />
              <div className="absolute bottom-3 left-3 right-3">
                <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add caption…"
                  className="w-full text-xs bg-black/40 text-white placeholder-white/60 rounded-lg px-3 py-2 outline-none border border-white/20 backdrop-blur" />
              </div>
            </div>
            <div className="w-44 p-3 overflow-y-auto max-h-72 bg-gray-50">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Filters</p>
              <div className="grid grid-cols-2 gap-1.5">
                {FILTER_NAMES.map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition ${filter === f ? "border-teal-400 bg-teal-50" : "border-transparent hover:bg-white"}`}>
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img src={preview} alt={f} className="w-full h-full object-cover" style={{ filter: FILTER_CSS[f] }} />
                    </div>
                    <span className="text-[9px] text-gray-500 font-medium">{f}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Cancel</button>
          {preview && (
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow transition hover:opacity-90" style={{ background: TEAL }}>
              Share to Story
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const EXPLORE_POSTS = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1, image: `https://picsum.photos/seed/${i + 10}/400/400`,
  likes: Math.floor(Math.random() * 5000) + 200, comments: Math.floor(Math.random() * 500) + 20,
}));

const PEOPLE = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1, name: `user_${i + 1}`, sub: "Follows you", avatar: `https://i.pravatar.cc/80?img=${60 + i}`,
  posts: Math.floor(Math.random() * 200) + 10,
}));

export function ExploreSection() {
  const [tab, setTab] = useState("Top");
  const [hover, setHover] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm mb-5">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search people, tags, places…" className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400" />
        {search && <button onClick={() => setSearch("")}><X className="w-4 h-4 text-gray-400" /></button>}
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {["Top","People","Tags","Places"].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 text-xs font-semibold py-2 px-3 rounded-lg transition-all ${tab === t ? "bg-white text-teal-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>
      {tab === "People" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {PEOPLE.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-gray-100 shadow-sm hover:shadow-md transition">
              <img src={p.avatar} alt={p.name} className="w-16 h-16 rounded-full object-cover border-2 border-teal-300" />
              <p className="text-sm font-bold text-gray-900">{p.name}</p>
              <p className="text-xs text-gray-400">{p.posts} posts</p>
              <button className="text-xs font-bold text-white px-4 py-1.5 rounded-full shadow" style={{ background: TEAL }}>Follow</button>
            </div>
          ))}
        </div>
      ) : tab === "Tags" ? (
        <div className="flex flex-wrap gap-2">
          {["#photography","#travel","#food","#nature","#art","#fitness","#music","#fashion","#tech","#cars","#coffee","#sunset"].map(tag => (
            <span key={tag} className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-200 cursor-pointer hover:bg-teal-100 transition">{tag}</span>
          ))}
        </div>
      ) : tab === "Places" ? (
        <div className="grid grid-cols-2 gap-3">
          {["Pondicherry","Chennai","Mumbai","Delhi","Bangalore","Goa"].map(place => (
            <div key={place} className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-teal-600" />
              </div>
              <div><p className="text-sm font-bold text-gray-900">{place}</p><p className="text-xs text-gray-400">View posts</p></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 gap-2 space-y-2">
          {EXPLORE_POSTS.map(post => (
            <div key={post.id} className="relative overflow-hidden rounded-xl cursor-pointer group break-inside-avoid"
              onMouseEnter={() => setHover(post.id)} onMouseLeave={() => setHover(null)}>
              <img src={post.image} alt="" className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105" />
              {hover === post.id && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1 text-white"><Heart className="w-5 h-5 fill-white" /><span className="text-sm font-bold">{post.likes.toLocaleString()}</span></div>
                  <div className="flex items-center gap-1 text-white"><MessageCircle className="w-5 h-5 fill-white" /><span className="text-sm font-bold">{post.comments}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const REELS_DATA = [
  { id: 1, user: "vijay_sivakumar", caption: "Sunset cruise 🌅 #travel #vibes",  likes: 42100, comments: 831,  thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80", avatar: "https://i.pravatar.cc/40?img=7" },
  { id: 2, user: "kokila_devi",     caption: "Morning coffee ritual ☕ #lifestyle", likes: 18300, comments: 413,  thumbnail: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80", avatar: "https://i.pravatar.cc/40?img=8" },
  { id: 3, user: "planext4u",       caption: "Bike life 🏍️ #moto #rides",          likes: 65000, comments: 1200, thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", avatar: "https://i.pravatar.cc/40?img=9" },
];

export function ReelsSection() {
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [followed, setFollowed] = useState<Record<number, boolean>>({});

  return (
    <div className="max-w-sm mx-auto py-6 px-3 space-y-6">
      <h1 className="text-lg font-semibold text-gray-900 px-1">Reels</h1>
      {REELS_DATA.map(reel => (
        <div key={reel.id} className="relative rounded-3xl overflow-hidden shadow-lg bg-black aspect-[9/16]">
          <img src={reel.thumbnail} alt={reel.user} className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <button onClick={() => setMuted(v => !v)} className="absolute top-4 right-4 bg-black/40 rounded-full p-2">
            {muted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
          <div className="absolute bottom-4 left-4 right-16">
            <div className="flex items-center gap-2 mb-2">
              <img src={reel.avatar} alt={reel.user} className="w-8 h-8 rounded-full border-2 border-white" />
              <span className="text-sm font-bold text-white">{reel.user}</span>
              <button onClick={() => setFollowed(p => ({ ...p, [reel.id]: !p[reel.id] }))}
                className={`text-xs font-bold border rounded-full px-2 py-0.5 transition ${followed[reel.id] ? "bg-white text-gray-800 border-white" : "text-teal-300 border-teal-300 hover:bg-teal-400 hover:text-white"}`}>
                {followed[reel.id] ? "Following" : "Follow"}
              </button>
            </div>
            <p className="text-xs text-white/90">{reel.caption}</p>
          </div>
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5">
            <button onClick={() => setLiked(p => ({ ...p, [reel.id]: !p[reel.id] }))} className="flex flex-col items-center gap-1">
              <Heart className={`w-6 h-6 transition ${liked[reel.id] ? "fill-red-500 text-red-500" : "text-white"}`} />
              <span className="text-[10px] text-white font-semibold">{((liked[reel.id] ? reel.likes + 1 : reel.likes) / 1000).toFixed(1)}K</span>
            </button>
            <button className="flex flex-col items-center gap-1"><MessageCircle className="w-6 h-6 text-white" /><span className="text-[10px] text-white font-semibold">{reel.comments}</span></button>
            <button><Send className="w-6 h-6 text-white" /></button>
            <button onClick={() => setSaved(p => ({ ...p, [reel.id]: !p[reel.id] }))}>
              <Bookmark className={`w-6 h-6 transition ${saved[reel.id] ? "fill-white text-white" : "text-white"}`} />
            </button>
            <button><MoreHorizontal className="w-5 h-5 text-white" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}

type Msg = { id: number; sender: "me" | "them"; text?: string; image?: string };
const INIT_MSGS: Msg[] = [
  { id: 1, sender: "them", image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80" },
  { id: 2, sender: "them", text: "These 5 useful websites are so amazing! 🙌🏼 #adamdigital [...]" },
];

export function MessagesSection() {
  const [active, setActive] = useState<number | null>(1);
  const [tab, setTab] = useState<"PRIMARY" | "GENERAL">("PRIMARY");
  const [msgText, setMsgText] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(INIT_MSGS);
  const contact = CONTACTS.find(c => c.id === active);

  const sendMsg = () => {
    if (!msgText.trim()) return;
    setMessages(p => [...p, { id: Date.now(), sender: "me", text: msgText.trim() }]);
    setMsgText("");
    setTimeout(() => {
      setMessages(p => [...p, { id: Date.now() + 1, sender: "them", text: "Got it! 👍" }]);
    }, 1000);
  };

  return (
    <div className="flex overflow-hidden bg-gray-50" style={{ height: "70vh" }}>
      <div className={`w-full lg:w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 ${showChat ? "hidden lg:flex" : "flex"}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-800">upvox_</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-90" />
          </div>
          <button className="p-1 hover:bg-gray-100 rounded-lg"><Edit3 className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="flex border-b border-gray-100 shrink-0">
          {(["PRIMARY","GENERAL"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3 text-xs font-bold tracking-wide transition-all ${tab === t ? "text-teal-600 border-b-2 border-teal-500" : "text-gray-400"}`}>{t}</button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONTACTS.map(c => (
            <button key={c.id} onClick={() => { setActive(c.id); setShowChat(true); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left ${active === c.id ? "bg-teal-50" : ""}`}>
              <div className="relative shrink-0">
                <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.lastMsg}</p>
              </div>
              {c.unread && <span className="w-2 h-2 bg-teal-500 rounded-full shrink-0" />}
            </button>
          ))}
        </div>
      </div>
      <div className={`flex-1 flex flex-col bg-white ${!showChat ? "hidden lg:flex" : "flex"}`}>
        {contact ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
              <button onClick={() => setShowChat(false)} className="lg:hidden mr-1"><ArrowLeft className="w-5 h-5 text-gray-500" /></button>
              <img src={contact.avatar} alt={contact.name} className="w-9 h-9 rounded-full object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">Planext4U</p>
                <p className="text-[11px] text-green-500">Active {contact.time} ago</p>
              </div>
              <div className="flex items-center gap-2">
                {[Phone, Video, Info].map((Icon, i) => <button key={i} className="p-1.5 hover:bg-gray-100 rounded-lg transition"><Icon className="w-4 h-4 text-gray-600" /></button>)}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"} gap-2`}>
                  {m.sender === "them" && <img src={contact.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 self-end" />}
                  <div className="max-w-[70%]">
                    {m.image && <img src={m.image} alt="shared" className="rounded-2xl w-full object-cover max-w-xs mb-1" />}
                    {m.text && <div className={`rounded-2xl px-3.5 py-2.5 text-xs ${m.sender === "me" ? "text-white" : "bg-gray-100 text-gray-800"}`} style={m.sender === "me" ? { background: TEAL } : {}}>{m.text}</div>}
                  </div>
                  {m.sender === "them" && (
                    <div className="flex items-end gap-0.5 self-end">
                      <button><Smile className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500" /></button>
                      <button><ArrowLeft className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500" /></button>
                      <button><MoreHorizontal className="w-3.5 h-3.5 text-gray-300 hover:text-gray-500" /></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-3 shrink-0">
              <button><Smile className="w-5 h-5 text-gray-400 hover:text-gray-700" /></button>
              <input value={msgText} onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMsg()}
                placeholder="Message…"
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-teal-400 transition" />
              {msgText.trim()
                ? <button onClick={sendMsg} className="text-teal-500 font-bold text-sm hover:text-teal-700">Send</button>
                : <>
                    <button><ImageIcon className="w-5 h-5 text-gray-400 hover:text-gray-700" /></button>
                    <button><Heart className="w-5 h-5 text-gray-400 hover:text-red-400 transition" /></button>
                  </>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-300 text-sm">Select a conversation</div>
        )}
      </div>
    </div>
  );
}

export function NotificationsSection() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [followed, setFollowed] = useState<Record<number, boolean>>({});

  const dismiss = (id: number) => setNotifs(p => p.filter(n => n.id !== id));
  const toggleFollow = (id: number) => setFollowed(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
        <button onClick={() => setNotifs([])} className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 transition">Clear all</button>
      </div>
      {notifs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 shadow-sm border border-gray-100">
          <Bell className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {["Yesterday","This Week","Earlier"].map(group => {
            const items = notifs.filter(n => n.group === group);
            if (!items.length) return null;
            return (
              <div key={group}>
                <div className="px-4 pt-4 pb-2"><span className="text-xs font-semibold tracking-widest uppercase text-gray-400">{group}</span></div>
                {items.map((n, idx) => (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition ${idx < items.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <img src={n.avatar} alt={n.user} className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 leading-snug"><span className="font-semibold">{n.user}</span> <span className="text-gray-500">{n.text}</span></p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                    {n.action === "Follow" || n.action === "Unfollow" ? (
                      <button onClick={() => toggleFollow(n.id)}
                        className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition ${followed[n.id] ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : n.action === "Follow" ? "text-white hover:opacity-90" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        style={!followed[n.id] && n.action === "Follow" ? { background: TEAL } : {}}>
                        {followed[n.id] ? "Following" : n.action}
                      </button>
                    ) : (
                      <button onClick={() => dismiss(n.id)} className="shrink-0 p-1 hover:bg-gray-100 rounded-full"><X className="w-3.5 h-3.5 text-gray-400" /></button>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CreateSection() {
  const [step, setStep] = useState<"upload" | "edit" | "details">("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [filter, setFilter] = useState("Normal");
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [shared, setShared] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setPreview(URL.createObjectURL(f)); setStep("edit"); }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) { setPreview(URL.createObjectURL(f)); setStep("edit"); }
  };
  const reset = () => { setStep("upload"); setPreview(null); setFilter("Normal"); setCaption(""); setLocation(""); setTags(""); setShared(false); };

  if (shared) return (
    <div className="max-w-md mx-auto px-4 py-20 flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
        <Check className="w-8 h-8 text-teal-600" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">Post Shared!</h2>
      <p className="text-sm text-gray-500 text-center">Your post has been shared to your followers.</p>
      <button onClick={reset} className="text-white font-bold px-6 py-2.5 rounded-xl shadow" style={{ background: TEAL }}>Create another</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          {step !== "upload"
            ? <button onClick={() => step === "details" ? setStep("edit") : reset()}><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
            : <div />}
          <h2 className="text-sm font-semibold text-gray-900">{step === "upload" ? "Create new post" : step === "edit" ? "Edit" : "New post"}</h2>
          {step === "edit"
            ? <button onClick={() => setStep("details")} className="text-xs font-bold text-teal-500 hover:text-teal-700">Next</button>
            : step === "details"
            ? <button onClick={() => setShared(true)} className="text-xs font-bold text-teal-500 hover:text-teal-700">Share</button>
            : <div />}
        </div>
        {step === "upload" && (
          <div onDrop={handleDrop} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center py-24 px-8 cursor-pointer hover:bg-gray-50 transition">
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 hover:border-teal-400 transition">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-1">Drag photos and videos here</p>
            <p className="text-xs text-gray-400 mb-4">Supports JPG, PNG, MP4, MOV</p>
            <button className="text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow" style={{ background: TEAL }}>Select from Computer</button>
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
          </div>
        )}
        {step === "edit" && preview && (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 bg-black">
              <img src={preview} alt="preview" className="w-full aspect-square object-cover" style={{ filter: FILTER_CSS[filter] }} />
            </div>
            <div className="md:w-52 p-4 bg-gray-50">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Filters</p>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-2 overflow-y-auto max-h-80">
                {FILTER_NAMES.map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition ${filter === f ? "border-teal-400 bg-teal-50" : "border-transparent hover:bg-white"}`}>
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img src={preview} alt={f} className="w-full h-full object-cover" style={{ filter: FILTER_CSS[f] }} />
                    </div>
                    <span className="text-[9px] font-semibold text-gray-600">{f}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {step === "details" && preview && (
          <div className="flex flex-col md:flex-row">
            <div className="md:w-64 bg-black shrink-0">
              <img src={preview} alt="preview" className="w-full aspect-square object-cover" style={{ filter: FILTER_CSS[filter] }} />
            </div>
            <div className="flex-1 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/36?img=7" alt="me" className="w-9 h-9 rounded-full" />
                <span className="text-sm font-bold text-gray-800">planext4u</span>
              </div>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} placeholder="Write a caption…" rows={4}
                className="w-full text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 outline-none focus:border-teal-400 resize-none" />
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="📍 Add location"
                className="w-full text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 outline-none focus:border-teal-400" />
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="🏷 Tag people (@username)"
                className="w-full text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200 outline-none focus:border-teal-400" />
              {["Accessibility","Advanced settings"].map(s => (
                <div key={s} className="flex items-center justify-between py-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 rounded-lg px-1 transition">
                  <span className="text-sm text-gray-700">{s}</span><ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
              <button onClick={() => setShared(true)} className="w-full text-white text-sm font-bold py-3 rounded-xl shadow transition hover:opacity-90" style={{ background: TEAL }}>Share</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const PROFILE_IMAGES = Array.from({ length: 9 }, (_, i) => `https://picsum.photos/seed/${i + 50}/400/400`);
const HIGHLIGHT_LABELS = ["Reel","Limitation","Logo","Rewards","Rewards","Favorite","Rewards"];
const PROFILE_TABS = ["Posts","Collection","Collage","Reels","Rewards","Favorite","Favourite","Rewards"];

export function ProfileSection() {
  const [activeTab, setActiveTab] = useState("Posts");
  const [following, setFollowing] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6">
      {selectedImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={() => setSelectedImg(null)}>
          <img src={selectedImg} alt="" className="max-w-lg max-h-[80vh] rounded-2xl object-cover" />
          <button className="absolute top-4 right-4 bg-white/20 rounded-full p-2"><X className="w-5 h-5 text-white" /></button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start gap-5 mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-teal-400 shrink-0">
          <img src="https://i.pravatar.cc/96?img=7" alt="profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-gray-900 mb-2">Planext4U Private Limited ®</h1>
          <div className="flex gap-5 mb-3">
            {[["1,048","Posts"],["4M","Followers"],["P24","Following"]].map(([v,l]) => (
              <div key={l}><p className="text-sm font-semibold text-gray-900">{v}</p><p className="text-[11px] text-gray-500">{l}</p></div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">Marquess Brownlee · Following<br />Software Developer<br />Planext4U</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFollowing(v => !v)} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${following ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "text-white shadow hover:opacity-90"}`} style={following ? {} : { background: TEAL }}>
              {following ? "Following" : "Follow"}
            </button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Message</button>
            <button className="px-3 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition">···</button>
          </div>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 mb-5" style={{ scrollbarWidth: "none" }}>
        {HIGHLIGHT_LABELS.map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
            <div className="w-14 h-14 rounded-full border-2 border-teal-300 overflow-hidden hover:border-teal-500 transition">
              <img src={`https://i.pravatar.cc/56?img=${40 + i}`} alt={label} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] text-gray-500 truncate w-14 text-center">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-1 overflow-x-auto mb-5 border-b border-gray-100" style={{ scrollbarWidth: "none" }}>
        {PROFILE_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`shrink-0 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${activeTab === t ? "text-teal-600 border-teal-500" : "text-gray-400 border-transparent hover:text-gray-600"}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {PROFILE_IMAGES.map((img, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group" onClick={() => setSelectedImg(img)}>
            <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}

type SettingsMenu =
  | "edit_profile" | "saved" | "archive" | "activity" | "notification_settings"
  | "language" | "time" | "rewards" | "create_page"
  | "privacy" | "close_friends" | "blocked"
  | "message_replies" | "tags" | "comments" | "sharing" | "invite"
  | "favorites" | "mutual" | "content"
  | null;

const SETTINGS_NAV = [
  { heading: "How you use", items: [
    { key: "edit_profile" as SettingsMenu,         label: "Edit profile",      icon: Edit3 },
    { key: "saved" as SettingsMenu,                label: "Saved",             icon: Bookmark },
    { key: "archive" as SettingsMenu,              label: "Archive",           icon: Archive },
    { key: "activity" as SettingsMenu,             label: "Your activity",     icon: Activity },
    { key: "notification_settings" as SettingsMenu,label: "Notification",      icon: Bell },
    { key: "language" as SettingsMenu,             label: "Select language",   icon: Globe },
    { key: "time" as SettingsMenu,                 label: "Time management",   icon: Clock },
    { key: "rewards" as SettingsMenu,              label: "Reward points",     icon: Star },
    { key: "create_page" as SettingsMenu,          label: "Create your page",  icon: FileText },
  ]},
  { heading: "Privacy", items: [
    { key: "privacy" as SettingsMenu,              label: "Account privacy",   icon: Lock },
    { key: "close_friends" as SettingsMenu,        label: "Close friends",     icon: HeartIcon },
    { key: "blocked" as SettingsMenu,              label: "Blocked",           icon: UserX },
  ]},
  { heading: "How others can interact", items: [
    { key: "message_replies" as SettingsMenu,      label: "Message and story replies", icon: MessageSquare },
    { key: "tags" as SettingsMenu,                 label: "Tag and mention",            icon: Tag },
    { key: "comments" as SettingsMenu,             label: "Comments",                   icon: MessageCircle },
    { key: "sharing" as SettingsMenu,              label: "Sharing",                    icon: Share2 },
    { key: "invite" as SettingsMenu,               label: "Invite friends",             icon: UserPlus },
  ]},
  { heading: "What you see", items: [
    { key: "favorites" as SettingsMenu,            label: "Your favorites",     icon: ThumbsUp },
    { key: "mutual" as SettingsMenu,               label: "Mutual accounts",    icon: Users },
    { key: "content" as SettingsMenu,              label: "Content preference", icon: Eye },
  ]},
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className={`w-11 h-6 rounded-full transition-all relative shrink-0 ${checked ? "bg-teal-500" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? "left-5.5 translate-x-[22px]" : "translate-x-[2px]"}`} />
    </button>
  );
}

function EditProfilePanel({ onBack }: { onBack: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/64?img=7");
  const [form, setForm] = useState({ name:"", username:"", website:"", bio:"", email:"", phone:"", gender:"", showSuggestions: true });
  const upd = (k: keyof typeof form, v: string | boolean) => setForm(p => ({ ...p, [k]: v }));
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-4 py-8">
        {saved && <div className="mb-4 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-sm text-teal-700 font-medium flex items-center gap-2"><Check className="w-4 h-4" />Profile updated successfully!</div>}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative cursor-pointer" onClick={() => fileRef.current?.click()}>
            <img src={avatar} alt="avatar" className="w-16 h-16 rounded-2xl object-cover" />
            <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setAvatar(URL.createObjectURL(f)); }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">UPVOX_</p>
            <button onClick={() => fileRef.current?.click()} className="text-xs text-teal-500 font-semibold hover:underline mt-0.5">Change profile photo</button>
          </div>
        </div>
        {[
          { label:"Name",         key:"name",     placeholder:"Planext4U",        hint:"Help people discover your account." },
          { label:"Username",     key:"username", placeholder:"Planext4U",        hint:"You can change username back within 14 days." },
          { label:"Website",      key:"website",  placeholder:"https://",         hint:"Editing links is available on mobile." },
          { label:"Bio",          key:"bio",       placeholder:"Tell your story…", hint:`${(form.bio as string).length}/150`, multi: true },
          { label:"Email",        key:"email",     placeholder:"email@example.com" },
          { label:"Phone number", key:"phone",     placeholder:"+91 97100 00000" },
          { label:"Gender",       key:"gender",    placeholder:"Prefer not to say" },
        ].map(({ label, key, placeholder, hint, multi }) => (
          <div key={key} className="grid grid-cols-3 gap-4 mb-5 items-start">
            <label className="text-sm font-semibold text-gray-700 pt-2 text-right pr-2 col-span-1">{label}</label>
            <div className="col-span-2">
              {multi
                ? <textarea value={form[key as keyof typeof form] as string} onChange={e => upd(key as keyof typeof form, e.target.value)} placeholder={placeholder} rows={3} maxLength={150} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-teal-400 resize-none transition" />
                : <input type="text" value={form[key as keyof typeof form] as string} onChange={e => upd(key as keyof typeof form, e.target.value)} placeholder={placeholder} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-teal-400 transition" />}
              {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
            </div>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-4 mb-8 items-start">
          <div className="col-span-1" />
          <div className="col-span-2 flex items-start gap-3">
            <input type="checkbox" id="sugg" checked={form.showSuggestions} onChange={e => upd("showSuggestions", e.target.checked)} className="mt-0.5 w-4 h-4 rounded accent-teal-500" />
            <label htmlFor="sugg" className="text-xs text-gray-600 leading-snug cursor-pointer"><span className="font-semibold">Show account suggestions on profiles</span><br />Choose whether people can see similar account suggestions on your profile.</label>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1" />
          <div className="col-span-2 flex items-center justify-between">
            <button className="text-xs text-red-400 hover:text-red-600 underline underline-offset-2">Temporarily deactivate my account</button>
            <button onClick={() => setSaved(true)} className="text-white text-sm font-bold px-5 py-2 rounded-xl shadow hover:opacity-90 transition" style={{ background: TEAL }}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyPanel() {
  const [priv, setPriv] = useState(false);
  const [actStatus, setActStatus] = useState(true);
  const [storyReplies, setStoryReplies] = useState("Everyone");
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Account Privacy</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4">
          <Lock className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Private Account</p>
            <p className="text-xs text-gray-500 mt-0.5">Only your approved followers can see your photos and videos.</p>
          </div>
          <Toggle checked={priv} onChange={setPriv} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-4">
          <Activity className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Show Activity Status</p>
            <p className="text-xs text-gray-500 mt-0.5">Allow accounts you follow to see when you were last active.</p>
          </div>
          <Toggle checked={actStatus} onChange={setActStatus} />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Story Replies</p>
          {["Everyone","People you follow","Off"].map(opt => (
            <label key={opt} className="flex items-center gap-3 py-2 cursor-pointer">
              <div onClick={() => setStoryReplies(opt)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${storyReplies === opt ? "border-teal-500" : "border-gray-300"}`}>
                {storyReplies === opt && <div className="w-2 h-2 rounded-full bg-teal-500" />}
              </div>
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationSettingsPanel() {
  const [settings, setSettings] = useState({ likes: true, comments: true, follows: true, messages: false, reposts: true, mentions: true, liveVideos: false, emailNotifs: false });
  const toggle = (k: keyof typeof settings) => setSettings(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Notification Settings</h2>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {[
          { key: "likes" as const,       label: "Likes",               desc: "Notify when someone likes your post" },
          { key: "comments" as const,    label: "Comments",            desc: "Notify when someone comments" },
          { key: "follows" as const,     label: "New Followers",       desc: "Notify when someone follows you" },
          { key: "messages" as const,    label: "Messages",            desc: "Notify for new messages" },
          { key: "reposts" as const,     label: "Reposts",             desc: "Notify when your post is reposted" },
          { key: "mentions" as const,    label: "Mentions",            desc: "Notify when you're mentioned" },
          { key: "liveVideos" as const,  label: "Live Videos",         desc: "Notify when accounts go live" },
          { key: "emailNotifs" as const, label: "Email Notifications", desc: "Get updates via email" },
        ].map(({ key, label, desc }, i, arr) => (
          <div key={key} className={`flex items-center gap-4 px-4 py-3.5 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <Toggle checked={settings[key]} onChange={() => toggle(key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LanguagePanel() {
  const [lang, setLang] = useState("English");
  const langs = ["English","Tamil","Hindi","Telugu","Malayalam","Kannada","Bengali","Marathi","Gujarati","Punjabi"];
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Select Language</h2>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {langs.map((l, i) => (
          <button key={l} onClick={() => setLang(l)} className={`w-full flex items-center justify-between px-4 py-3.5 text-sm transition hover:bg-gray-50 ${i < langs.length - 1 ? "border-b border-gray-50" : ""} ${lang === l ? "text-teal-600 font-bold" : "text-gray-700"}`}>
            {l}{lang === l && <Check className="w-4 h-4 text-teal-500" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function TimeManagementPanel() {
  const [limit, setLimit] = useState(60);
  const [reminder, setReminder] = useState(true);
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Time Management</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm font-semibold text-gray-900 mb-1">Daily Time Limit</p>
          <p className="text-xs text-gray-400 mb-4">Set a daily limit for time spent on this app.</p>
          <div className="flex items-center gap-4">
            <input type="range" min={15} max={240} step={15} value={limit} onChange={e => setLimit(+e.target.value)} className="flex-1 accent-teal-500" />
            <span className="text-sm font-bold text-teal-600 w-16 shrink-0">{limit >= 60 ? `${Math.floor(limit/60)}h ${limit%60 ? `${limit%60}m` : ""}` : `${limit}m`}</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Daily Reminder</p>
            <p className="text-xs text-gray-400 mt-0.5">Get reminded when you approach your limit.</p>
          </div>
          <Toggle checked={reminder} onChange={setReminder} />
        </div>
      </div>
    </div>
  );
}

function RewardsPanel() {
  const pts = 1250;
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Reward Points</h2>
      <div className="rounded-2xl text-white p-6 mb-5 text-center" style={{ background: TEAL }}>
        <Star className="w-8 h-8 mx-auto mb-2 fill-white" />
        <p className="text-3xl font-black">{pts.toLocaleString()}</p>
        <p className="text-sm text-white/80 mt-1">Total Points</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {[["Daily login","+ 10 pts"],["Post a photo","+ 25 pts"],["Get 100 likes","+ 50 pts"],["Invite a friend","+ 100 pts"]].map(([act, pts], i, arr) => (
          <div key={act} className={`flex items-center justify-between px-4 py-3.5 ${i < arr.length-1 ? "border-b border-gray-50" : ""}`}>
            <span className="text-sm text-gray-700">{act}</span>
            <span className="text-xs font-bold text-teal-600">{pts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SavedPanel() {
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Saved</h2>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({length:6},(_,i)=>`https://picsum.photos/seed/${i+80}/300/300`).map((img,i)=>(
          <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer group relative">
            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition fill-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CloseFriendsPanel() {
  const [friends, setFriends] = useState<number[]>([1,3]);
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-2">Close Friends</h2>
      <p className="text-xs text-gray-400 mb-5">People on your close friends list can see your close friends stories.</p>
      <div className="space-y-2">
        {SUGGESTIONS.map(s => (
          <div key={s.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
            <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="flex-1"><p className="text-sm font-semibold text-gray-900">{s.name}</p><p className="text-xs text-gray-400">{s.sub}</p></div>
            <button onClick={() => setFriends(p => p.includes(s.id) ? p.filter(x=>x!==s.id) : [...p,s.id])}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${friends.includes(s.id) ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              {friends.includes(s.id) ? "Added ✓" : "Add"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlockedPanel() {
  const [blocked, setBlocked] = useState([{ id:1, name:"spam_account_01", avatar:"https://i.pravatar.cc/40?img=31" }]);
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-2">Blocked</h2>
      <p className="text-xs text-gray-400 mb-5">They won't be able to find your profile or posts on P4U.</p>
      {blocked.length === 0
        ? <p className="text-sm text-gray-400 text-center py-8">No blocked accounts</p>
        : <div className="space-y-2">
            {blocked.map(b => (
              <div key={b.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                <img src={b.avatar} alt={b.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1"><p className="text-sm font-semibold text-gray-900">{b.name}</p></div>
                <button onClick={() => setBlocked(p=>p.filter(x=>x.id!==b.id))} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition">Unblock</button>
              </div>
            ))}
          </div>}
    </div>
  );
}

function CommentsPanel() {
  const [allow, setAllow] = useState("Everyone");
  const [filter, setFilter] = useState(true);
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-6">Comments</h2>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Allow comments from</p>
          {["Everyone","People you follow","Your followers","People you follow and your followers"].map(opt => (
            <label key={opt} className="flex items-center gap-3 py-1.5 cursor-pointer">
              <div onClick={() => setAllow(opt)} className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${allow === opt ? "border-teal-500" : "border-gray-300"}`}>
                {allow === opt && <div className="w-2 h-2 rounded-full bg-teal-500" />}
              </div>
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
          <div className="flex-1"><p className="text-sm font-semibold text-gray-900">Filter offensive comments</p><p className="text-xs text-gray-400 mt-0.5">Automatically hide offensive comments.</p></div>
          <Toggle checked={filter} onChange={setFilter} />
        </div>
      </div>
    </div>
  );
}

function GenericPanel({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-xl">
      <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}

export function SettingsSection({ onNavigate }: { onNavigate?: (s: Section) => void }) {
  const [activeMenu, setActiveMenu] = useState<SettingsMenu>("edit_profile");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const handleMenu = (key: SettingsMenu) => { setActiveMenu(key); setMobilePanelOpen(true); };

  const renderPanel = () => {
    switch (activeMenu) {
      case "edit_profile":         return <EditProfilePanel onBack={() => setMobilePanelOpen(false)} />;
      case "notification_settings":return <NotificationSettingsPanel />;
      case "privacy":              return <PrivacyPanel />;
      case "language":             return <LanguagePanel />;
      case "time":                 return <TimeManagementPanel />;
      case "rewards":              return <RewardsPanel />;
      case "saved":                return <SavedPanel />;
      case "close_friends":        return <CloseFriendsPanel />;
      case "blocked":              return <BlockedPanel />;
      case "comments":             return <CommentsPanel />;
      case "archive":              return <GenericPanel title="Archive" desc="View your archived posts and stories. Archived posts are only visible to you." />;
      case "activity":             return <GenericPanel title="Your Activity" desc="See a summary of your recent activity including posts, comments, likes and follows." />;
      case "create_page":          return <GenericPanel title="Create Your Page" desc="Set up a page to represent your business, brand, or organisation." />;
      case "message_replies":      return <GenericPanel title="Message and Story Replies" desc="Control who can reply to your stories and send you messages." />;
      case "tags":                 return <GenericPanel title="Tags and Mentions" desc="Control who can tag or mention you in their posts and stories." />;
      case "sharing":              return <GenericPanel title="Sharing" desc="Control who can share your posts and stories to their feeds." />;
      case "invite":               return <GenericPanel title="Invite Friends" desc="Invite your contacts to join P4U and earn reward points." />;
      case "favorites":            return <GenericPanel title="Your Favorites" desc="Posts from your favorite accounts appear first in your feed." />;
      case "mutual":               return <GenericPanel title="Mutual Accounts" desc="See accounts that you and your followers both follow." />;
      case "content":              return <GenericPanel title="Content Preference" desc="Adjust what types of content you see more or less of in your feed." />;
      default:                     return <EditProfilePanel onBack={() => setMobilePanelOpen(false)} />;
    }
  };

  return (
    <div className="flex overflow-hidden" style={{ height: "100%" }}>
      <div className={`w-full md:w-64 bg-white border-r border-gray-100 overflow-y-auto shrink-0 ${mobilePanelOpen ? "hidden md:flex md:flex-col" : "flex flex-col"}`}>
        {SETTINGS_NAV.map((section, si) => (
          <div key={si} className="mb-1">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 px-4 py-2 mt-2">{section.heading}</p>
            {section.items.map(({ key, label, icon: Icon }) => (
              <button key={label} onClick={() => handleMenu(key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition text-left ${activeMenu === key ? "text-teal-600 bg-teal-50 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}>
                <Icon className={`w-4 h-4 shrink-0 ${activeMenu === key ? "text-teal-500" : "text-gray-400"}`} />
                <span className="flex-1">{label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              </button>
            ))}
          </div>
        ))}
        <div className="px-4 py-4 mt-2 border-t border-gray-100">
          <button className="text-xs text-red-400 hover:text-red-600 underline underline-offset-2">Log out</button>
        </div>
      </div>
      <div className={`flex-1 bg-gray-50 overflow-hidden flex flex-col ${!mobilePanelOpen ? "hidden md:flex" : "flex"}`}>
        <div className="md:hidden flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button onClick={() => setMobilePanelOpen(false)} className="p-1"><ArrowLeft className="w-5 h-5 text-gray-600" /></button>
          <span className="text-sm font-bold text-gray-800 capitalize">{activeMenu?.replace(/_/g," ")}</span>
        </div>
        {renderPanel()}
      </div>
    </div>
  );
}