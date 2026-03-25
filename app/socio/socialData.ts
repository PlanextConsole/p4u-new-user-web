export type Story  = { id: number; label: string; mine?: boolean; avatar: string | null };
export type Post   = { id: number; user: string; co: string; location: string; time: string; avatarA: string; avatarB: string | null; image: string; caption: string; hashtags: string; likes: number; comments: number; shares: number };
export type Contact = { id: number; name: string; avatar: string; time: string; lastMsg: string; unread: boolean };
export type Notification = { id: number; type: string; user: string; avatar: string; text: string; time: string; group: string; action?: "Follow" | "Unfollow" | null };
export type Suggestion  = { id: number; name: string; sub: string; avatar: string };
export type RecentSearch = { id: number; name: string; sub: string; avatar: string; verified?: boolean; color?: string };

export const STORIES: Story[] = [
  { id: 0, label: "Your Story", mine: true, avatar: null },
  { id: 1, label: "Marc",  avatar: "https://i.pravatar.cc/80?img=11" },
  { id: 2, label: "Van",   avatar: "https://i.pravatar.cc/80?img=12" },
  { id: 3, label: "Ven",   avatar: "https://i.pravatar.cc/80?img=13" },
  { id: 4, label: "Ven",   avatar: "https://i.pravatar.cc/80?img=14" },
  { id: 5, label: "Ven",   avatar: "https://i.pravatar.cc/80?img=15" },
  { id: 6, label: "Ven",   avatar: "https://i.pravatar.cc/80?img=16" },
  { id: 7, label: "Ven",   avatar: "https://i.pravatar.cc/80?img=17" },
  { id: 8, label: "Ven",   avatar: "https://i.pravatar.cc/80?img=18" },
  { id: 9, label: "Ven",   avatar: "https://i.pravatar.cc/80?img=19" },
];

export const POSTS: Post[] = [
  { id: 1, user: "Vijay Sivakumar", co: "and Kokila", location: "Pondicherry, TN", time: "1 hours ago", avatarA: "https://i.pravatar.cc/48?img=7", avatarB: "https://i.pravatar.cc/48?img=8", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", caption: "Just tried the amazing coffee from Brooklyn Coffee Co! Best…", hashtags: "#coffee #cozy #brooklyn #smallbusiness", likes: 1600, comments: 800, shares: 145 },
  { id: 2, user: "Kokila Devi", co: "", location: "Chennai, TN", time: "3 hours ago", avatarA: "https://i.pravatar.cc/48?img=9", avatarB: null, image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80", caption: "Golden hour vibes 🌅 Nothing beats a sunset drive.", hashtags: "#sunset #drive #cars #vibes", likes: 2340, comments: 412, shares: 78 },
];

export const CONTACTS: Contact[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1, name: "Chirag Singla", avatar: `https://i.pravatar.cc/48?img=${30 + i}`,
  time: `${i + 1}h`, lastMsg: "Hey! How are you?", unread: i < 2,
}));

export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "follow", user: "raker.farolivr2091ec",       avatar: "https://i.pravatar.cc/40?img=21", text: "started following you.",                                                  time: "Yesterday", group: "Yesterday", action: "Follow"   },
  { id: 2, type: "mention", user: "inktrtichadza  anas_noyal", avatar: "https://i.pravatar.cc/40?img=22", text: "and others you know to see their photos and videos.",                     time: "3d",        group: "This Week", action: null      },
  { id: 3, type: "follow", user: "lorem_ipsum",                avatar: "https://i.pravatar.cc/40?img=23", text: "is on Instagram. Clia_them_atz and 1 other following them.",              time: "5d",        group: "This Week", action: "Unfollow" },
  { id: 4, type: "like",   user: "brainwrend, saradzt",        avatar: "https://i.pravatar.cc/40?img=24", text: "and pastwed_dheebd liked your reel.",                                     time: "1w",        group: "Earlier"                      },
  { id: 5, type: "comment", user: "brainwrend_kindled",        avatar: "https://i.pravatar.cc/40?img=25", text: "liked your photo 19 others liked it.",                                    time: "1w",        group: "Earlier"                      },
  { id: 6, type: "like",   user: "brainwrend_me_dwelt_ck_202", avatar: "https://i.pravatar.cc/40?img=26", text: "and 302 others liked your reel.",                                          time: "2w",        group: "Earlier"                      },
];

export const RECENT_SEARCHES: RecentSearch[] = [
  { id: 1, name: "ted",      sub: "TLJ Talks",                    avatar: "https://i.pravatar.cc/40?img=1", verified: true, color: "#e74c3c" },
  { id: 2, name: "vodafone", sub: "",                              avatar: "https://i.pravatar.cc/40?img=2", verified: true },
  { id: 3, name: "mkbhd",    sub: "Marquess Brownlee · Following", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "mkbhd",    sub: "Marquess Brownlee · Following", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: 5, name: "mkbhd",    sub: "Marquess Brownlee · Following", avatar: "https://i.pravatar.cc/40?img=5" },
];

export const SUGGESTIONS: Suggestion[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1, name: "inktrtichadha", sub: "Follows you", avatar: `https://i.pravatar.cc/40?img=${20 + i}`,
}));