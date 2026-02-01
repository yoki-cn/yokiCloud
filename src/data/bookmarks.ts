export type BookmarkSeed = {
  title: string;
  url: string;
  icon?: string;
};

// Owner-editable bookmarks (build-time).
// - Public build is read-only for visitors.
// - Update this list, then rebuild/deploy.
export const BOOKMARKS: BookmarkSeed[] = [
  { title: "一网畅学", url: "https://1906.usst.edu.cn/user/index#/", icon: "yiwangchangxue.png" },
  { title: "ChatGPT", url: "https://chatgpt.com/", icon: "openai.svg" },
  { title: "Gemini", url: "https://gemini.google.com/app", icon: "gemini-color.svg" },
  {
    title: "智慧教室",
    url: "https://courses.usst.edu.cn/app/vodvideo/vodvideoMain.d2j?ssoCheckToken=ssoCheckToken&refreshToken=&accessToken=&userId=&",
  },
  { title: "百变小樱", url: "https://bbxy.xn--cesw6hd3s99f.com/user" },
  { title: "Proton Mail", url: "https://mail.proton.me/u/1/inbox?welcome=true", icon: "protonmail.svg" },
  { title: "GitHub", url: "https://github.com/", icon: "github.svg" },
  { title: "BiliBili", url: "https://www.bilibili.com/", icon: "bilibili-color.svg" },
  { title: "AtCoder", url: "https://atcoder.jp/home" },
  { title: "VJudge", url: "https://vjudge.net/group/usst-acm" },
  { title: "Codeforces", url: "https://codeforces.com/" },
  { title: "洛谷", url: "https://www.luogu.com.cn/" },
  { title: "QOJ", url: "https://qoj.ac/" },
  { title: "教务处", url: "https://jwc.usst.edu.cn/", icon: "USST.jpg" },
  { title: "OI Wiki", url: "https://oi.wiki/" },
  { title: "ICPC", url: "https://icpc.global/" },
  { title: "牛客Tracker", url: "https://www.nowcoder.com/problem/tracker#/daily", icon: "nowcoder.png" },
];
