export type BookmarkSeed = {
  title: string;
  url: string;
  icon?: string;
};

// Owner-editable bookmarks (build-time).
// - Public build is read-only for visitors.
// - Update this list, then rebuild/deploy.
export const BOOKMARKS: BookmarkSeed[] = [
  { title: "GoAIgo", url: "https://algo.zhiyuansofts.cn/" },
  { title: "大观园", url: "https://cxyonly.fans/math" },
  { title: "ChatGPT", url: "https://chatgpt.com/", icon: "openai.svg" },
  { title: "Gemini", url: "https://gemini.google.com/app", icon: "gemini-color.svg" },
  { title: "百变小樱", url: "https://cn4.cardsakura.buzz/user" },
  { title: "Proton Mail", url: "https://mail.proton.me/u/1/inbox?welcome=true", icon: "protonmail.svg" },
  { title: "GitHub", url: "https://github.com/", icon: "github.svg" },
  { title: "BiliBili", url: "https://www.bilibili.com/", icon: "bilibili-color.svg" },
  { title: "AtCoder", url: "https://atcoder.jp/home" },
  { title: "VJudge", url: "https://vjudge.net/group/usst-acm" },
  { title: "Codeforces", url: "https://codeforces.com/" },
  { title: "洛谷", url: "https://www.luogu.com.cn/" },
  { title: "QOJ", url: "https://qoj.ac/" },
  { title: "OI Wiki", url: "https://oi.wiki/" },
  { title: "ICPC", url: "https://icpc.global/" },
  { title: "xcpcRating", url: "https://hei-maom.github.io/xcpcrating/#/contests", icon: "bookmarks/xcpcrating.png" },
  { title: "xcpcSight", url: "https://junjiecharles.github.io/xcpc-sight/", icon: "bookmarks/xcpc-sight.svg" },
  { title: "xcpcLink", url: "https://xcpc.link/", icon: "bookmarks/xcpc-link.svg" },
  { title: "牛客Tracker", url: "https://www.nowcoder.com/problem/tracker#/daily", icon: "nowcoder.png" },
  { title: "AIgoWiki", url: "https://www.algowiki.cn/pulse", icon: "bookmarks/www.algowiki.cn.svg" },
  { title: "Atcoder 信息", url: "https://kenkoooo.com/atcoder/#/table/" },
  { title: "CFTracker", url: "https://cftracker.netlify.app/contests" },
  { title: "Graph Editor", url: "https://anacc22.github.io/another_graph_editor/" },
];
