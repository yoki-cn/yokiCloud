---
kind: algorithm
title: Min_25 筛基础拆分
updated: 2026-10-12
status: draft
order: 1051500
tags:
  - 数论
---

对满足积性、且素数上 $f(p)$ 便于统计的函数，记 $\operatorname{spf}(n)$ 为最小素因子，先构造素数幂和或 $\sum_{p\le n}f(p)$ 的可计算表示，再按 $n$ 的最小素因子分解：


$$
\sum_{m\le x}f(m)=f(1)+\sum_{p\le x}\sum_{e\ge1:p^e\le x} f(p^e)\!\sum_{\substack{u\le x/p^e\\\operatorname{spf}(u)>p}}f(u).
$$


其中内层 $u=1$ 包含在内，约束 $\operatorname{spf}(1)=+\infty$。实现时为避免重复统计，必须严格使用“最小素因子大于 $p$”的条件。具体复杂度和公式依赖所处理的 $f$ 的素数幂形式；不是所有积性函数都可机械套用 $O(n^{2/3})$。
