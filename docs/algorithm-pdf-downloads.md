# 板子 PDF 下载

PDF 由作者自行导出并上传，网站不再调用浏览器打印生成 PDF。MD 下载保持不变。

将 PDF 放在 `public/algorithm-pdfs/` 下，保留对应板子的章节目录和完整文件名，仅将扩展名从 `.md` 改为小写 `.pdf`。

例如：

- 板子：`src/content/algorithms/7. 字符串算法/7.3 Trie.md`
- PDF：`public/algorithm-pdfs/7. 字符串算法/7.3 Trie.pdf`

本地放入文件后即可下载；线上需将 PDF 提交到 GitHub 并等待部署完成。PDF 是公开下载资源，请勿放入私密资料。不会自动从 Obsidian 源目录同步或生成 PDF。

桌面顶栏、移动端菜单和文章侧栏均通过“下载 PDF”入口，在点击时检索文件。缺失或返回非 PDF 内容时显示：

> PRTS 检索完毕：目标 PDF 档案尚未归档，请等待后勤补全。

连接失败、超时或服务器错误则显示通讯失败提示，以免误报文件缺失。

## 首页板子 2.0

首页六册下载文件位于 `public/algorithm-downloads/2.0/`，入口与大小由 `src/data/algorithmDownloads.ts` 定义。文件保留原始 PDF 字节，不依赖逐篇 PDF 检索。

Math 使用 `algorithm-sync.config.json` 中的 `mathSourceDir` 同步。网站路径去除编号，以独立 Math 板块排在末尾；源文件保持不变。README 与原始总目录不作为正文发布。
